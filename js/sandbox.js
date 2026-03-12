// Universe Timeline — Sandbox Mode
// Classic alchemy forge using corrected physics recipes.
// Only elements discovered in Story Mode are available.

const Sandbox = (function() {
  'use strict';

  let appState = null;
  let slot1 = null;
  let slot2 = null;
  let slot3 = null;
  let threeSlotMode = false;
  let selectedSlot = 1;

  function init(state) {
    appState = state;
    slot1 = null;
    slot2 = null;
    slot3 = null;
    threeSlotMode = false;
    selectedSlot = 1;

    setupEvents();
    renderGrid();
    updateSlots();
    updateStats();
  }

  function setupEvents() {
    const combineBtn = document.getElementById('sandbox-combine');
    if (combineBtn) {
      combineBtn.onclick = handleCombine;
    }

    const clearBtn = document.getElementById('sandbox-clear');
    if (clearBtn) {
      clearBtn.onclick = clearSlots;
    }

    const toggleBtn = document.getElementById('sandbox-toggle-slots');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        threeSlotMode = !threeSlotMode;
        toggleBtn.textContent = threeSlotMode ? '2-Slot' : '3-Slot';
        document.getElementById('sandbox-slot3-group').style.display = threeSlotMode ? 'flex' : 'none';
        if (!threeSlotMode) slot3 = null;
        updateSlots();
      };
    }

    const searchInput = document.getElementById('sandbox-search');
    if (searchInput) {
      searchInput.addEventListener('input', renderGrid);
    }
  }

  function getAvailableElements() {
    // Elements discovered in story mode + starting elements
    const available = new Set(appState.sandboxDiscovered || []);
    for (const id of STARTING_ELEMENTS) {
      available.add(id);
    }
    return [...available].filter(id => ELEMENTS[id]);
  }

  function renderGrid() {
    const grid = document.getElementById('sandbox-grid');
    if (!grid) return;

    const searchInput = document.getElementById('sandbox-search');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const elements = getAvailableElements();

    grid.innerHTML = '';

    // Group by era
    const byEra = {};
    for (const id of elements) {
      const el = ELEMENTS[id];
      if (!el) continue;
      if (search && !el.name.toLowerCase().includes(search) && !id.includes(search)) continue;
      const era = el.era || 1;
      if (!byEra[era]) byEra[era] = [];
      byEra[era].push(id);
    }

    const eraNames = ['', 'Fundamental', 'Composite', 'Atoms & Nuclear', 'Quantum', 'Applied'];

    for (const [era, ids] of Object.entries(byEra)) {
      const header = document.createElement('div');
      header.className = 'sandbox-era-header';
      header.textContent = eraNames[era] || `Era ${era}`;
      grid.appendChild(header);

      ids.sort((a, b) => ELEMENTS[a].name.localeCompare(ELEMENTS[b].name));

      for (const id of ids) {
        const el = ELEMENTS[id];
        const card = document.createElement('div');
        card.className = 'sandbox-card';
        if (id === slot1 || id === slot2 || id === slot3) card.classList.add('selected');

        card.innerHTML = `
          <span class="sandbox-symbol" style="color:${el.color}">${el.symbol}</span>
          <span class="sandbox-name">${el.name}</span>
        `;
        card.addEventListener('click', () => selectElement(id));
        grid.appendChild(card);
      }
    }

    // Show count
    const countEl = document.getElementById('sandbox-count');
    if (countEl) {
      countEl.textContent = `${elements.length} / ${Object.keys(ELEMENTS).length} elements unlocked`;
    }
  }

  function selectElement(id) {
    Audio.play('click');

    if (selectedSlot === 1 || (!slot1 && selectedSlot !== 2)) {
      slot1 = id;
      selectedSlot = 2;
    } else if (selectedSlot === 2 || (!slot2 && selectedSlot !== 3)) {
      slot2 = id;
      selectedSlot = threeSlotMode ? 3 : 1;
    } else if (threeSlotMode && (selectedSlot === 3 || !slot3)) {
      slot3 = id;
      selectedSlot = 1;
    } else {
      slot1 = id;
      selectedSlot = 2;
    }

    updateSlots();
    renderGrid();
  }

  function updateSlots() {
    renderSlot('sandbox-slot1', slot1);
    renderSlot('sandbox-slot2', slot2);
    renderSlot('sandbox-slot3', slot3);

    // Highlight active slot
    document.querySelectorAll('.sandbox-slot').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === selectedSlot);
    });

    // Combine button state
    const combineBtn = document.getElementById('sandbox-combine');
    if (combineBtn) {
      const ready = slot1 && slot2 && (!threeSlotMode || slot3);
      combineBtn.disabled = !ready;
    }

    // Preview
    updatePreview();
  }

  function renderSlot(id, elementId) {
    const slot = document.getElementById(id);
    if (!slot) return;

    if (elementId && ELEMENTS[elementId]) {
      const el = ELEMENTS[elementId];
      slot.innerHTML = `
        <span class="slot-symbol" style="color:${el.color}">${el.symbol}</span>
        <span class="slot-name">${el.name}</span>
      `;
      slot.className = 'sandbox-slot filled';
    } else {
      slot.innerHTML = '<span class="slot-empty">?</span>';
      slot.className = 'sandbox-slot empty';
    }
  }

  function updatePreview() {
    const preview = document.getElementById('sandbox-preview');
    if (!preview) return;

    const inputs = threeSlotMode ? [slot1, slot2, slot3] : [slot1, slot2];
    if (inputs.some(i => !i)) {
      preview.textContent = '';
      return;
    }

    const result = tryCombine(inputs);
    if (result) {
      const results = Array.isArray(result) ? result : [result];
      const allKnown = results.every(r => appState.sandboxDiscovered.includes(r) || appState.storyProgress.discoveries.includes(r));
      if (allKnown) {
        preview.textContent = results.map(r => ELEMENTS[r] ? ELEMENTS[r].name : '???').join(' + ');
        preview.style.color = ELEMENTS[results[0]] ? ELEMENTS[results[0]].color : '';
      } else {
        preview.textContent = '???';
        preview.style.color = '#666';
      }
    } else {
      preview.textContent = '';
    }
  }

  function handleCombine() {
    const inputs = threeSlotMode ? [slot1, slot2, slot3] : [slot1, slot2];
    if (inputs.some(i => !i)) return;

    const rawResult = tryCombine(inputs);
    const resultEl = document.getElementById('sandbox-result');

    if (rawResult) {
      const results = Array.isArray(rawResult) ? rawResult : [rawResult];

      if (results.some(r => !ELEMENTS[r])) {
        showResult(resultEl, 'No reaction.', 'failure');
        Audio.play('wrong');
      } else {
        let anyNew = false;
        const names = [];
        for (const r of results) {
          const el = ELEMENTS[r];
          const isNew = !appState.sandboxDiscovered.includes(r) && !appState.storyProgress.discoveries.includes(r);
          if (isNew) {
            anyNew = true;
            App.addDiscovery(r);
          }
          names.push(`<strong style="color:${el.color}">${el.name}</strong>`);
        }

        if (anyNew) {
          Audio.play('discovery');
          showResult(resultEl, `New discovery: ${names.join(' + ')}!`, 'success');
        } else {
          Audio.play('combine');
          showResult(resultEl, `Created: ${names.join(' + ')}`, 'known');
        }
      }
    } else {
      Audio.play('wrong');
      showResult(resultEl, 'No reaction.', 'failure');
    }

    clearSlots();
    renderGrid();
    updateStats();
  }

  function showResult(el, text, type) {
    if (!el) return;
    el.className = 'sandbox-result ' + type;
    el.innerHTML = text;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
  }

  function clearSlots() {
    slot1 = null;
    slot2 = null;
    slot3 = null;
    selectedSlot = 1;
    updateSlots();
    renderGrid();
  }

  function updateStats() {
    const statsEl = document.getElementById('sandbox-stats');
    if (!statsEl) return;
    const total = Object.keys(ELEMENTS).length;
    const discovered = getAvailableElements().length;
    statsEl.textContent = `${discovered}/${total} elements • Score: ${appState.storyProgress.totalScore}`;
  }

  return { init };
})();
