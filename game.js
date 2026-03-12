// ============================================================
// Quantum Forge v2 — Game Engine
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // STATE
  // ============================================================
  const SAVE_KEY = 'quantum_forge_save';

  // Fibonacci streak multipliers
  const STREAK_MULTIPLIERS = [1, 1, 2, 3, 5, 8, 13, 21];

  let state = {
    discovered: [],
    triedPairs: [],
    currentEra: 1,
    inventory: {},       // { elementId: count } — tracks stock
    mastery: {},         // { elementId: { timesCrafted: N } }
    achievements: [],    // unlocked achievement IDs
    stats: {
      totalCombinations: 0,
      successfulCombinations: 0,
      failedCombinations: 0,
      sessionDiscoveries: 0,
      consecutiveFails: 0,
      currentStreak: 0,
      bestStreak: 0,
      quantumEnergy: 0,
      stabilityMeter: 100
    },
    challenges: {},
    pinned: [],
    settings: { theme: 'dark' },
    firstTime: true,
    tutorialStep: 0  // 0=not started, 1-6=active, 7=complete
  };

  // UI state (not saved)
  let selectedSlot = 1;
  let slot1Element = null;
  let slot2Element = null;
  let recentDiscoveries = [];
  let activeScreen = 'title';
  let streakTimer = null;         // 60s inactivity timeout
  let decoherenceTimer = null;    // cooldown timer
  let viewMode = 'all';           // 'all' | 'useful' | 'pinned'
  let collapsedCategories = {};   // { categoryKey: true }
  let batchCount = 1;             // batch craft quantity

  // Challenge state
  let challengeMode = false;
  let currentChallenge = null;
  let challengeDiscovered = [];
  let challengeMoves = 0;
  let challengeSlot1 = null;
  let challengeSlot2 = null;

  // ============================================================
  // HELPERS
  // ============================================================

  // Is an element "fundamental" (infinite supply)?
  function isFundamental(elementId) {
    return STARTING_ELEMENTS.includes(elementId);
  }

  // Is an element a concept/phenomenon/force that never gets consumed?
  function isConceptual(elementId) {
    const el = ELEMENTS[elementId];
    if (!el) return false;
    const cat = el.category || '';
    return ['force', 'phenomenon', 'concept', 'application'].includes(cat);
  }

  // Is an element intermediate (always consumed)?
  function isIntermediate(elementId) {
    const el = ELEMENTS[elementId];
    return el && el.isIntermediate;
  }

  // Should this element be consumed when used as an input?
  function shouldConsume(elementId) {
    if (isFundamental(elementId)) return false;
    if (isConceptual(elementId)) return false;
    return true;  // intermediates and composites/atoms are consumed
  }

  // Get stock count for an element
  function getStock(elementId) {
    if (isFundamental(elementId)) return Infinity;
    if (isConceptual(elementId)) return Infinity;
    return state.inventory[elementId] || 0;
  }

  // Add stock
  function addStock(elementId, count) {
    if (isFundamental(elementId) || isConceptual(elementId)) return;
    state.inventory[elementId] = (state.inventory[elementId] || 0) + count;
  }

  // Remove stock
  function removeStock(elementId, count) {
    if (!shouldConsume(elementId)) return;
    state.inventory[elementId] = Math.max(0, (state.inventory[elementId] || 0) - count);
  }

  // Get streak Fibonacci multiplier
  function getStreakMultiplier(streak) {
    if (streak <= 0) return 1;
    if (streak >= STREAK_MULTIPLIERS.length) return STREAK_MULTIPLIERS[STREAK_MULTIPLIERS.length - 1];
    return STREAK_MULTIPLIERS[streak];
  }

  // Get mastery level for an element
  function getMasteryLevel(elementId) {
    const m = state.mastery[elementId];
    if (!m) return { level: 'novice', label: 'Novice', timesCrafted: 0 };
    const t = m.timesCrafted;
    if (t >= 15) return { level: 'master', label: 'Master', timesCrafted: t };
    if (t >= 7) return { level: 'proficient', label: 'Proficient', timesCrafted: t };
    if (t >= 3) return { level: 'familiar', label: 'Familiar', timesCrafted: t };
    return { level: 'novice', label: 'Novice', timesCrafted: t };
  }

  // Yield per craft — always 1, use batch crafting for multiples
  function getYield(elementId, isDiscovery) {
    return 1;
  }

  // Get forge evolution tier
  function getForgeTier() {
    const count = state.discovered.filter(id => ELEMENTS[id] && ELEMENTS[id].era <= 5).length;
    if (count >= 92) return 5;
    if (count >= 75) return 4;
    if (count >= 50) return 3;
    if (count >= 25) return 2;
    if (count >= 10) return 1;
    return 0;
  }

  // ============================================================
  // SAVE / LOAD
  // ============================================================
  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save game:', e);
    }
  }

  function loadGame() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults for new fields
        state = {
          ...state,
          ...parsed,
          stats: { ...state.stats, ...(parsed.stats || {}) },
          inventory: parsed.inventory || {},
          mastery: parsed.mastery || {},
          achievements: parsed.achievements || [],
          pinned: parsed.pinned || []
        };
        // Migrate old saves: firstTime boolean → tutorialStep
        if (typeof state.tutorialStep === 'undefined') {
          if (state.firstTime === true) {
            state.tutorialStep = 1;
          } else {
            state.tutorialStep = TUTORIAL_COMPLETE + 1;
          }
        }
        // Migrate from old 7-step tutorial to new 12-step
        if (state.tutorialStep === 7 && state.discovered.length > 6) {
          state.tutorialStep = TUTORIAL_COMPLETE + 1;
        }
        return true;
      }
    } catch (e) {
      console.warn('Could not load save:', e);
    }
    return false;
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    state = {
      discovered: [],
      triedPairs: [],
      currentEra: 1,
      inventory: {},
      mastery: {},
      achievements: [],
      stats: {
        totalCombinations: 0,
        successfulCombinations: 0,
        failedCombinations: 0,
        sessionDiscoveries: 0,
        consecutiveFails: 0,
        currentStreak: 0,
        bestStreak: 0,
        quantumEnergy: 0,
        stabilityMeter: 100
      },
      challenges: {},
      settings: { theme: 'dark' },
      firstTime: true,
      tutorialStep: 0
    };
    recentDiscoveries = [];
  }

  // ============================================================
  // SCREEN MANAGEMENT
  // ============================================================
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId + '-screen');
    if (screen) {
      screen.classList.add('active');
      activeScreen = screenId;
    }
  }

  function hideAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  }

  function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
  }

  function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  // ============================================================
  // ELEMENT RENDERING
  // ============================================================
  function createElementCard(elementId, clickHandler, options) {
    const el = ELEMENTS[elementId];
    if (!el) return null;
    options = options || {};

    const card = document.createElement('div');
    card.className = 'element-card';
    card.dataset.elementId = elementId;

    // Mastery ring
    const masteryInfo = getMasteryLevel(elementId);
    if (masteryInfo.level !== 'novice') {
      card.classList.add('mastery-' + masteryInfo.level);
    }

    const sym = document.createElement('div');
    sym.className = `element-symbol era-${el.era}`;
    sym.style.borderColor = el.color;
    sym.style.color = el.color;
    sym.textContent = el.symbol;

    const name = document.createElement('span');
    name.className = 'element-name';
    name.textContent = el.name;

    card.appendChild(sym);
    card.appendChild(name);

    // Role subtitle
    if (el.role) {
      const role = document.createElement('span');
      role.className = 'element-role';
      role.textContent = el.role;
      card.appendChild(role);
    }

    // Stock badge
    if (options.showStock !== false) {
      const stock = getStock(elementId);
      if (stock === Infinity) {
        const badge = document.createElement('span');
        badge.className = 'stock-badge infinite';
        badge.textContent = '\u221E';
        badge.title = 'Infinite supply';
        card.appendChild(badge);
      } else if (stock > 0) {
        const badge = document.createElement('span');
        badge.className = 'stock-badge' + (stock <= 2 ? ' low' : '');
        badge.textContent = stock;
        badge.title = `${stock} in stock`;
        card.appendChild(badge);
      } else {
        // Zero stock — dim the card
        card.classList.add('no-stock');
        const badge = document.createElement('span');
        badge.className = 'stock-badge empty';
        badge.textContent = '0';
        card.appendChild(badge);
      }
    }

    // Combo count badge
    if (options.showBadge !== false) {
      const count = getUndiscoveredComboCount(elementId);
      if (count > 0) {
        const badge = document.createElement('span');
        badge.className = 'combo-badge';
        badge.textContent = count;
        badge.title = `${count} undiscovered reaction${count > 1 ? 's' : ''} available`;
        card.appendChild(badge);
      }
    }

    card.addEventListener('click', () => clickHandler(elementId));

    // Long-press to pin (mobile touch support)
    let longPressTimer = null;
    card.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        e.preventDefault();
        togglePin(elementId);
      }, 500);
    }, { passive: false });
    card.addEventListener('touchend', () => { if (longPressTimer) clearTimeout(longPressTimer); });
    card.addEventListener('touchmove', () => { if (longPressTimer) clearTimeout(longPressTimer); });

    return card;
  }

  function getUndiscoveredComboCount(elementId) {
    const hints = RECIPES_BY_INPUT[elementId] || [];
    let count = 0;
    const seen = new Set();
    for (const h of hints) {
      if (state.discovered.includes(h.partner) && !state.discovered.includes(h.result) && !seen.has(h.result)) {
        count++;
        seen.add(h.result);
      }
    }
    return count;
  }

  function createSymbolElement(elementId, sizeClass) {
    const el = ELEMENTS[elementId];
    if (!el) return null;
    const sym = document.createElement('div');
    sym.className = `element-symbol ${sizeClass || ''} era-${el.era}`;
    sym.style.borderColor = el.color;
    sym.style.color = el.color;
    sym.textContent = el.symbol;
    return sym;
  }

  // ============================================================
  // MAIN GAME — ELEMENT GRID (Category-Grouped)
  // ============================================================

  // Category definitions: order, label, icon, matching element categories
  const CATEGORY_SECTIONS = [
    { key: 'fundamentals', label: 'Fundamentals', icon: '\u2B50', match: id => STARTING_ELEMENTS.includes(id) },
    { key: 'matter',       label: 'Matter',       icon: '\u26AA', match: id => !STARTING_ELEMENTS.includes(id) && ELEMENTS[id] && ELEMENTS[id].category === 'matter' },
    { key: 'composite',    label: 'Composites',   icon: '\u26AB', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'composite' },
    { key: 'force',        label: 'Forces',        icon: '\u26A1', match: id => !STARTING_ELEMENTS.includes(id) && ELEMENTS[id] && ELEMENTS[id].category === 'force' },
    { key: 'atom',         label: 'Atoms',         icon: '\u269B', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'atom' },
    { key: 'nuclear',      label: 'Nuclear',       icon: '\u2622', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'nuclear' },
    { key: 'phenomenon',   label: 'Phenomena',     icon: '\u2728', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'phenomenon' },
    { key: 'concept',      label: 'Concepts',      icon: '\uD83D\uDCA1', match: id => !STARTING_ELEMENTS.includes(id) && ELEMENTS[id] && ELEMENTS[id].category === 'concept' },
    { key: 'application',  label: 'Applications',  icon: '\u2699', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'application' },
    { key: 'hidden',       label: 'Hidden',        icon: '\uD83D\uDD75', match: id => ELEMENTS[id] && ELEMENTS[id].category === 'hidden' }
  ];

  function renderPinnedRow() {
    const row = document.getElementById('pinned-row');
    if (!row) return;
    const pinned = state.pinned || [];
    if (pinned.length === 0) {
      row.style.display = 'none';
      return;
    }
    row.style.display = 'flex';
    row.innerHTML = '';
    for (const id of pinned) {
      if (!state.discovered.includes(id)) continue;
      const el = ELEMENTS[id];
      if (!el) continue;
      const chip = document.createElement('div');
      chip.className = 'pinned-chip';
      chip.style.borderColor = el.color;
      chip.style.color = el.color;
      chip.textContent = el.symbol;
      chip.title = el.name;
      chip.addEventListener('click', () => handleElementClick(id));
      chip.addEventListener('contextmenu', (e) => { e.preventDefault(); togglePin(id); });
      row.appendChild(chip);
    }
  }

  function togglePin(elementId) {
    if (!state.pinned) state.pinned = [];
    const idx = state.pinned.indexOf(elementId);
    if (idx >= 0) {
      state.pinned.splice(idx, 1);
    } else {
      state.pinned.push(elementId);
    }
    saveGame();
    renderPinnedRow();
    renderElementGrid();
  }

  function renderElementGrid() {
    const grid = document.getElementById('element-grid');
    const search = document.getElementById('element-search').value.toLowerCase();

    grid.innerHTML = '';

    // "Known Combos" section — show discovered recipes when one slot is filled
    const slotted = slot1Element && !slot2Element ? slot1Element : slot2Element && !slot1Element ? slot2Element : null;
    if (slotted && !search) {
      const hints = RECIPES_BY_INPUT[slotted] || [];
      const seenPartners = new Set();
      const knownCombos = [];
      for (const h of hints) {
        if (!state.discovered.includes(h.partner)) continue;
        if (!state.discovered.includes(h.result)) continue;
        if (seenPartners.has(h.partner)) continue;
        seenPartners.add(h.partner);
        knownCombos.push({ partner: h.partner, result: h.result });
      }

      if (knownCombos.length > 0) {
        const comboHeader = document.createElement('div');
        comboHeader.className = 'category-header combo-header';
        const slottedEl = ELEMENTS[slotted];
        comboHeader.innerHTML = `
          <span class="category-icon">\u{1F517}</span>
          <span class="category-label">Combos for ${slottedEl.name}</span>
          <span class="category-count">${knownCombos.length}</span>
        `;
        grid.appendChild(comboHeader);

        const comboSection = document.createElement('div');
        comboSection.className = 'category-section';
        for (const h of knownCombos) {
          const card = createElementCard(h.partner, handleElementClick);
          if (h.partner === slot1Element || h.partner === slot2Element) card.classList.add('selected');
          const resultEl = ELEMENTS[h.result];
          if (resultEl) {
            const tag = document.createElement('span');
            tag.className = 'combo-result-tag';
            tag.textContent = '\u2192 ' + resultEl.name;
            tag.style.color = resultEl.color;
            card.appendChild(tag);
          }
          card.addEventListener('contextmenu', (e) => { e.preventDefault(); togglePin(h.partner); });
          comboSection.appendChild(card);
        }
        grid.appendChild(comboSection);
      }
    }

    // Filter discovered elements
    let pool = [...state.discovered];

    // Apply search filter
    if (search) {
      pool = pool.filter(id => {
        const el = ELEMENTS[id];
        return el && (el.name.toLowerCase().includes(search) || id.includes(search));
      });
    }

    // Apply view mode filter
    if (viewMode === 'useful') {
      pool = pool.filter(id => isFundamental(id) || getUndiscoveredComboCount(id) > 0);
    } else if (viewMode === 'pinned') {
      pool = pool.filter(id => (state.pinned || []).includes(id));
    }

    // Group by category
    for (const cat of CATEGORY_SECTIONS) {
      const elements = pool.filter(cat.match);
      if (elements.length === 0) continue;

      // Don't show hidden section until at least one is discovered
      if (cat.key === 'hidden' && !state.discovered.some(id => ELEMENTS[id] && ELEMENTS[id].category === 'hidden')) continue;

      // Count total discoverable in this category
      const totalInCategory = Object.keys(ELEMENTS).filter(cat.match).length;

      // Section header
      const header = document.createElement('div');
      header.className = 'category-header';
      if (collapsedCategories[cat.key]) header.classList.add('collapsed');
      header.innerHTML = `
        <span class="category-icon">${cat.icon}</span>
        <span class="category-label">${cat.label}</span>
        <span class="category-count">${elements.length}/${totalInCategory}</span>
        <span class="category-chevron">${collapsedCategories[cat.key] ? '\u25B6' : '\u25BC'}</span>
      `;
      header.addEventListener('click', () => {
        collapsedCategories[cat.key] = !collapsedCategories[cat.key];
        renderElementGrid();
      });
      grid.appendChild(header);

      // Section body (collapsible)
      if (!collapsedCategories[cat.key]) {
        const section = document.createElement('div');
        section.className = 'category-section';

        // Sort: elements with undiscovered combos first, then alphabetical
        elements.sort((a, b) => {
          const ca = getUndiscoveredComboCount(a), cb = getUndiscoveredComboCount(b);
          if (ca > 0 && cb === 0) return -1;
          if (cb > 0 && ca === 0) return 1;
          return ELEMENTS[a].name.localeCompare(ELEMENTS[b].name);
        });

        for (const id of elements) {
          const card = createElementCard(id, handleElementClick);
          if (id === slot1Element || id === slot2Element) {
            card.classList.add('selected');
          }
          if (getUndiscoveredComboCount(id) > 0) {
            card.classList.add('has-combos');
          }
          if ((state.pinned || []).includes(id)) {
            card.classList.add('is-pinned');
          }
          // Right-click to toggle pin
          card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            togglePin(id);
          });
          section.appendChild(card);
        }
        grid.appendChild(section);
      }
    }

    renderPinnedRow();
  }

  function handleElementClick(elementId) {
    // Check if forge is in decoherence
    if (state.stats.stabilityMeter <= 0 && decoherenceTimer) return;

    // Check stock — offer quick-recraft if out
    const stock = getStock(elementId);
    if (stock <= 0 && shouldConsume(elementId)) {
      offerRecraft(elementId);
      return;
    }

    SFX.play('click');
    batchCount = 1;

    if (slot1Element === null) {
      slot1Element = elementId;
      selectedSlot = 2;
    } else if (slot2Element === null) {
      slot2Element = elementId;
    } else {
      slot1Element = slot2Element;
      slot2Element = elementId;
    }

    updateForgeSlots();
    renderElementGrid();
    showElementInfo(elementId);

    // Tutorial progression
    if (state.tutorialStep === 2 && elementId === 'up_quark' && slot1Element === 'up_quark') {
      advanceTutorial(3);
    } else if (state.tutorialStep === 3 && elementId === 'up_quark' && slot2Element === 'up_quark') {
      advanceTutorial(4);
    } else if (state.tutorialStep === 7 && elementId === 'diquark_uu' && slot1Element === 'diquark_uu') {
      advanceTutorial(8);
    } else if (state.tutorialStep === 8 && elementId === 'down_quark' && slot2Element === 'down_quark') {
      advanceTutorial(9);
    }
  }

  function updateForgeSlots() {
    const s1 = document.getElementById('slot-1');
    const s2 = document.getElementById('slot-2');
    const combineBtn = document.getElementById('btn-combine');

    renderSlot(s1, slot1Element);
    renderSlot(s2, slot2Element);

    combineBtn.disabled = !(slot1Element && slot2Element);

    // Update forge preview
    updateForgePreview();

    // Show batch craft bar for known recipes
    updateBatchCraftBar();
  }

  function updateForgePreview() {
    const preview = document.getElementById('forge-preview');
    const nameEl = document.getElementById('forge-preview-name');
    if (!preview || !nameEl) return;

    if (!slot1Element || !slot2Element) {
      preview.style.display = 'none';
      return;
    }

    preview.style.display = 'flex';
    const result = tryCombine(slot1Element, slot2Element);

    if (result && state.discovered.includes(result)) {
      const el = ELEMENTS[result];
      nameEl.textContent = el.name;
      nameEl.setAttribute('data-text', el.name);
      nameEl.className = 'forge-preview-name known';
      nameEl.style.color = el.color;
    } else {
      nameEl.textContent = '???';
      nameEl.setAttribute('data-text', '???');
      nameEl.className = 'forge-preview-name unknown';
      nameEl.style.color = '';
    }
  }

  function getMaxBatchCrafts(input1, input2) {
    if (!input1 || !input2) return 0;
    const s1 = shouldConsume(input1) ? getStock(input1) : Infinity;
    const s2 = shouldConsume(input2) ? getStock(input2) : Infinity;
    if (input1 === input2) {
      return shouldConsume(input1) ? Math.floor(s1 / 2) : Infinity;
    }
    return Math.min(s1, s2);
  }

  function triggerBatchGlitch(btnId) {
    const btn = document.getElementById(btnId);
    const countEl = document.getElementById('batch-count');
    if (btn) {
      btn.classList.remove('glitch-shake');
      void btn.offsetWidth; // reflow to restart animation
      btn.classList.add('glitch-shake');
      btn.addEventListener('animationend', () => btn.classList.remove('glitch-shake'), { once: true });
    }
    if (countEl) {
      countEl.classList.remove('glitch-shake');
      void countEl.offsetWidth;
      countEl.classList.add('glitch-shake');
      countEl.addEventListener('animationend', () => countEl.classList.remove('glitch-shake'), { once: true });
    }
  }

  function updateBatchCraftBar() {
    const bar = document.getElementById('batch-craft');
    if (!bar) return;

    // Only show for known recipes (result already discovered)
    if (!slot1Element || !slot2Element) {
      bar.style.display = 'none';
      return;
    }
    const result = tryCombine(slot1Element, slot2Element);
    if (!result || !state.discovered.includes(result)) {
      bar.style.display = 'none';
      return;
    }

    const maxCrafts = getMaxBatchCrafts(slot1Element, slot2Element);
    if (maxCrafts <= 1) {
      bar.style.display = 'none';
      return;
    }

    // Cap display at reasonable max
    const cap = Math.min(maxCrafts, 99);
    batchCount = Math.max(1, Math.min(batchCount, cap));

    bar.style.display = 'flex';
    document.getElementById('batch-count').textContent = batchCount;
    document.getElementById('btn-batch-craft').textContent = 'Craft x' + batchCount;

    // Disable +/- at bounds
    document.getElementById('batch-minus').disabled = batchCount <= 1;
    document.getElementById('batch-plus').disabled = batchCount >= cap;

    // Show max hint
    let hint = bar.querySelector('.batch-max-hint');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'batch-max-hint';
      bar.appendChild(hint);
    }
    hint.textContent = maxCrafts === Infinity ? '' : `(max ${cap})`;
  }

  function renderSlot(slotEl, elementId) {
    slotEl.innerHTML = '';
    if (elementId) {
      const el = ELEMENTS[elementId];
      slotEl.classList.add('filled');
      const sym = createSymbolElement(elementId);
      const name = document.createElement('span');
      name.className = 'element-name';
      name.textContent = el.name;
      slotEl.appendChild(sym);
      slotEl.appendChild(name);
    } else {
      slotEl.classList.remove('filled');
      const ph = document.createElement('span');
      ph.className = 'slot-placeholder';
      ph.textContent = 'Select an element';
      slotEl.appendChild(ph);
    }
  }

  // ============================================================
  // FORGE MESSAGE HELPER
  // ============================================================
  function showForgeMessage(text, type) {
    const resultEl = document.getElementById('forge-result');
    resultEl.style.display = 'block';
    resultEl.className = 'forge-result ' + (type || 'failure');
    resultEl.innerHTML = `<div class="result-text">${text}</div>`;
  }

  // ============================================================
  // BATCH CRAFT — craft N of a known recipe at once
  // ============================================================
  function handleBatchCraft() {
    if (!slot1Element || !slot2Element) return;
    const result = tryCombine(slot1Element, slot2Element);
    if (!result || !state.discovered.includes(result)) return;

    const input1 = slot1Element;
    const input2 = slot2Element;
    const maxCrafts = getMaxBatchCrafts(input1, input2);
    if (maxCrafts < 1) {
      offerRecraft(input1);
      return;
    }
    const count = Math.max(1, Math.min(batchCount, maxCrafts));

    // Consume inputs
    if (input1 === input2) {
      removeStock(input1, count * 2);
    } else {
      removeStock(input1, count);
      removeStock(input2, count);
    }

    // Each craft updates mastery
    for (let i = 0; i < count; i++) {
      updateMastery(result);
    }

    // Add crafted items (1 per craft)
    addStock(result, count);

    // Stats
    state.stats.totalCombinations += count;
    state.stats.successfulCombinations += count;
    state.stats.consecutiveFails = 0;
    updateStreak(true);

    // QE — calculate manually for batch (awardQE has side effects)
    const el = ELEMENTS[result];
    const base = 2;
    const eraBonus = (el.era - 1) * 5;
    const mult = getStreakMultiplier(state.stats.currentStreak);
    const qePer = Math.round((base + eraBonus) * mult);
    const qeEarned = qePer * count;
    state.stats.quantumEnergy += qeEarned;
    showQEFloat(qeEarned);

    updateStability(5);
    playCombineAnimation('known');

    const resultEl = document.getElementById('forge-result');
    resultEl.style.display = 'block';
    resultEl.className = 'forge-result already';
    resultEl.innerHTML = `<div class="result-text">Batch crafted <strong style="color:${el.color}">${el.name} x${count}</strong> <span class="qe-earned-inline">+${qeEarned} QE</span></div>`;

    // Clear slots
    slot1Element = null;
    slot2Element = null;
    selectedSlot = 1;
    batchCount = 1;
    updateForgeSlots();
    renderElementGrid();
    renderRecentDiscoveries();
    renderResearchNotes();
    updateTopBar();
    updateStreakDisplay();
    updateStabilityDisplay();
    updateForgeEvolution();
    checkAchievements();
    saveGame();
  }

  // ============================================================
  // RECRAFT HELPER — offer to load a recipe when out of stock
  // ============================================================
  function offerRecraft(elementId) {
    const el = ELEMENTS[elementId];
    if (!el) return;

    // Find a known recipe where both inputs are available
    const recipes = getRecipesFor(elementId);
    let bestRecipe = null;
    for (const [a, b] of recipes) {
      if (!state.discovered.includes(a) || !state.discovered.includes(b)) continue;
      const stockA = getStock(a);
      const stockB = getStock(b);
      const needA = a === b ? 2 : 1;
      const needB = a === b ? 0 : 1;
      if (stockA >= needA && stockB >= needB) {
        bestRecipe = [a, b];
        break;
      }
    }

    const resultEl = document.getElementById('forge-result');
    resultEl.style.display = 'block';

    if (bestRecipe) {
      const elA = ELEMENTS[bestRecipe[0]], elB = ELEMENTS[bestRecipe[1]];
      resultEl.className = 'forge-result recraft';
      resultEl.innerHTML = `
        <div class="result-text">
          <strong style="color:${el.color}">${el.name}</strong> is out of stock!
        </div>
        <button class="btn btn-recraft" id="btn-recraft">
          Recraft: <span style="color:${elA.color}">${elA.name}</span> + <span style="color:${elB.color}">${elB.name}</span>
        </button>
      `;
      document.getElementById('btn-recraft').addEventListener('click', () => {
        slot1Element = bestRecipe[0];
        slot2Element = bestRecipe[1];
        updateForgeSlots();
        renderElementGrid();
        resultEl.style.display = 'none';
      });
    } else {
      // No craftable recipe — show what's needed with clickable ingredient links
      resultEl.className = 'forge-result recraft';
      let recipeHTML = '';
      for (const [a, b] of recipes) {
        if (!state.discovered.includes(a) || !state.discovered.includes(b)) continue;
        const elA = ELEMENTS[a], elB = ELEMENTS[b];
        const stockA = getStock(a), stockB = getStock(b);
        const aLabel = stockA <= 0 ? `${elA.name} (0)` : `${elA.name} (${stockA === Infinity ? '\u221E' : stockA})`;
        const bLabel = stockB <= 0 ? `${elB.name} (0)` : `${elB.name} (${stockB === Infinity ? '\u221E' : stockB})`;
        recipeHTML = `
          <span class="recraft-link" data-id="${a}" style="color:${elA.color}">${aLabel}</span>
          +
          <span class="recraft-link" data-id="${b}" style="color:${elB.color}">${bLabel}</span>
        `;
        break;
      }
      resultEl.innerHTML = `
        <div class="result-text">
          <strong style="color:${el.color}">${el.name}</strong> is out of stock!
        </div>
        ${recipeHTML ? `<div class="result-text recraft-recipe">Needs: ${recipeHTML}</div>` : ''}
      `;
      // Wire up clickable ingredient links
      resultEl.querySelectorAll('.recraft-link').forEach(link => {
        link.addEventListener('click', () => {
          const id = link.dataset.id;
          resultEl.style.display = 'none';
          if (getStock(id) <= 0 && shouldConsume(id)) {
            offerRecraft(id);
          } else {
            showElementInfo(id);
          }
        });
      });
    }
  }

  // ============================================================
  // COMBINING — the core loop
  // ============================================================
  function getPairKey(a, b) {
    return [a, b].sort().join('|');
  }

  function hasTriedPair(a, b) {
    if (!state.triedPairs) state.triedPairs = [];
    return state.triedPairs.includes(getPairKey(a, b));
  }

  function markPairTried(a, b) {
    if (!state.triedPairs) state.triedPairs = [];
    const key = getPairKey(a, b);
    if (!state.triedPairs.includes(key)) {
      state.triedPairs.push(key);
    }
  }

  function handleCombine() {
    if (!slot1Element || !slot2Element) return;

    // Check decoherence lockout
    if (state.stats.stabilityMeter <= 0 && decoherenceTimer) {
      showForgeMessage('Forge is destabilized! Wait for recalibration.', 'failure');
      return;
    }

    // Check stock for consumable inputs
    const input1 = slot1Element;
    const input2 = slot2Element;

    // Special case: same element in both slots needs 2 stock
    if (input1 === input2 && shouldConsume(input1)) {
      if (getStock(input1) < 2) {
        offerRecraft(input1);
        return;
      }
    } else {
      if (shouldConsume(input1) && getStock(input1) < 1) {
        offerRecraft(input1);
        return;
      }
      if (shouldConsume(input2) && getStock(input2) < 1) {
        offerRecraft(input2);
        return;
      }
    }

    const alreadyTried = hasTriedPair(input1, input2);
    state.stats.totalCombinations++;
    markPairTried(input1, input2);

    const result = tryCombine(input1, input2);
    const resultEl = document.getElementById('forge-result');
    resultEl.style.display = 'block';

    if (result) {
      const el = ELEMENTS[result];
      if (!el) {
        onCombineFail(resultEl, input1, input2, alreadyTried);
        return;
      }

      // Consume inputs
      if (input1 === input2) {
        removeStock(input1, 2);
      } else {
        removeStock(input1, 1);
        removeStock(input2, 1);
      }

      const isNew = !state.discovered.includes(result);

      // Yield scaling: first discovery = 1, subsequent crafts scale with mastery
      const yield_ = getYield(result, isNew);

      // Add output to inventory
      addStock(result, yield_);

      // Update mastery
      updateMastery(result);

      const yieldText = yield_ > 1 ? ` x${yield_}` : '';

      if (isNew) {
        // New discovery!
        state.discovered.push(result);
        state.stats.successfulCombinations++;
        state.stats.sessionDiscoveries++;
        state.stats.consecutiveFails = 0;

        updateCurrentEra();

        // Streak
        updateStreak(true);

        // QE
        const qeEarned = awardQE(result, true);

        // Stability boost
        updateStability(5);

        // Animation
        playCombineAnimation('discovery');

        // Add to recent
        recentDiscoveries.unshift(result);
        if (recentDiscoveries.length > 8) recentDiscoveries.pop();

        resultEl.className = 'forge-result success';
        resultEl.innerHTML = `<div class="result-text">New discovery: <strong style="color:${el.color}">${el.name}</strong> <span class="qe-earned-inline">+${qeEarned} QE</span></div>`;

        // Show discovery modal
        showDiscoveryModal(result, qeEarned);

        // Tutorial: advance after crafts
        if (state.tutorialStep === 4) {
          advanceTutorial(5);  // diquark crafted → silent wait for modal
        } else if (state.tutorialStep === 9) {
          advanceTutorial(10); // proton crafted → silent wait for modal
        }

        // Check achievements
        checkAchievements();

        saveGame();
      } else {
        // Already discovered — still a successful craft
        state.stats.successfulCombinations++;
        state.stats.consecutiveFails = 0;

        // Streak
        updateStreak(true);

        // QE (less for re-craft)
        const qeEarned = awardQE(result, false);

        // Stability boost
        updateStability(5);

        // Animation
        playCombineAnimation('known');

        resultEl.className = 'forge-result already';
        resultEl.innerHTML = `<div class="result-text">Created <strong style="color:${el.color}">${el.name}${yieldText}</strong> <span class="qe-earned-inline">+${qeEarned} QE</span></div>`;
      }
    } else {
      onCombineFail(resultEl, input1, input2, alreadyTried);
    }

    // Clear slots
    slot1Element = null;
    slot2Element = null;
    selectedSlot = 1;
    updateForgeSlots();
    renderElementGrid();
    renderRecentDiscoveries();
    renderResearchNotes();
    updateTopBar();
    updateStreakDisplay();
    updateStabilityDisplay();
    updateForgeEvolution();
    saveGame();
  }

  function onCombineFail(resultEl, input1, input2, alreadyTried) {
    state.stats.failedCombinations++;
    state.stats.consecutiveFails++;

    // Streak broken
    updateStreak(false);

    // Stability loss
    updateStability(-15);

    // Animation
    playCombineAnimation('fail');

    showFailResult(resultEl, input1, input2, alreadyTried);

    // Hint system
    const hintThreshold = Math.min(state.currentEra + 2, 5);
    if (state.stats.consecutiveFails >= hintThreshold + 2) {
      showHint(getSpecificHint());
    } else if (state.stats.consecutiveFails >= hintThreshold) {
      showHint(getGenericHint());
    }

    // Check achievements even on fail (for streak-related ones)
    checkAchievements();
  }

  // ============================================================
  // STABILITY METER
  // ============================================================
  function updateStability(delta) {
    state.stats.stabilityMeter = Math.max(0, Math.min(100, state.stats.stabilityMeter + delta));

    if (state.stats.stabilityMeter <= 0 && !decoherenceTimer) {
      startDecoherence();
    } else if (state.stats.stabilityMeter > 0 && state.stats.stabilityMeter < 30) {
      SFX.play('crackle');
    }

    updateStabilityDisplay();
  }

  function updateStabilityDisplay() {
    const bar = document.getElementById('stability-bar');
    const text = document.getElementById('stability-text');
    if (!bar) return;

    const pct = state.stats.stabilityMeter;
    bar.style.width = pct + '%';
    text.textContent = Math.round(pct) + '%';

    // Color transition
    if (pct > 60) {
      bar.style.background = 'var(--accent-green, #00e676)';
    } else if (pct > 30) {
      bar.style.background = 'var(--accent-gold, #ffd740)';
    } else {
      bar.style.background = 'var(--accent-red, #ff5252)';
    }
  }

  function startDecoherence() {
    const overlay = document.getElementById('decoherence-overlay');
    const countdown = document.getElementById('decoherence-countdown');
    overlay.style.display = 'flex';
    SFX.play('decoherence');

    let remaining = 30;
    countdown.textContent = remaining;

    decoherenceTimer = setInterval(() => {
      remaining--;
      countdown.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(decoherenceTimer);
        decoherenceTimer = null;
        overlay.style.display = 'none';
        state.stats.stabilityMeter = 50; // Recover to 50%
        updateStabilityDisplay();
        saveGame();
      }
    }, 1000);
  }

  // ============================================================
  // STREAK SYSTEM
  // ============================================================
  function updateStreak(success) {
    if (success) {
      state.stats.currentStreak++;
      if (state.stats.currentStreak > state.stats.bestStreak) {
        state.stats.bestStreak = state.stats.currentStreak;
      }

      // Streak milestone sounds at 3, 5, 8+
      const s = state.stats.currentStreak;
      if (s === 3 || s === 5 || s >= 8) {
        SFX.play('streak', Math.min(s, 12));
      }

      // Reset inactivity timer
      clearTimeout(streakTimer);
      streakTimer = setTimeout(() => {
        state.stats.currentStreak = 0;
        updateStreakDisplay();
        saveGame();
      }, 60000); // 60s
    } else {
      state.stats.currentStreak = 0;
      clearTimeout(streakTimer);
    }

    updateStreakDisplay();

    // Update ambient music intensity
    if (typeof AMBIENCE !== 'undefined') {
      if (success) {
        AMBIENCE.onStreak(state.stats.currentStreak);
      } else {
        AMBIENCE.onStreakBreak();
      }
    }
  }

  function updateStreakDisplay() {
    const display = document.getElementById('streak-display');
    const countEl = document.getElementById('streak-count');
    const multEl = document.getElementById('streak-multiplier');
    if (!display) return;

    const streak = state.stats.currentStreak;
    if (streak >= 2) {
      display.style.display = 'flex';
      countEl.textContent = streak;
      multEl.textContent = 'x' + getStreakMultiplier(streak);

      // Glow intensity based on streak
      const forgeArea = document.getElementById('forge-area');
      forgeArea.className = 'forge-area';
      if (streak >= 10) forgeArea.classList.add('streak-glow-10');
      else if (streak >= 5) forgeArea.classList.add('streak-glow-5');
      else if (streak >= 3) forgeArea.classList.add('streak-glow-3');
      else if (streak >= 2) forgeArea.classList.add('streak-glow-2');
    } else {
      display.style.display = 'none';
      const forgeArea = document.getElementById('forge-area');
      if (forgeArea) forgeArea.className = 'forge-area';
    }
  }

  // ============================================================
  // QE (QUANTUM ENERGY) SYSTEM
  // ============================================================
  function awardQE(elementId, isNewDiscovery) {
    const el = ELEMENTS[elementId];
    if (!el) return 0;

    // Base QE: 10 for new discovery, 2 for re-craft
    let base = isNewDiscovery ? 10 : 2;

    // Era bonus: +5 per era beyond 1
    const eraBonus = (el.era - 1) * 5;

    // Streak multiplier
    const mult = getStreakMultiplier(state.stats.currentStreak);

    const total = Math.round((base + eraBonus) * mult);
    state.stats.quantumEnergy += total;

    // Float animation
    showQEFloat(total);

    return total;
  }

  function showQEFloat(amount) {
    const container = document.getElementById('qe-float-container');
    if (!container) return;

    const float = document.createElement('div');
    float.className = 'qe-float';
    float.textContent = '+' + amount + ' QE';
    container.appendChild(float);

    // Remove after animation
    setTimeout(() => float.remove(), 1500);
  }

  // ============================================================
  // MASTERY SYSTEM
  // ============================================================
  function updateMastery(elementId) {
    if (!state.mastery[elementId]) {
      state.mastery[elementId] = { timesCrafted: 0 };
    }
    state.mastery[elementId].timesCrafted++;
  }

  // ============================================================
  // ACHIEVEMENT SYSTEM
  // ============================================================
  function checkAchievements() {
    if (typeof ACHIEVEMENTS === 'undefined') return;

    for (const achievement of ACHIEVEMENTS) {
      if (state.achievements.includes(achievement.id)) continue;

      try {
        if (achievement.check(state)) {
          state.achievements.push(achievement.id);
          showAchievementToast(achievement);
        }
      } catch (e) {
        // Achievement check error — skip silently
      }
    }
  }

  function showAchievementToast(achievement) {
    const toast = document.getElementById('achievement-toast');
    const title = document.getElementById('achievement-toast-title');
    const desc = document.getElementById('achievement-toast-desc');
    if (!toast) return;

    title.textContent = achievement.name;
    desc.textContent = achievement.description;
    toast.className = 'achievement-toast tier-' + achievement.tier;
    toast.style.display = 'flex';
    SFX.play('achievement');

    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }

  function renderAchievements() {
    const list = document.getElementById('achievements-list');
    if (!list || typeof ACHIEVEMENTS === 'undefined') return;
    list.innerHTML = '';

    // Group by category
    const categories = {};
    for (const a of ACHIEVEMENTS) {
      if (!categories[a.category]) categories[a.category] = [];
      categories[a.category].push(a);
    }

    for (const [cat, achievements] of Object.entries(categories)) {
      const section = document.createElement('div');
      section.className = 'achievement-category';
      section.innerHTML = `<h3>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>`;

      for (const a of achievements) {
        const unlocked = state.achievements.includes(a.id);
        const item = document.createElement('div');
        item.className = `achievement-item tier-${a.tier}${unlocked ? ' unlocked' : ' locked'}`;
        item.innerHTML = `
          <span class="achievement-icon">${unlocked ? '\u{1F3C6}' : '\u{1F512}'}</span>
          <div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${a.description}</div>
          </div>
          <span class="achievement-tier">${a.tier}</span>
        `;
        section.appendChild(item);
      }

      list.appendChild(section);
    }
  }

  // ============================================================
  // ANIMATIONS
  // ============================================================
  function playCombineAnimation(type) {
    const forgeArea = document.getElementById('forge-area');
    if (!forgeArea) return;

    // Remove previous animation classes
    forgeArea.classList.remove('anim-success', 'anim-fail', 'anim-discovery', 'screen-shake');

    // Force reflow
    void forgeArea.offsetWidth;

    if (type === 'discovery') {
      forgeArea.classList.add('anim-discovery', 'screen-shake');
      spawnParticles(20);
      SFX.play('discovery');
    } else if (type === 'known') {
      forgeArea.classList.add('anim-success');
      spawnParticles(8);
      SFX.play('success');
    } else if (type === 'fail') {
      forgeArea.classList.add('anim-fail', 'screen-shake');
      SFX.play('fail');
    }

    // Clean up after animation
    setTimeout(() => {
      forgeArea.classList.remove('anim-success', 'anim-fail', 'anim-discovery', 'screen-shake');
    }, 800);
  }

  function spawnParticles(count) {
    const container = document.getElementById('particle-shower');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.left = (30 + Math.random() * 40) + '%';
      particle.style.top = (30 + Math.random() * 20) + '%';
      particle.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      particle.style.setProperty('--dy', (Math.random() * -200 - 50) + 'px');
      particle.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
      particle.style.animationDelay = (Math.random() * 0.2) + 's';
      container.appendChild(particle);
    }

    // Clean up
    setTimeout(() => {
      container.innerHTML = '';
    }, 1500);
  }

  // ============================================================
  // FORGE EVOLUTION
  // ============================================================
  function updateForgeEvolution() {
    const forgeArea = document.getElementById('forge-area');
    if (!forgeArea) return;

    // Remove old tiers
    forgeArea.classList.remove('forge-tier-1', 'forge-tier-2', 'forge-tier-3', 'forge-tier-4', 'forge-tier-5');

    const tier = getForgeTier();
    if (tier > 0) {
      forgeArea.classList.add('forge-tier-' + tier);
    }
  }

  // ============================================================
  // FAILURE FEEDBACK
  // ============================================================
  function showFailResult(el, input1, input2, alreadyTried) {
    el.className = 'forge-result failure';

    if (alreadyTried) {
      el.innerHTML = '<div class="result-text" style="color:var(--text-muted);">Already tried this pair. Try something new!</div>';
      return;
    }

    const el1 = ELEMENTS[input1], el2 = ELEMENTS[input2];
    const physicsMsg = getPhysicsFailureMessage(input1, input2, el1, el2);

    if (physicsMsg) {
      el.innerHTML = `<div class="result-text">${physicsMsg}</div>`;
      return;
    }

    const closeness = getCloseness(input1, input2);

    if (closeness === 'near-miss') {
      const hint = getNearMissHint(input1, input2);
      el.innerHTML = `<div class="result-text" style="color:var(--accent-gold);">${hint}</div>`;
    } else if (closeness === 'wrong-era') {
      el.innerHTML = '<div class="result-text">These exist on very different scales. Build up through intermediate discoveries first.</div>';
    } else if (closeness === 'needs-intermediate') {
      el.innerHTML = '<div class="result-text">These can\'t combine directly yet. You need to discover something in between.</div>';
    } else {
      el.innerHTML = '<div class="result-text">No reaction. Check each element\'s role — force carriers interact with matter, not usually with each other.</div>';
    }
  }

  function getPhysicsFailureMessage(id1, id2, el1, el2) {
    if (!el1 || !el2) return null;
    const cat1 = el1.category || '', cat2 = el2.category || '';

    if (cat1 === 'force' && cat2 === 'force') {
      return 'Force carriers usually interact with <em>matter</em>, not with each other. Try pairing a force carrier with a matter particle.';
    }
    if (cat1 === 'atom' && cat2 === 'atom' && id1 === id2 && !tryCombine(id1, id2)) {
      return `You need a different atom to fuse with ${el1.name}. In stars, fusion builds up through the periodic table step by step.`;
    }
    if (cat1 === 'phenomenon' && cat2 === 'phenomenon' && !tryCombine(id1, id2)) {
      return 'Quantum phenomena often need a <em>physical system</em> (a particle or material) to manifest. Try combining a phenomenon with a particle.';
    }
    if ((cat1 === 'application' && el2.era <= 1) || (cat2 === 'application' && el1.era <= 1)) {
      return 'This application requires more advanced ingredients. Build up through intermediate discoveries first.';
    }
    if (cat1 === 'concept' && cat2 === 'concept' && !tryCombine(id1, id2)) {
      return 'Abstract concepts usually need a <em>physical particle or system</em> to create something new.';
    }
    return null;
  }

  function getNearMissHint(id1, id2) {
    const hints1 = RECIPES_BY_INPUT[id1] || [];
    const hints2 = RECIPES_BY_INPUT[id2] || [];
    const el1 = ELEMENTS[id1], el2 = ELEMENTS[id2];

    for (const h of hints1) {
      if (state.discovered.includes(h.partner) && !state.discovered.includes(h.result)) {
        const partner = ELEMENTS[h.partner];
        if (partner) {
          return `Close! <strong>${el1.name}</strong> does react with something \u2014 try a <em>${partner.role || 'different'}</em> type particle.`;
        }
      }
    }
    for (const h of hints2) {
      if (state.discovered.includes(h.partner) && !state.discovered.includes(h.result)) {
        const partner = ELEMENTS[h.partner];
        if (partner) {
          return `Close! <strong>${el2.name}</strong> does react with something \u2014 try a <em>${partner.role || 'different'}</em> type particle.`;
        }
      }
    }
    return 'Almost... these particles interacted briefly. Try a different partner for one of them.';
  }

  function getCloseness(id1, id2) {
    const el1 = ELEMENTS[id1], el2 = ELEMENTS[id2];
    if (!el1 || !el2) return 'none';

    const hints1 = RECIPES_BY_INPUT[id1] || [];
    const hints2 = RECIPES_BY_INPUT[id2] || [];

    for (const h of hints1) {
      const partnerEl = ELEMENTS[h.partner];
      if (partnerEl && partnerEl.era === el2.era) return 'near-miss';
    }
    for (const h of hints2) {
      const partnerEl = ELEMENTS[h.partner];
      if (partnerEl && partnerEl.era === el1.era) return 'near-miss';
    }

    if (Math.abs(el1.era - el2.era) > 2) return 'wrong-era';

    const hasUndiscoveredRecipe1 = hints1.some(h =>
      !state.discovered.includes(h.result) && state.discovered.includes(h.partner)
    );
    const hasUndiscoveredRecipe2 = hints2.some(h =>
      !state.discovered.includes(h.result) && state.discovered.includes(h.partner)
    );
    if (hasUndiscoveredRecipe1 || hasUndiscoveredRecipe2) return 'needs-intermediate';

    return 'none';
  }

  // ============================================================
  // DISCOVERY MODAL
  // ============================================================
  function showDiscoveryModal(elementId, qeEarned) {
    const el = ELEMENTS[elementId];

    const sym = document.getElementById('discovery-symbol');
    sym.className = `element-symbol huge era-${el.era}`;
    sym.style.borderColor = el.color;
    sym.style.color = el.color;
    sym.textContent = el.symbol;
    sym.style.animation = 'none';
    sym.offsetHeight;
    sym.style.animation = 'discoverPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    document.getElementById('discovery-name').textContent = el.name;
    document.getElementById('discovery-name').style.color = el.color;
    document.getElementById('discovery-flavor').textContent = el.flavor;

    // Era banner
    const banner = document.getElementById('discovery-era-banner');
    banner.textContent = `Era ${el.era}: ${ERAS[el.era] ? ERAS[el.era].name : 'Hidden'}`;
    banner.className = `discovery-era-banner era-${el.era}`;

    // QE earned display
    const qeDiv = document.getElementById('discovery-qe-earned');
    if (qeEarned > 0) {
      qeDiv.style.display = 'block';
      qeDiv.textContent = `+${qeEarned} Quantum Energy`;
    } else {
      qeDiv.style.display = 'none';
    }

    // Journal education
    const journal = JOURNAL[elementId];
    const eduDiv = document.getElementById('discovery-education');
    const whatEl = document.getElementById('discovery-what');
    const weirdEl = document.getElementById('discovery-weird');
    if (journal) {
      eduDiv.style.display = 'block';
      const truncate = (text, maxLen) => {
        if (text.length <= maxLen) return text;
        const cut = text.substring(0, maxLen);
        const lastPeriod = cut.lastIndexOf('.');
        return lastPeriod > 0 ? cut.substring(0, lastPeriod + 1) : cut + '...';
      };
      whatEl.textContent = truncate(journal.what, 180);
      weirdEl.textContent = truncate(journal.weirdPart, 150);
    } else {
      eduDiv.style.display = 'none';
    }

    // "Now try" hints
    const hintsDiv = document.getElementById('discovery-next-hints');
    const nextCombos = getNextCombosFor(elementId);
    if (nextCombos.length > 0) {
      const hintItems = nextCombos.slice(0, 2).map(h =>
        `<span style="color:${el.color}">${el.name}</span> + <span style="color:${ELEMENTS[h.partner].color}">${ELEMENTS[h.partner].name}</span> = ???`
      ).join('<br>');
      hintsDiv.innerHTML = `<div class="next-try"><h4>Now try</h4>${hintItems}</div>`;
      hintsDiv.style.display = 'block';
    } else {
      hintsDiv.style.display = 'none';
    }

    // Wire buttons
    const journalBtn = document.getElementById('btn-discovery-journal');
    journalBtn.textContent = 'Full Journal Entry';
    journalBtn.onclick = () => {
      const journal = JOURNAL[elementId];
      if (!journal) return;
      let expanded = document.getElementById('discovery-journal-expanded');
      if (expanded) {
        expanded.remove();
        journalBtn.textContent = 'Full Journal Entry';
        return;
      }
      expanded = document.createElement('div');
      expanded.id = 'discovery-journal-expanded';
      expanded.className = 'discovery-journal-expanded';
      expanded.innerHTML = `
        ${journal.whyItMatters ? `<div class="edu-section"><h4>Why it matters</h4><p>${journal.whyItMatters}</p></div>` : ''}
        ${journal.history ? `<div class="edu-section"><h4>History</h4><p>${journal.history}</p></div>` : ''}
        ${journal.funFact ? `<div class="edu-section"><h4>Fun fact</h4><p>${journal.funFact}</p></div>` : ''}
      `;
      const actions = document.querySelector('.discovery-actions');
      actions.parentNode.insertBefore(expanded, actions);
      journalBtn.textContent = 'Collapse Journal';
    };
    document.getElementById('btn-discovery-continue').onclick = () => {
      hideModal('discovery-modal');
      // Remove expanded journal if open
      const expanded = document.getElementById('discovery-journal-expanded');
      if (expanded) expanded.remove();
      // Tutorial: advance after closing discovery modal
      if (state.tutorialStep === 5) {
        advanceTutorial(6);
        // Auto-advance step 6→7 after 5 seconds
        setTimeout(() => {
          if (state.tutorialStep === 6) advanceTutorial(7);
        }, 5000);
      } else if (state.tutorialStep === 10) {
        advanceTutorial(11);
        // Auto-advance step 11→12 after 6 seconds
        setTimeout(() => {
          if (state.tutorialStep === 11) advanceTutorial(12);
        }, 6000);
        // Auto-finish after step 12
        setTimeout(() => {
          if (state.tutorialStep === 12) advanceTutorial(TUTORIAL_COMPLETE + 1);
        }, 12000);
      }
    };

    showModal('discovery-modal');
  }

  function getNextCombosFor(elementId) {
    const hints = RECIPES_BY_INPUT[elementId] || [];
    return hints.filter(h =>
      state.discovered.includes(h.partner) && !state.discovered.includes(h.result)
    );
  }

  // ============================================================
  // HINTS
  // ============================================================
  function getGenericHint() {
    const undiscovered = Object.keys(ELEMENTS).filter(id => !state.discovered.includes(id) && ELEMENTS[id].era <= state.currentEra + 1);
    if (undiscovered.length === 0) return 'Try combining elements from different eras!';

    const target = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    const el = ELEMENTS[target];
    return `Hint: There are still undiscovered elements in Era ${el.era} (${ERAS[el.era].name}).`;
  }

  function getSpecificHint() {
    const undiscovered = Object.keys(ELEMENTS).filter(id =>
      !state.discovered.includes(id) && ELEMENTS[id].era <= state.currentEra + 1
    );
    if (undiscovered.length === 0) return 'You\'re close to finding everything!';

    for (const target of undiscovered) {
      const recipes = getRecipesFor(target);
      for (const [a, b] of recipes) {
        if (state.discovered.includes(a) && state.discovered.includes(b)) {
          const elA = ELEMENTS[a], elB = ELEMENTS[b];
          return `Try combining something related to "${elA.name}" with "${elB.name}"...`;
        }
      }
    }

    return 'Try combining elements from the same era, or mix eras!';
  }

  function showHint(text) {
    const hintBar = document.getElementById('hint-bar');
    document.getElementById('hint-text').textContent = text;
    hintBar.style.display = 'flex';
  }

  // ============================================================
  // ERA MANAGEMENT
  // ============================================================
  function updateCurrentEra() {
    let maxEra = 1;
    for (const id of state.discovered) {
      const el = ELEMENTS[id];
      if (el && el.era <= 5 && el.era > maxEra) maxEra = el.era;
    }

    const discoveredCount = state.discovered.filter(id => ELEMENTS[id] && ELEMENTS[id].era <= 5).length;
    for (let era = 2; era <= 5; era++) {
      if (discoveredCount >= ERAS[era].unlockThreshold && era > maxEra) {
        maxEra = era;
      }
    }

    state.currentEra = maxEra;
  }

  // ============================================================
  // TOP BAR
  // ============================================================
  function updateTopBar() {
    const visibleDiscovered = state.discovered.filter(id => ELEMENTS[id] && ELEMENTS[id].era <= 5).length;
    document.getElementById('discovery-count').textContent = visibleDiscovered;
    document.getElementById('discovery-total').textContent = TOTAL_VISIBLE;
    document.getElementById('current-era-name').textContent = ERAS[state.currentEra].name;
    document.getElementById('current-era-name').style.color = ERAS[state.currentEra].color;

    // QE counter
    const qeEl = document.getElementById('qe-amount');
    if (qeEl) qeEl.textContent = state.stats.quantumEnergy.toLocaleString();
  }

  // ============================================================
  // RECENT DISCOVERIES
  // ============================================================
  function renderRecentDiscoveries() {
    const list = document.getElementById('recent-list');
    list.innerHTML = '';

    if (recentDiscoveries.length === 0) {
      list.innerHTML = '<p class="empty-text">Start combining elements!</p>';
      return;
    }

    for (const id of recentDiscoveries) {
      const el = ELEMENTS[id];
      if (!el) continue;
      const item = document.createElement('div');
      item.className = 'recent-item';
      item.addEventListener('click', () => showElementInfo(id));

      const sym = createSymbolElement(id);
      const name = document.createElement('span');
      name.textContent = el.name;
      name.style.color = el.color;

      item.appendChild(sym);
      item.appendChild(name);
      list.appendChild(item);
    }
  }

  // ============================================================
  // RESEARCH NOTES — compact cards in right panel
  // ============================================================
  function renderResearchNotes() {
    const container = document.getElementById('research-notes-list');
    if (!container) return;
    container.innerHTML = '';

    if (typeof RESEARCH_NOTES === 'undefined' || !RESEARCH_NOTES) {
      container.innerHTML = '<p class="empty-text">Keep exploring!</p>';
      return;
    }

    const activeNotes = [];
    const completedNotes = [];

    for (const note of RESEARCH_NOTES) {
      // Check prerequisite
      if (note.prerequisite) {
        const prereq = RESEARCH_NOTES.find(n => n.id === note.prerequisite);
        if (prereq && !isNoteCompleted(prereq)) continue;
      }

      if (isNoteCompleted(note)) {
        completedNotes.push(note);
      } else {
        activeNotes.push(note);
      }
    }

    // Show up to 3 active notes as compact cards
    const shown = activeNotes.slice(0, 3);

    if (shown.length === 0 && completedNotes.length === 0) {
      container.innerHTML = '<p class="empty-text">Keep exploring!</p>';
      return;
    }

    for (const note of shown) {
      const div = document.createElement('div');
      div.className = 'research-note active';

      // Compact: title + hint (1 line each)
      div.innerHTML = `
        <div class="note-header">
          <span class="note-icon">\u{1F4DA}</span>
          <strong>${note.title}</strong>
          <span class="note-era">Era ${note.era}</span>
        </div>
        <p class="note-hint"><em>${note.hint}</em></p>
      `;

      // Tap to expand lesson
      div.addEventListener('click', () => {
        const existing = div.querySelector('.note-lesson-expanded');
        if (existing) {
          existing.remove();
          div.classList.remove('expanded');
        } else {
          const lessonDiv = document.createElement('div');
          lessonDiv.className = 'note-lesson-expanded';
          lessonDiv.innerHTML = `<p>${note.lessonFull || note.lesson}</p>`;
          if (note.nextHint) {
            lessonDiv.innerHTML += `<p class="note-next-hint"><em>Next: ${note.nextHint}</em></p>`;
          }
          div.appendChild(lessonDiv);
          div.classList.add('expanded');
        }
      });

      container.appendChild(div);
    }

    // Show last 2 completed notes (collapsed)
    const recentCompleted = completedNotes.slice(-2).reverse();
    for (const note of recentCompleted) {
      const div = document.createElement('div');
      div.className = 'research-note completed';
      div.innerHTML = `
        <div class="note-header">
          <span class="note-check">\u2713</span>
          <strong>${note.title}</strong>
          <span class="note-done">Complete</span>
        </div>
      `;
      container.appendChild(div);
    }
  }

  function isNoteCompleted(note) {
    if (!note.goal || note.goal.length === 0) return false;
    return note.goal.every(g => state.discovered.includes(g));
  }

  // Keep backward compat
  function renderNextDiscoveries() {
    renderResearchNotes();
  }

  // ============================================================
  // INFO PANEL (RIGHT)
  // ============================================================
  function showElementInfo(elementId) {
    const el = ELEMENTS[elementId];
    if (!el) return;

    document.querySelector('.info-default').style.display = 'none';
    const infoEl = document.getElementById('info-element');
    infoEl.style.display = 'block';

    document.getElementById('info-symbol').className = `element-symbol large era-${el.era}`;
    document.getElementById('info-symbol').style.borderColor = el.color;
    document.getElementById('info-symbol').style.color = el.color;
    document.getElementById('info-symbol').textContent = el.symbol;

    document.getElementById('info-name').textContent = el.name;
    document.getElementById('info-name').style.color = el.color;

    const badge = document.getElementById('info-era');
    badge.textContent = `Era ${el.era}: ${ERAS[el.era] ? ERAS[el.era].name : 'Hidden'}`;
    badge.className = `era-badge era-${el.era}`;

    // Mastery badge
    const masteryBadge = document.getElementById('info-mastery');
    const masteryInfo = getMasteryLevel(elementId);
    if (masteryInfo.timesCrafted > 0) {
      masteryBadge.style.display = 'inline-block';
      masteryBadge.textContent = masteryInfo.label + ' (' + masteryInfo.timesCrafted + 'x)';
      masteryBadge.className = 'mastery-badge mastery-' + masteryInfo.level;
    } else {
      masteryBadge.style.display = 'none';
    }

    document.getElementById('info-description').textContent = el.description;
    document.getElementById('info-flavor').textContent = el.combineHint || el.flavor;

    // Stock display
    const stockDiv = document.getElementById('info-stock');
    const stockCount = document.getElementById('info-stock-count');
    if (shouldConsume(elementId)) {
      stockDiv.style.display = 'block';
      stockCount.textContent = getStock(elementId);
    } else {
      stockDiv.style.display = 'block';
      stockCount.textContent = '\u221E';
    }

    // Journal preview
    const journal = JOURNAL[elementId];
    const journalDiv = document.getElementById('info-journal-preview');
    const journalContent = document.getElementById('info-journal-content');
    if (journal) {
      journalDiv.style.display = 'block';
      journalContent.textContent = journal.what.substring(0, 200) + (journal.what.length > 200 ? '...' : '');
      document.getElementById('btn-full-journal').onclick = () => showJournalEntry(elementId);
    } else {
      journalDiv.style.display = 'none';
    }

    // Recipes
    const recipesDiv = document.getElementById('info-recipes');
    const recipesList = document.getElementById('info-recipes-list');
    const recipes = getRecipesFor(elementId);
    recipesList.innerHTML = '';

    if (recipes.length > 0) {
      recipesDiv.style.display = 'block';
      for (const [a, b] of recipes) {
        const hasA = state.discovered.includes(a);
        const hasB = state.discovered.includes(b);
        if (hasA && hasB) {
          const item = document.createElement('div');
          item.className = 'recipe-item';
          item.innerHTML = `<span style="color:${ELEMENTS[a].color}">${ELEMENTS[a].name}</span> + <span style="color:${ELEMENTS[b].color}">${ELEMENTS[b].name}</span>`;
          recipesList.appendChild(item);
        }
      }
      if (recipesList.children.length === 0) {
        const item = document.createElement('div');
        item.className = 'recipe-item';
        item.innerHTML = '<span class="recipe-unknown">Discover more elements to reveal recipes</span>';
        recipesList.appendChild(item);
      }
    } else {
      recipesDiv.style.display = 'none';
    }
  }

  // ============================================================
  // JOURNAL
  // ============================================================
  function renderJournal(fromScreen) {
    const filter = document.getElementById('journal-era-filter').value;
    const search = document.getElementById('journal-search').value.toLowerCase();
    const list = document.getElementById('journal-list');
    list.innerHTML = '';

    document.getElementById('journal-count').textContent = state.discovered.length;

    const allElements = Object.values(ELEMENTS).sort((a, b) => {
      if (a.era !== b.era) return a.era - b.era;
      return a.name.localeCompare(b.name);
    });

    for (const el of allElements) {
      if (filter !== 'all' && el.era !== parseInt(filter)) continue;

      const discovered = state.discovered.includes(el.id);
      if (search && !discovered) continue;
      if (search && !el.name.toLowerCase().includes(search)) continue;

      const item = document.createElement('div');
      item.className = `journal-entry-item${discovered ? '' : ' locked'}`;
      item.dataset.elementId = el.id;

      const sym = document.createElement('div');
      sym.className = `element-symbol era-${el.era}`;
      sym.style.borderColor = discovered ? el.color : 'var(--text-muted)';
      sym.style.color = discovered ? el.color : 'var(--text-muted)';
      sym.textContent = discovered ? el.symbol : '?';

      const info = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'entry-name';
      name.textContent = discovered ? el.name : '???';
      name.style.color = discovered ? el.color : 'var(--text-muted)';

      const era = document.createElement('div');
      era.className = 'entry-era';
      era.textContent = `Era ${el.era}`;

      info.appendChild(name);
      info.appendChild(era);

      item.appendChild(sym);
      item.appendChild(info);

      if (discovered) {
        item.addEventListener('click', () => showJournalDetail(el.id));
      }

      list.appendChild(item);
    }
  }

  function showJournalEntry(elementId) {
    showScreen('journal');
    renderJournal('game');
    showJournalDetail(elementId);
  }

  function showJournalDetail(elementId) {
    const el = ELEMENTS[elementId];
    const journal = JOURNAL[elementId];
    const detail = document.getElementById('journal-detail');

    document.querySelectorAll('.journal-entry-item').forEach(item => {
      item.classList.toggle('active', item.dataset.elementId === elementId);
    });

    if (!el || !journal) {
      detail.innerHTML = '<div class="journal-detail-placeholder"><p>No journal entry available.</p></div>';
      return;
    }

    detail.innerHTML = `
      <h2 style="color:${el.color}">${el.name}</h2>
      <div class="journal-element-era">Era ${el.era}: ${ERAS[el.era] ? ERAS[el.era].name : 'Hidden'} | ${el.description}</div>
      <div class="journal-section"><h3 class="what">What Is It?</h3><p>${journal.what}</p></div>
      <div class="journal-section"><h3 class="why">Why It Matters</h3><p>${journal.whyItMatters}</p></div>
      <div class="journal-section"><h3 class="weird">The Weird Part</h3><p>${journal.weirdPart}</p></div>
      <div class="journal-section"><h3 class="history">History</h3><p>${journal.history}</p></div>
      <div class="journal-section"><h3 class="fun">Fun Fact</h3><p>${journal.funFact}</p></div>
    `;
  }

  // ============================================================
  // CHALLENGES
  // ============================================================
  function renderChallenges() {
    // Daily challenge
    const daily = getDailyChallenge();
    const dailyEl = document.getElementById('daily-challenge');
    const dailyCompleted = state.challenges[daily.id + '_daily'];
    dailyEl.innerHTML = `
      <div class="daily-label">Daily Challenge</div>
      <h2>${daily.name}</h2>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:12px;">${daily.description}</p>
      <div style="display:flex;gap:12px;align-items:center;">
        <span class="difficulty-stars">${'*'.repeat(daily.difficulty)}</span>
        ${daily.maxCombinations ? `<span style="color:var(--text-muted);font-size:13px;">Max ${daily.maxCombinations} moves</span>` : ''}
        ${dailyCompleted ? '<span class="completed-badge">Completed!</span>' : ''}
      </div>
      <button class="btn btn-primary" style="margin-top:12px;" id="btn-play-daily">
        ${dailyCompleted ? 'Play Again' : 'Start Challenge'}
      </button>
    `;
    document.getElementById('btn-play-daily').addEventListener('click', () => {
      startChallenge({ ...daily, id: daily.id + '_daily' });
    });

    // Challenge list
    const listEl = document.getElementById('challenge-list');
    listEl.innerHTML = '';

    for (const challenge of CHALLENGES) {
      const completed = state.challenges[challenge.id];
      const card = document.createElement('div');
      card.className = `challenge-card${completed ? ' completed' : ''}`;
      card.innerHTML = `
        <h3>${challenge.name}</h3>
        <p class="challenge-desc">${challenge.description}</p>
        <div class="challenge-meta">
          <span class="difficulty-stars">${'*'.repeat(challenge.difficulty)}</span>
          ${challenge.maxCombinations ? `<span>Max ${challenge.maxCombinations} moves</span>` : '<span>No limit</span>'}
          ${completed ? `<span class="completed-badge">Completed (${completed.bestScore} moves)</span>` : ''}
        </div>
      `;
      card.addEventListener('click', () => startChallenge(challenge));
      listEl.appendChild(card);
    }
  }

  function startChallenge(challenge) {
    challengeMode = true;
    currentChallenge = challenge;
    challengeDiscovered = [...(challenge.startingElements || STARTING_ELEMENTS)];
    challengeMoves = 0;
    challengeSlot1 = null;
    challengeSlot2 = null;

    showScreen('challenge-play');

    document.getElementById('challenge-play-name').textContent = challenge.name;
    document.getElementById('challenge-max-moves').textContent = challenge.maxCombinations || '\u221E';
    document.getElementById('challenge-moves').textContent = `Moves: 0 / `;

    renderChallengeGrid();
    updateChallengeForge();
    renderChallengeGoals();

    document.getElementById('challenge-desc-title').textContent = challenge.name;
    document.getElementById('challenge-desc-text').textContent = challenge.description;

    document.getElementById('btn-challenge-hint').onclick = () => {
      if (challenge.hint) {
        const resultEl = document.getElementById('challenge-forge-result');
        resultEl.style.display = 'block';
        resultEl.className = 'forge-result already';
        resultEl.innerHTML = `<div class="result-text" style="color:var(--accent-gold);">${challenge.hint}</div>`;
      }
    };
  }

  function renderChallengeGrid() {
    const grid = document.getElementById('challenge-element-grid');
    grid.innerHTML = '';

    const sorted = [...challengeDiscovered].sort((a, b) => {
      const ea = ELEMENTS[a], eb = ELEMENTS[b];
      if (!ea || !eb) return 0;
      if (ea.era !== eb.era) return ea.era - eb.era;
      return ea.name.localeCompare(eb.name);
    });

    for (const id of sorted) {
      const card = createElementCard(id, handleChallengeElementClick, { showStock: false });
      if (id === challengeSlot1 || id === challengeSlot2) {
        card.classList.add('selected');
      }
      grid.appendChild(card);
    }
  }

  function handleChallengeElementClick(elementId) {
    if (challengeSlot1 === null) {
      challengeSlot1 = elementId;
    } else if (challengeSlot2 === null) {
      challengeSlot2 = elementId;
    } else {
      challengeSlot1 = challengeSlot2;
      challengeSlot2 = elementId;
    }
    updateChallengeForge();
    renderChallengeGrid();
  }

  function updateChallengeForge() {
    renderSlot(document.getElementById('challenge-slot-1'), challengeSlot1);
    renderSlot(document.getElementById('challenge-slot-2'), challengeSlot2);
    document.getElementById('btn-challenge-combine').disabled = !(challengeSlot1 && challengeSlot2);
  }

  function handleChallengeCombine() {
    if (!challengeSlot1 || !challengeSlot2) return;

    challengeMoves++;
    const result = tryCombine(challengeSlot1, challengeSlot2);
    const resultEl = document.getElementById('challenge-forge-result');
    resultEl.style.display = 'block';

    if (result && ELEMENTS[result]) {
      const el = ELEMENTS[result];
      const isNew = !challengeDiscovered.includes(result);
      if (isNew) {
        challengeDiscovered.push(result);
        if (!state.discovered.includes(result)) {
          state.discovered.push(result);
          updateCurrentEra();
          saveGame();
        }
        resultEl.className = 'forge-result success';
        resultEl.innerHTML = `<div class="result-text">Discovered: <strong style="color:${el.color}">${el.name}</strong></div>`;
      } else {
        resultEl.className = 'forge-result already';
        resultEl.innerHTML = `<div class="result-text">Created <strong style="color:${el.color}">${el.name}</strong> (already known)</div>`;
      }
    } else {
      resultEl.className = 'forge-result failure';
      resultEl.innerHTML = '<div class="result-text">No reaction.</div>';
    }

    challengeSlot1 = null;
    challengeSlot2 = null;
    updateChallengeForge();
    renderChallengeGrid();
    renderChallengeGoals();

    document.getElementById('challenge-moves').innerHTML = `Moves: ${challengeMoves} / <span id="challenge-max-moves">${currentChallenge.maxCombinations || '\u221E'}</span>`;

    checkChallengeCompletion();
  }

  function renderChallengeGoals() {
    const goalList = document.getElementById('challenge-goal-list');
    goalList.innerHTML = '';

    const goals = currentChallenge.goal;
    if (!goals) {
      const goalItem = document.createElement('div');
      goalItem.className = 'goal-item';
      goalItem.innerHTML = `<span>Discover all elements (${challengeDiscovered.length}/${TOTAL_DISCOVERABLE})</span>`;
      goalList.appendChild(goalItem);
      document.getElementById('challenge-goals-done').textContent = '0';
      document.getElementById('challenge-goals-total').textContent = '1';
      return;
    }

    let done = 0;
    for (const goalId of goals) {
      const el = ELEMENTS[goalId];
      const achieved = challengeDiscovered.includes(goalId);
      if (achieved) done++;

      const item = document.createElement('div');
      item.className = `goal-item${achieved ? ' achieved' : ''}`;
      item.innerHTML = `
        <span class="${achieved ? 'goal-check' : 'goal-pending'}">${achieved ? '\u2713' : '\u25CB'}</span>
        <span>${el ? el.name : goalId}</span>
      `;
      goalList.appendChild(item);
    }

    document.getElementById('challenge-goals-done').textContent = done;
    document.getElementById('challenge-goals-total').textContent = goals.length;
  }

  function checkChallengeCompletion() {
    const goals = currentChallenge.goal;
    let allGoalsMet = false;

    if (goals === null) {
      allGoalsMet = challengeDiscovered.length >= TOTAL_DISCOVERABLE;
    } else {
      allGoalsMet = goals.every(g => challengeDiscovered.includes(g));
    }

    if (allGoalsMet) {
      const isUnderLimit = !currentChallenge.maxCombinations || challengeMoves <= currentChallenge.maxCombinations;
      const existing = state.challenges[currentChallenge.id];
      if (!existing || challengeMoves < existing.bestScore) {
        state.challenges[currentChallenge.id] = {
          completed: true,
          bestScore: challengeMoves
        };
        saveGame();
      }

      setTimeout(() => {
        document.getElementById('challenge-complete-title').textContent = isUnderLimit ? 'Challenge Complete!' : 'Goals Met!';
        document.getElementById('challenge-complete-text').textContent = isUnderLimit
          ? `You completed "${currentChallenge.name}" in ${challengeMoves} moves!`
          : `You found everything, but used ${challengeMoves} moves (limit was ${currentChallenge.maxCombinations}).`;
        document.getElementById('challenge-complete-stats').textContent = `Moves used: ${challengeMoves}${currentChallenge.maxCombinations ? ' / ' + currentChallenge.maxCombinations : ''}`;
        document.getElementById('challenge-complete-teaches').textContent = currentChallenge.teaches || '';
        showModal('challenge-complete-modal');
      }, 500);
    } else if (currentChallenge.maxCombinations && challengeMoves >= currentChallenge.maxCombinations) {
      setTimeout(() => {
        document.getElementById('challenge-complete-title').textContent = 'Out of Moves';
        document.getElementById('challenge-complete-text').textContent = `You ran out of moves! Try again with a different approach.`;
        document.getElementById('challenge-complete-stats').textContent = `Moves used: ${challengeMoves} / ${currentChallenge.maxCombinations}`;
        document.getElementById('challenge-complete-teaches').textContent = currentChallenge.hint || '';
        showModal('challenge-complete-modal');
      }, 500);
    }
  }

  // ============================================================
  // TITLE SCREEN
  // ============================================================
  function updateTitleScreen() {
    const hasSave = loadGame();
    const continueBtn = document.getElementById('btn-continue');
    const progressEl = document.getElementById('title-progress');

    if (hasSave && state.discovered.length > 0) {
      continueBtn.style.display = 'block';
      progressEl.style.display = 'block';

      const visibleDiscovered = state.discovered.filter(id => ELEMENTS[id] && ELEMENTS[id].era <= 5).length;
      const pct = Math.round((visibleDiscovered / TOTAL_VISIBLE) * 100);
      document.getElementById('title-progress-bar').style.width = pct + '%';
      document.getElementById('title-progress-text').textContent = `${visibleDiscovered}/${TOTAL_VISIBLE} discovered (${pct}%)`;
    } else {
      continueBtn.style.display = 'none';
      progressEl.style.display = 'none';
    }
  }

  // ============================================================
  // FTUE TUTORIAL SYSTEM
  // ============================================================
  const TUTORIAL_COMPLETE = 12;

  const TUTORIAL_STEPS = {
    1: { msg: 'Welcome! You have 6 fundamental particles. Let\'s build a <strong>Proton</strong>!' },
    2: { msg: 'Click <strong>Up Quark</strong> to place it in the forge.', target: 'up_quark', highlight: 'element' },
    3: { msg: 'Click <strong>Up Quark</strong> again for slot 2.', target: 'up_quark', highlight: 'element' },
    4: { msg: 'Press <strong>Combine</strong> to fuse them!', highlight: 'combine' },
    5: null, // silent — discovery modal is showing
    6: { msg: 'Your Di-Quark has <strong>stock: 1</strong> — intermediates are <strong>consumed</strong> when used, so you\'ll need to re-craft them.', target: 'diquark_uu', highlight: 'element' },
    7: { msg: 'Now click your <strong>Di-Quark</strong> to place it in the forge.', target: 'diquark_uu', highlight: 'element' },
    8: { msg: 'Add a <strong>Down Quark</strong> to complete the proton recipe!', target: 'down_quark', highlight: 'element' },
    9: { msg: 'Press <strong>Combine</strong> — you\'re about to make a Proton!', highlight: 'combine' },
    10: null, // silent — discovery modal showing for proton
    11: { msg: 'See these <strong>Research Notes</strong>? They\'re your quests — each one guides you toward your next discovery.', highlight: 'selector', selector: '.research-notes-panel', side: 'left' },
    12: { msg: 'The <strong>gold stars</strong> on elements show undiscovered combos. Use the <strong>Useful</strong> filter to focus on what matters. You\'re ready — go build the universe!', highlight: 'selector', selector: '#view-useful', side: 'right' }
  };

  function advanceTutorial(toStep) {
    if (state.tutorialStep >= TUTORIAL_COMPLETE + 1) return;
    state.tutorialStep = toStep;
    if (toStep > TUTORIAL_COMPLETE) {
      state.tutorialStep = TUTORIAL_COMPLETE + 1;
      hideTutorialTooltip();
      clearTutorialHighlights();
      saveGame();
      return;
    }
    saveGame();
    showTutorialStep(toStep);
  }

  function showTutorialStep(step) {
    const info = TUTORIAL_STEPS[step];
    if (!info) {
      // Silent step (e.g. step 5) — just hide tooltip and wait
      hideTutorialTooltip();
      clearTutorialHighlights();
      return;
    }

    clearTutorialHighlights();
    const tooltip = document.getElementById('tutorial-tooltip');
    if (!tooltip) return;

    tooltip.innerHTML = `<div class="tutorial-msg">${info.msg}</div><span class="tutorial-skip" id="tutorial-skip-btn">Skip Tutorial</span>`;
    tooltip.style.display = 'block';

    document.getElementById('tutorial-skip-btn').addEventListener('click', () => {
      advanceTutorial(TUTORIAL_COMPLETE + 1);
    });

    if (info.highlight === 'element') {
      const card = document.querySelector(`.element-card[data-element-id="${info.target}"]`);
      if (card) {
        card.classList.add('tutorial-highlight');
        positionTooltipNear(tooltip, card, 'right');
      } else {
        positionTooltipCenter(tooltip);
      }
    } else if (info.highlight === 'combine') {
      const btn = document.getElementById('btn-combine');
      if (btn) {
        btn.classList.add('tutorial-highlight');
        positionTooltipNear(tooltip, btn, 'top');
      }
    } else if (info.highlight === 'selector') {
      const el = document.querySelector(info.selector);
      if (el) {
        el.classList.add('tutorial-highlight');
        positionTooltipNear(tooltip, el, info.side || 'right');
      } else {
        positionTooltipCenter(tooltip);
      }
    } else {
      positionTooltipCenter(tooltip);
    }
  }

  function positionTooltipNear(tooltip, target, side) {
    const rect = target.getBoundingClientRect();
    tooltip.className = '';
    tooltip.style.transform = '';
    // Measure tooltip
    const tw = tooltip.offsetWidth || 260;
    const th = tooltip.offsetHeight || 80;
    const gap = 14;

    if (side === 'right') {
      let left = rect.right + gap;
      let top = rect.top;
      if (left + tw > window.innerWidth) {
        // Fall back: below the target
        left = Math.max(8, rect.left);
        top = rect.bottom + gap;
      } else {
        tooltip.classList.add('arrow-left');
      }
      tooltip.style.left = left + 'px';
      tooltip.style.top = Math.max(8, top) + 'px';
    } else if (side === 'left') {
      let left = rect.left - tw - gap;
      let top = rect.top;
      if (left < 8) {
        // Fall back: to the right
        left = rect.right + gap;
        tooltip.classList.add('arrow-left');
      } else {
        tooltip.classList.add('arrow-right');
      }
      tooltip.style.left = left + 'px';
      tooltip.style.top = Math.max(8, top) + 'px';
    } else if (side === 'top') {
      let left = Math.max(8, rect.left + (rect.width - tw) / 2);
      let top = rect.top - th - gap;
      if (top < 8) {
        top = rect.bottom + gap;
      } else {
        tooltip.classList.add('arrow-bottom');
      }
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }
  }

  function positionTooltipCenter(tooltip) {
    tooltip.className = '';
    tooltip.style.transform = '';
    const tw = tooltip.offsetWidth || 260;
    const th = tooltip.offsetHeight || 80;
    tooltip.style.left = ((window.innerWidth - tw) / 2) + 'px';
    tooltip.style.top = ((window.innerHeight - th) / 2) + 'px';
  }

  function hideTutorialTooltip() {
    const tooltip = document.getElementById('tutorial-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  function clearTutorialHighlights() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
    document.querySelectorAll('.tutorial-dim').forEach(el => el.classList.remove('tutorial-dim'));
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function startGame(isNewGame) {
    if (isNewGame) {
      resetGame();
      state.discovered = [...STARTING_ELEMENTS];
      // Initialize inventory for starters (fundamentals are infinite, no stock needed)
      state.firstTime = true;
      saveGame();
    }

    updateCurrentEra();
    showScreen('game');
    renderElementGrid();
    updateForgeSlots();
    updateTopBar();
    renderRecentDiscoveries();
    renderResearchNotes();
    updateStabilityDisplay();
    updateStreakDisplay();
    updateForgeEvolution();

    // Start procedural ambient music
    if (typeof AMBIENCE !== 'undefined') {
      AMBIENCE.start();
      AMBIENCE.onStreak(state.stats.currentStreak);
    }

    if (state.tutorialStep === 0 || state.firstTime) {
      state.firstTime = false;
      state.tutorialStep = 1;
      saveGame();
      showModal('intro-modal');
    } else if (state.tutorialStep >= 2 && state.tutorialStep <= TUTORIAL_COMPLETE) {
      // Resume in-progress tutorial
      setTimeout(() => showTutorialStep(state.tutorialStep), 300);
    }
  }

  function init() {
    updateTitleScreen();

    // ---- Title screen buttons ----
    document.getElementById('btn-new-game').addEventListener('click', () => startGame(true));
    document.getElementById('btn-continue').addEventListener('click', () => {
      loadGame();
      startGame(false);
    });
    document.getElementById('btn-challenges').addEventListener('click', () => {
      loadGame();
      if (state.discovered.length === 0) {
        state.discovered = [...STARTING_ELEMENTS];
        saveGame();
      }
      showScreen('challenge');
      renderChallenges();
    });
    document.getElementById('btn-journal-title').addEventListener('click', () => {
      loadGame();
      showScreen('journal');
      renderJournal('title');
    });

    // ---- Game screen buttons ----
    document.getElementById('btn-combine').addEventListener('click', handleCombine);

    // Batch craft controls
    document.getElementById('batch-minus').addEventListener('click', () => {
      if (batchCount <= 1) {
        triggerBatchGlitch('batch-minus');
        return;
      }
      batchCount = Math.max(1, batchCount - 1);
      updateBatchCraftBar();
    });
    document.getElementById('batch-plus').addEventListener('click', () => {
      const max = getMaxBatchCrafts(slot1Element, slot2Element);
      const cap = Math.min(max, 99);
      if (batchCount >= cap) {
        triggerBatchGlitch('batch-plus');
        return;
      }
      batchCount = Math.min(cap, batchCount + 1);
      updateBatchCraftBar();
    });
    document.getElementById('btn-batch-craft').addEventListener('click', handleBatchCraft);

    document.getElementById('btn-menu').addEventListener('click', () => showModal('menu-modal'));
    document.getElementById('btn-journal').addEventListener('click', () => {
      showScreen('journal');
      renderJournal('game');
    });
    document.getElementById('btn-challenges-game').addEventListener('click', () => {
      showScreen('challenge');
      renderChallenges();
    });

    // Volume panel
    const muteBtn = document.getElementById('btn-mute');
    const volPanel = document.getElementById('volume-panel');
    if (muteBtn && volPanel) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        volPanel.classList.toggle('hidden');
      });
      // Close panel when clicking outside
      document.addEventListener('click', (e) => {
        if (!volPanel.contains(e.target) && e.target !== muteBtn) {
          volPanel.classList.add('hidden');
        }
      });
      // Prevent panel clicks from closing it
      volPanel.addEventListener('click', (e) => e.stopPropagation());

      // Logarithmic slider conversion:
      // slider 0-100 → gain 0-1 using exponential curve
      // gain = (e^(slider * k) - 1) / (e^(k*100) - 1)  where k = 0.04
      const LOG_K = 0.04;
      const LOG_DENOM = Math.exp(LOG_K * 100) - 1;
      function sliderToGain(val) {
        if (val <= 0) return 0;
        return (Math.exp(LOG_K * val) - 1) / LOG_DENOM;
      }

      const musicSlider = document.getElementById('slider-music');
      const sfxSlider = document.getElementById('slider-sfx');
      const musicVal = document.getElementById('vol-music-val');
      const sfxVal = document.getElementById('vol-sfx-val');

      musicSlider.addEventListener('input', () => {
        const v = parseInt(musicSlider.value);
        musicVal.textContent = v;
        const gain = sliderToGain(v);
        if (typeof AMBIENCE !== 'undefined') AMBIENCE.setVolume(gain);
        updateMuteIcon();
      });

      sfxSlider.addEventListener('input', () => {
        const v = parseInt(sfxSlider.value);
        sfxVal.textContent = v;
        const gain = sliderToGain(v);
        SFX.setVolume(gain);
        updateMuteIcon();
      });

      function updateMuteIcon() {
        const musicOff = parseInt(musicSlider.value) === 0;
        const sfxOff = parseInt(sfxSlider.value) === 0;
        if (musicOff && sfxOff) {
          muteBtn.innerHTML = '&#128263;'; // muted
        } else {
          muteBtn.innerHTML = '&#128266;'; // speaker
        }
      }
    }

    // Achievements button
    const achievementsBtn = document.getElementById('btn-achievements-game');
    if (achievementsBtn) {
      achievementsBtn.addEventListener('click', () => {
        renderAchievements();
        showModal('achievements-modal');
      });
    }

    // Forge slot clicks to clear
    document.getElementById('slot-1').addEventListener('click', () => {
      if (slot1Element) {
        slot1Element = null;
        selectedSlot = 1;
        updateForgeSlots();
        renderElementGrid();
      }
    });
    document.getElementById('slot-2').addEventListener('click', () => {
      if (slot2Element) {
        slot2Element = null;
        selectedSlot = 2;
        updateForgeSlots();
        renderElementGrid();
      }
    });

    // Filters
    // View mode buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.dataset.view;
        document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderElementGrid();
      });
    });
    document.getElementById('element-search').addEventListener('input', renderElementGrid);

    // ---- Menu modal ----
    document.getElementById('btn-menu-resume').addEventListener('click', () => hideModal('menu-modal'));
    document.getElementById('btn-menu-journal').addEventListener('click', () => {
      hideModal('menu-modal');
      showScreen('journal');
      renderJournal('game');
    });
    const menuAchievementsBtn = document.getElementById('btn-menu-achievements');
    if (menuAchievementsBtn) {
      menuAchievementsBtn.addEventListener('click', () => {
        hideModal('menu-modal');
        renderAchievements();
        showModal('achievements-modal');
      });
    }
    document.getElementById('btn-menu-challenges').addEventListener('click', () => {
      hideModal('menu-modal');
      showScreen('challenge');
      renderChallenges();
    });
    document.getElementById('btn-menu-title').addEventListener('click', () => {
      hideModal('menu-modal');
      showScreen('title');
      updateTitleScreen();
    });
    document.getElementById('btn-menu-reset').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        resetGame();
        hideModal('menu-modal');
        showScreen('title');
        updateTitleScreen();
      }
    });

    // ---- Tutorial modal ----
    document.getElementById('btn-tutorial-start').addEventListener('click', () => {
      hideModal('intro-modal');
      advanceTutorial(2);
    });

    // ---- Hint bar ----
    document.getElementById('btn-dismiss-hint').addEventListener('click', () => {
      document.getElementById('hint-bar').style.display = 'none';
      state.stats.consecutiveFails = 0;
    });

    // ---- Journal screen ----
    document.getElementById('btn-journal-back').addEventListener('click', () => {
      showScreen(challengeMode ? 'challenge-play' : 'game');
    });
    document.getElementById('journal-era-filter').addEventListener('change', () => renderJournal());
    document.getElementById('journal-search').addEventListener('input', () => renderJournal());

    // ---- Challenge screen ----
    document.getElementById('btn-challenge-back').addEventListener('click', () => {
      showScreen('game');
      renderElementGrid();
      updateTopBar();
    });

    // ---- Challenge play ----
    document.getElementById('btn-challenge-quit').addEventListener('click', () => {
      challengeMode = false;
      currentChallenge = null;
      showScreen('challenge');
      renderChallenges();
    });
    document.getElementById('btn-challenge-combine').addEventListener('click', handleChallengeCombine);
    document.getElementById('challenge-slot-1').addEventListener('click', () => {
      if (challengeSlot1) {
        challengeSlot1 = null;
        updateChallengeForge();
        renderChallengeGrid();
      }
    });
    document.getElementById('challenge-slot-2').addEventListener('click', () => {
      if (challengeSlot2) {
        challengeSlot2 = null;
        updateChallengeForge();
        renderChallengeGrid();
      }
    });

    // ---- Challenge complete modal ----
    document.getElementById('btn-challenge-complete-ok').addEventListener('click', () => {
      hideModal('challenge-complete-modal');
      challengeMode = false;
      currentChallenge = null;
      showScreen('challenge');
      renderChallenges();
    });

    // ---- Achievements modal close ----
    const achievementsCloseBtn = document.getElementById('btn-achievements-close');
    if (achievementsCloseBtn) {
      achievementsCloseBtn.addEventListener('click', () => hideModal('achievements-modal'));
    }

    // ---- Modal backdrops close modals ----
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        backdrop.parentElement.style.display = 'none';
      });
    });

    // ---- Text command input for LLM playtesting ----
    const cmdInput = document.getElementById('cmd-input');
    if (cmdInput) {
      cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = cmdInput.value.trim().toLowerCase();
          cmdInput.value = '';
          handleTextCommand(cmd);
        }
      });
    }
  }

  // ============================================================
  // TEXT COMMAND INTERFACE (for LLM playtesting)
  // ============================================================
  function handleTextCommand(cmd) {
    const resultEl = document.getElementById('forge-result');

    if (cmd.startsWith('combine ')) {
      const parts = cmd.substring(8).split(' + ').map(s => s.trim());
      if (parts.length === 1) {
        const words = cmd.substring(8).trim();
        const matchedPair = findElementPair(words);
        if (matchedPair) {
          slot1Element = matchedPair[0];
          slot2Element = matchedPair[1];
          updateForgeSlots();
          renderElementGrid();
          handleCombine();
          return;
        }
      } else if (parts.length === 2) {
        const el1 = findElementByName(parts[0]);
        const el2 = findElementByName(parts[1]);
        if (el1 && el2) {
          slot1Element = el1;
          slot2Element = el2;
          updateForgeSlots();
          renderElementGrid();
          handleCombine();
          return;
        }
      }
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.className = 'forge-result failure';
        resultEl.innerHTML = '<div class="result-text">Could not parse elements. Use: combine element1 + element2</div>';
      }
    } else if (cmd.startsWith('journal ')) {
      const name = cmd.substring(8).trim();
      const el = findElementByName(name);
      if (el && state.discovered.includes(el)) {
        showJournalEntry(el);
      }
    } else if (cmd === 'list' || cmd === 'elements') {
      const names = state.discovered.map(id => ELEMENTS[id]?.name || id).join(', ');
      console.log('Discovered elements:', names);
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.className = 'forge-result already';
        resultEl.innerHTML = '<div class="result-text"><strong>' + state.discovered.length + ' discovered:</strong> ' + names + '</div>';
      }
    } else if (cmd === 'help') {
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.className = 'forge-result already';
        resultEl.innerHTML = '<div class="result-text">Commands: combine X + Y | journal X | list | help</div>';
      }
    } else if (cmd === 'stock' || cmd === 'inventory') {
      const items = Object.entries(state.inventory).filter(([, v]) => v > 0).map(([k, v]) => `${ELEMENTS[k]?.name || k}: ${v}`).join(', ');
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.className = 'forge-result already';
        resultEl.innerHTML = '<div class="result-text"><strong>Inventory:</strong> ' + (items || 'Empty') + '</div>';
      }
    }
  }

  function findElementByName(name) {
    name = name.toLowerCase().trim();
    if (ELEMENTS[name]) return name;
    for (const [id, el] of Object.entries(ELEMENTS)) {
      if (el.name.toLowerCase() === name) return id;
    }
    for (const [id, el] of Object.entries(ELEMENTS)) {
      if (el.name.toLowerCase().includes(name) || id.includes(name)) return id;
    }
    return null;
  }

  function findElementPair(text) {
    const discovered = state.discovered;
    const sorted = [...discovered].sort((a, b) =>
      (ELEMENTS[b]?.name.length || 0) - (ELEMENTS[a]?.name.length || 0)
    );
    let remaining = text.toLowerCase();
    let found = [];
    for (const id of sorted) {
      const name = ELEMENTS[id]?.name.toLowerCase();
      if (!name) continue;
      const idx = remaining.indexOf(name);
      if (idx !== -1) {
        found.push(id);
        remaining = remaining.substring(0, idx) + remaining.substring(idx + name.length);
        if (found.length === 2) return found;
      }
    }
    return null;
  }

  // Start!
  document.addEventListener('DOMContentLoaded', init);
})();
