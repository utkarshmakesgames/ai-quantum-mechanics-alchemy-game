// Universe Timeline — Story Mode Engine
// Manages era progression, dial interactions, choice screens, and discoveries.

const Timeline = (function() {
  'use strict';

  let appState = null;
  let currentEra = null;
  let currentEraIndex = 0;
  let dialValues = {};       // stores log10 exponents, e.g. { temperature: 12.5 }
  let discoveredInEra = [];
  let choiceIndex = 0;
  let hintTimer = null;
  let hintIndex = 0;
  let eraStartTime = 0;
  let navBound = false;

  function init(state) {
    appState = state;
    currentEraIndex = state.storyProgress.currentEra || 0;

    // Only bind nav once to avoid stacking listeners
    if (!navBound) {
      document.getElementById('btn-prev-era').addEventListener('click', prevEra);
      document.getElementById('btn-next-era').addEventListener('click', nextEra);
      navBound = true;
    }

    renderEraMap();
    loadEra(currentEraIndex);
  }

  function stop() {
    clearHintTimer();
    Particles.stop();
  }

  // === ERA MAP (sidebar/nav) ===
  function renderEraMap() {
    const map = document.getElementById('era-map');
    if (!map) return;
    map.innerHTML = '';

    for (let i = 0; i < ERAS.length; i++) {
      const era = ERAS[i];
      const completed = appState.storyProgress.completedEras.includes(i);
      const current = i === currentEraIndex;
      const locked = i > appState.storyProgress.currentEra;

      const item = document.createElement('div');
      item.className = 'era-map-item' +
        (completed ? ' completed' : '') +
        (current ? ' current' : '') +
        (locked ? ' locked' : '');
      item.innerHTML = `
        <span class="era-map-num">${i + 1}</span>
        <span class="era-map-name">${era.name}</span>
        ${completed ? '<span class="era-map-check">✓</span>' : ''}
      `;
      if (!locked) {
        item.addEventListener('click', () => loadEra(i));
      }
      map.appendChild(item);
    }
  }

  function loadEra(index) {
    if (index < 0 || index >= ERAS.length) return;
    currentEraIndex = index;
    currentEra = ERAS[index];
    discoveredInEra = [];
    choiceIndex = 0;
    hintIndex = 0;
    eraStartTime = Date.now();
    clearHintTimer();

    // Update header — eras.js uses `time` and `intro`
    document.getElementById('era-title').textContent = `Era ${index + 1}: ${currentEra.name}`;
    document.getElementById('era-time').textContent = currentEra.time || '';
    document.getElementById('era-description').textContent = currentEra.intro || '';

    // Update navigation
    document.getElementById('btn-prev-era').disabled = index === 0;
    const isLocked = index + 1 > appState.storyProgress.currentEra;
    document.getElementById('btn-next-era').disabled = index >= ERAS.length - 1 || isLocked;

    // Hide hint
    const hintEl = document.getElementById('dial-hint');
    if (hintEl) hintEl.style.display = 'none';

    // Show correct panel
    if (currentEra.type === 'dials') {
      showDialMode();
    } else {
      showChoiceMode();
    }

    renderEraMap();
    renderDiscoveryList();
  }

  // === DIAL MODE ===
  function showDialMode() {
    document.getElementById('dial-panel').style.display = 'block';
    document.getElementById('choice-panel').style.display = 'none';

    const container = document.getElementById('dial-sliders');
    container.innerHTML = '';
    dialValues = {};

    // eras.js dials is an object: { temperature: { label, unit, min, max, ... }, ... }
    // min/max are log10 exponents (e.g. min:10, max:15 means 10^10 to 10^15)
    for (const [dialId, dial] of Object.entries(currentEra.dials)) {
      const defaultLog = (dial.min + dial.max) / 2; // midpoint of log range
      dialValues[dialId] = defaultLog;

      const wrapper = document.createElement('div');
      wrapper.className = 'dial-wrapper';

      const label = document.createElement('label');
      label.className = 'dial-label';
      label.textContent = dial.label || dialId;

      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'dial-value';
      valueDisplay.id = `dial-val-${dialId}`;
      valueDisplay.textContent = formatLogValue(defaultLog, dial.unit);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'dial-slider';
      slider.id = `dial-${dialId}`;
      slider.min = 0;
      slider.max = 1000;
      slider.value = 500; // midpoint

      const capturedId = dialId;
      const capturedDial = dial;
      slider.addEventListener('input', () => {
        const t = parseInt(slider.value) / 1000;
        const logVal = capturedDial.min + t * (capturedDial.max - capturedDial.min);
        dialValues[capturedId] = logVal;
        valueDisplay.textContent = formatLogValue(logVal, capturedDial.unit);
        Audio.play('dial-tick');
        onDialChange();
      });

      const range = document.createElement('div');
      range.className = 'dial-range';
      range.innerHTML = `<span>${formatLogValue(dial.min, dial.unit)}</span><span>${formatLogValue(dial.max, dial.unit)}</span>`;

      wrapper.appendChild(label);
      wrapper.appendChild(valueDisplay);
      wrapper.appendChild(slider);
      wrapper.appendChild(range);
      container.appendChild(wrapper);
    }

    // Start particle visualization
    Particles.init(document.getElementById('particle-canvas'));
    updateParticleConfig();
    Particles.start();

    // Start hint timer
    startHintTimer();
  }

  function onDialChange() {
    updateParticleConfig();
    checkDialThresholds();
    resetHintTimer();
  }

  function updateParticleConfig() {
    if (!currentEra || currentEra.type !== 'dials') return;

    const particleTypes = currentEra.particleTypes ? [...currentEra.particleTypes] : ['quark'];
    // Add discovered particle types — map discovery IDs to element IDs
    if (currentEra.discoveries) {
      for (const disc of currentEra.discoveries) {
        if (discoveredInEra.includes(disc.id)) {
          const elemId = disc.element || disc.id;
          if (ELEMENTS[elemId] && !particleTypes.includes(elemId)) {
            particleTypes.push(elemId);
          }
        }
      }
    }

    // Convert log10 values to actual values for the particle system
    Particles.setConfig({
      temperature: Math.pow(10, dialValues.temperature || 10),
      density: Math.pow(10, dialValues.density || 30),
      energy: Math.pow(10, dialValues.energy || 6),
      particleTypes
    });
  }

  function checkDialThresholds() {
    // eras.js uses `discoveries` array, each with conditions as { dialId: { min?, max? } }
    if (!currentEra.discoveries) return;

    for (const discovery of currentEra.discoveries) {
      // Use discovery.id for era-local tracking (handles He-3/He-4 both mapping to 'helium')
      if (discoveredInEra.includes(discovery.id)) continue;

      // Check if all dial conditions are met (values are in log10 scale)
      let met = true;
      for (const [dialId, cond] of Object.entries(discovery.conditions)) {
        const val = dialValues[dialId];
        if (val === undefined) { met = false; break; }
        if (cond.min !== undefined && val < cond.min) { met = false; break; }
        if (cond.max !== undefined && val > cond.max) { met = false; break; }
      }

      if (met) {
        triggerDialDiscovery(discovery);
      }
    }
  }

  function triggerDialDiscovery(discovery) {
    if (discoveredInEra.includes(discovery.id)) return;
    discoveredInEra.push(discovery.id);

    // Register the element globally (for sandbox mode)
    const elementId = discovery.element || discovery.id;
    App.addDiscovery(elementId);
    App.addScore(50);

    Audio.play('discovery');
    Particles.flash('#00e5ff');
    Particles.burst(elementId, 20);

    renderDiscoveryList();
    updateParticleConfig();

    // Show popup with discovery name (may differ from element name, e.g. "Helium-3")
    showDiscoveryPopup(elementId, discovery.explanation, discovery.name);

    // Check if all discoveries in this era are found
    if (currentEra.discoveries) {
      const allFound = currentEra.discoveries.every(d => discoveredInEra.includes(d.id));
      if (allFound) {
        setTimeout(() => markEraComplete(), 1500);
      }
    }
  }

  // === CHOICE MODE ===
  function showChoiceMode() {
    document.getElementById('dial-panel').style.display = 'none';
    document.getElementById('choice-panel').style.display = 'block';
    Particles.stop();

    renderCurrentChoice();
  }

  function renderCurrentChoice() {
    const panel = document.getElementById('choice-content');
    // eras.js uses `questions` array
    const questions = currentEra.questions || [];
    if (choiceIndex >= questions.length) {
      // All questions answered — era complete
      panel.innerHTML = `
        <div class="choice-complete">
          <h3>Era Complete!</h3>
          <p>You've answered all questions for ${currentEra.name}.</p>
          <p>Score: +${discoveredInEra.length * 100} points</p>
        </div>
      `;
      markEraComplete();
      return;
    }

    const q = questions[choiceIndex];
    const feedbackDiv = document.getElementById('choice-feedback');
    feedbackDiv.style.display = 'none';
    feedbackDiv.className = 'choice-feedback';

    // eras.js questions have: text, choices, correct, explanations, element
    let html = `
      <div class="choice-context">${currentEra.intro || ''}</div>
      <div class="choice-question">${q.text}</div>
      <div class="choice-options">
    `;

    for (let i = 0; i < q.choices.length; i++) {
      html += `<button class="choice-btn" data-index="${i}">${q.choices[i]}</button>`;
    }
    html += '</div>';
    panel.innerHTML = html;

    // Wire up buttons
    panel.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        handleChoiceAnswer(q, idx, panel);
      });
    });
  }

  function handleChoiceAnswer(q, selectedIndex, panel) {
    const correct = selectedIndex === q.correct;
    const feedbackDiv = document.getElementById('choice-feedback');

    // Disable all buttons
    panel.querySelectorAll('.choice-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add('correct');
      if (i === selectedIndex && !correct) btn.classList.add('wrong');
    });

    if (correct) {
      Audio.play('correct');
      feedbackDiv.className = 'choice-feedback correct';
      feedbackDiv.innerHTML = `
        <div class="feedback-icon">✓</div>
        <div class="feedback-text">${q.explanations.correct}</div>
      `;

      // Grant discovery if this question has an element
      if (q.element) {
        triggerDiscovery(q.element, null, false);
      }

      App.addScore(100);
    } else {
      Audio.play('wrong');
      feedbackDiv.className = 'choice-feedback wrong';
      // eras.js wrong explanations are keyed by choice index
      const wrongText = (q.explanations.wrong && q.explanations.wrong[selectedIndex])
        || q.explanations.correct;
      feedbackDiv.innerHTML = `
        <div class="feedback-icon">✗</div>
        <div class="feedback-text">${wrongText}</div>
      `;
      App.addScore(25); // partial credit for trying
    }

    feedbackDiv.style.display = 'block';

    // Add "Continue" button
    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn-continue';
    continueBtn.textContent = 'Continue →';
    continueBtn.addEventListener('click', () => {
      choiceIndex++;
      renderCurrentChoice();
    });
    feedbackDiv.appendChild(continueBtn);
  }

  // === DISCOVERIES (choice mode) ===
  function triggerDiscovery(elementId, explanation, showModal) {
    if (discoveredInEra.includes(elementId)) return;
    discoveredInEra.push(elementId);

    // Register globally
    App.addDiscovery(elementId);
    App.addScore(50);

    Audio.play('discovery');
    Particles.flash('#00e5ff');
    Particles.burst(elementId, 20);

    renderDiscoveryList();
    updateParticleConfig();

    // Show discovery popup
    if (showModal !== false) {
      showDiscoveryPopup(elementId, explanation);
    }
  }

  function showDiscoveryPopup(elementId, explanation, overrideName) {
    const el = ELEMENTS[elementId];
    if (!el) return;

    const popup = document.getElementById('discovery-popup');
    const journal = JOURNAL[elementId];
    const displayName = overrideName || el.name;

    popup.innerHTML = `
      <div class="discovery-header">
        <span class="discovery-symbol" style="color:${el.color}">${el.symbol}</span>
        <span class="discovery-name">${displayName}</span>
      </div>
      <div class="discovery-explanation">${explanation || (journal && journal.text) || el.description || ''}</div>
      ${journal && journal.funFact ? `<div class="discovery-funfact">💡 ${journal.funFact}</div>` : ''}
    `;
    popup.classList.add('show');

    clearTimeout(popup._hideTimer);
    popup._hideTimer = setTimeout(() => popup.classList.remove('show'), 6000);
    popup.addEventListener('click', () => popup.classList.remove('show'), { once: true });
  }

  function renderDiscoveryList() {
    const list = document.getElementById('era-discoveries');
    if (!list || !currentEra) return;

    list.innerHTML = '';

    if (currentEra.discoveries) {
      // Dial eras — track by discovery.id, display discovery.name
      for (const d of currentEra.discoveries) {
        const found = discoveredInEra.includes(d.id);
        const el = ELEMENTS[d.element || d.id];
        const item = document.createElement('div');
        item.className = 'discovery-item' + (found ? ' found' : '');
        item.innerHTML = `
          <span class="discovery-check">${found ? '☑' : '☐'}</span>
          <span class="discovery-label" style="${found && el ? 'color:' + el.color : ''}">${found ? d.name : '???'}</span>
        `;
        list.appendChild(item);
      }
    } else if (currentEra.questions) {
      // Choice eras — track by element ID
      for (const q of currentEra.questions) {
        if (!q.element) continue;
        const found = discoveredInEra.includes(q.element);
        const el = ELEMENTS[q.element];
        const item = document.createElement('div');
        item.className = 'discovery-item' + (found ? ' found' : '');
        item.innerHTML = `
          <span class="discovery-check">${found ? '☑' : '☐'}</span>
          <span class="discovery-label" style="${found && el ? 'color:' + el.color : ''}">${found && el ? el.name : '???'}</span>
        `;
        list.appendChild(item);
      }
    }
  }

  // === ERA COMPLETION ===
  function markEraComplete() {
    App.completeEra(currentEraIndex);
    Audio.play('era-complete');
    renderEraMap();

    // Update next button
    const nextBtn = document.getElementById('btn-next-era');
    if (currentEraIndex < ERAS.length - 1) {
      nextBtn.disabled = false;
    }

    // Show completion banner
    const banner = document.getElementById('era-complete-banner');
    if (banner) {
      banner.style.display = 'flex';
      banner.querySelector('.era-complete-text').textContent =
        `${currentEra.name} Complete! +${discoveredInEra.length * 50} points`;
      setTimeout(() => banner.style.display = 'none', 4000);
    }
  }

  // === HINTS ===
  // eras.js hints are era-level: [{ delay, text }, ...]
  function startHintTimer() {
    clearHintTimer();
    if (!currentEra.hints || !currentEra.hints.length) return;
    const firstHint = currentEra.hints[0];
    hintTimer = setTimeout(showHint, (firstHint.delay || 30) * 1000);
  }

  function resetHintTimer() {
    clearHintTimer();
    if (!currentEra.hints || !currentEra.hints.length) return;
    const hint = currentEra.hints[Math.min(hintIndex, currentEra.hints.length - 1)];
    hintTimer = setTimeout(showHint, (hint.delay || 30) * 1000);
  }

  function clearHintTimer() {
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = null;
  }

  function showHint() {
    if (!currentEra || currentEra.type !== 'dials') return;
    if (!currentEra.hints || !currentEra.hints.length) return;

    const hint = currentEra.hints[Math.min(hintIndex, currentEra.hints.length - 1)];
    if (!hint) return;

    const hintEl = document.getElementById('dial-hint');
    if (hintEl) {
      hintEl.textContent = hint.text;
      hintEl.style.display = 'block';
      setTimeout(() => hintEl.style.display = 'none', 8000);
    }

    // Advance to next hint for next cycle
    hintIndex = Math.min(hintIndex + 1, currentEra.hints.length - 1);

    // Schedule next hint if there are undiscovered items
    if (currentEra.discoveries) {
      const anyLeft = currentEra.discoveries.some(d =>
        !discoveredInEra.includes(d.id)
      );
      if (anyLeft) {
        startHintTimer();
      }
    }
  }

  // === NAVIGATION ===
  function prevEra() {
    if (currentEraIndex > 0) loadEra(currentEraIndex - 1);
  }

  function nextEra() {
    if (currentEraIndex < ERAS.length - 1) loadEra(currentEraIndex + 1);
  }

  // === UTILITY ===
  // Format a log10 exponent as a human-readable value with unit
  function formatLogValue(logExp, unit) {
    const value = Math.pow(10, logExp);
    return formatValue(value, unit);
  }

  function formatValue(value, unit) {
    if (value >= 1e12) return (value / 1e12).toFixed(1) + ' T' + (unit || '');
    if (value >= 1e9) return (value / 1e9).toFixed(1) + ' G' + (unit || '');
    if (value >= 1e6) return (value / 1e6).toFixed(1) + ' M' + (unit || '');
    if (value >= 1e3) return (value / 1e3).toFixed(1) + ' k' + (unit || '');
    if (value >= 1) return value.toFixed(1) + ' ' + (unit || '');
    if (value >= 1e-3) return (value * 1e3).toFixed(1) + ' m' + (unit || '');
    if (value >= 1e-6) return (value * 1e6).toFixed(1) + ' μ' + (unit || '');
    return value.toExponential(1) + ' ' + (unit || '');
  }

  return { init, stop, loadEra };
})();
