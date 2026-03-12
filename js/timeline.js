// Universe Timeline — Story Mode Engine
// Manages era progression, dial interactions, choice screens, and discoveries.

const Timeline = (function() {
  'use strict';

  let appState = null;
  let currentEra = null;
  let currentEraIndex = 0;
  let dialValues = {};
  let discoveredInEra = [];
  let choiceIndex = 0;
  let hintTimer = null;
  let eraStartTime = 0;

  function init(state) {
    appState = state;
    currentEraIndex = state.storyProgress.currentEra || 0;

    // Setup era navigation
    document.getElementById('btn-prev-era').addEventListener('click', prevEra);
    document.getElementById('btn-next-era').addEventListener('click', nextEra);

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
    eraStartTime = Date.now();
    clearHintTimer();

    // Update header
    document.getElementById('era-title').textContent = `Era ${index + 1}: ${currentEra.name}`;
    document.getElementById('era-time').textContent = currentEra.timeAfterBang;
    document.getElementById('era-description').textContent = currentEra.description;

    // Update navigation
    document.getElementById('btn-prev-era').disabled = index === 0;
    const isLocked = index + 1 > appState.storyProgress.currentEra;
    document.getElementById('btn-next-era').disabled = index >= ERAS.length - 1 || isLocked;

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

    for (const dial of currentEra.dials) {
      dialValues[dial.id] = dial.default;

      const wrapper = document.createElement('div');
      wrapper.className = 'dial-wrapper';

      const label = document.createElement('label');
      label.className = 'dial-label';
      label.textContent = dial.name;

      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'dial-value';
      valueDisplay.id = `dial-val-${dial.id}`;
      valueDisplay.textContent = formatValue(dial.default, dial.unit);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'dial-slider';
      slider.id = `dial-${dial.id}`;
      slider.min = 0;
      slider.max = 1000;
      // Convert default to slider position (log scale)
      slider.value = valueToSlider(dial.default, dial.min, dial.max);

      slider.addEventListener('input', () => {
        const val = sliderToValue(parseInt(slider.value), dial.min, dial.max);
        dialValues[dial.id] = val;
        valueDisplay.textContent = formatValue(val, dial.unit);
        Audio.play('dial-tick');
        onDialChange();
      });

      const range = document.createElement('div');
      range.className = 'dial-range';
      range.innerHTML = `<span>${formatValue(dial.min, dial.unit)}</span><span>${formatValue(dial.max, dial.unit)}</span>`;

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

    const particleTypes = currentEra.particleTypes || ['quark'];
    // Add discovered particle types
    for (const d of discoveredInEra) {
      const el = ELEMENTS[d];
      if (el && !particleTypes.includes(d)) {
        particleTypes.push(d);
      }
    }

    Particles.setConfig({
      temperature: dialValues.temperature || 1e10,
      density: dialValues.density || 1e30,
      energy: dialValues.energy || 1e6,
      particleTypes
    });
  }

  function checkDialThresholds() {
    if (!currentEra.thresholds) return;

    for (const threshold of currentEra.thresholds) {
      if (discoveredInEra.includes(threshold.produces)) continue;

      // Check if all dial conditions are met
      let met = true;
      for (const [dialId, range] of Object.entries(threshold.conditions)) {
        const val = dialValues[dialId];
        if (val < range[0] || val > range[1]) {
          met = false;
          break;
        }
      }

      if (met) {
        triggerDiscovery(threshold.produces, threshold.explanation);
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
    if (!currentEra.choices || choiceIndex >= currentEra.choices.length) {
      // All choices answered — era complete
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

    const choice = currentEra.choices[choiceIndex];
    const feedbackDiv = document.getElementById('choice-feedback');
    feedbackDiv.style.display = 'none';
    feedbackDiv.className = 'choice-feedback';

    let html = `
      <div class="choice-context">${choice.context}</div>
      <div class="choice-question">${choice.question}</div>
      <div class="choice-options">
    `;

    for (let i = 0; i < choice.options.length; i++) {
      html += `<button class="choice-btn" data-index="${i}">${choice.options[i]}</button>`;
    }
    html += '</div>';
    panel.innerHTML = html;

    // Wire up buttons
    panel.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        handleChoiceAnswer(choice, idx, panel);
      });
    });
  }

  function handleChoiceAnswer(choice, selectedIndex, panel) {
    const correct = selectedIndex === choice.correct;
    const feedbackDiv = document.getElementById('choice-feedback');

    // Disable all buttons
    panel.querySelectorAll('.choice-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === choice.correct) btn.classList.add('correct');
      if (i === selectedIndex && !correct) btn.classList.add('wrong');
    });

    if (correct) {
      Audio.play('correct');
      feedbackDiv.className = 'choice-feedback correct';
      feedbackDiv.innerHTML = `
        <div class="feedback-icon">✓</div>
        <div class="feedback-text">${choice.explanation}</div>
      `;

      // Grant discovery
      if (choice.produces) {
        triggerDiscovery(choice.produces, null, false);
      }

      App.addScore(100);
    } else {
      Audio.play('wrong');
      feedbackDiv.className = 'choice-feedback wrong';
      feedbackDiv.innerHTML = `
        <div class="feedback-icon">✗</div>
        <div class="feedback-text">${choice.wrongExplanation || choice.explanation}</div>
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

  // === DISCOVERIES ===
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

    // Check if all discoveries in era are found
    if (currentEra.thresholds) {
      const allFound = currentEra.thresholds.every(t => discoveredInEra.includes(t.produces));
      if (allFound) {
        setTimeout(() => markEraComplete(), 1500);
      }
    }
  }

  function showDiscoveryPopup(elementId, explanation) {
    const el = ELEMENTS[elementId];
    if (!el) return;

    const popup = document.getElementById('discovery-popup');
    const journal = JOURNAL[elementId];

    popup.innerHTML = `
      <div class="discovery-header">
        <span class="discovery-symbol" style="color:${el.color}">${el.symbol}</span>
        <span class="discovery-name">${el.name}</span>
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

    const allTargets = currentEra.thresholds
      ? currentEra.thresholds.map(t => t.produces)
      : (currentEra.choices || []).filter(c => c.produces).map(c => c.produces);

    list.innerHTML = '';
    for (const id of allTargets) {
      const found = discoveredInEra.includes(id);
      const el = ELEMENTS[id];
      const item = document.createElement('div');
      item.className = 'discovery-item' + (found ? ' found' : '');
      item.innerHTML = `
        <span class="discovery-check">${found ? '☑' : '☐'}</span>
        <span class="discovery-label" style="${found && el ? 'color:' + el.color : ''}">${found && el ? el.name : '???'}</span>
      `;
      list.appendChild(item);
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
  function startHintTimer() {
    clearHintTimer();
    hintTimer = setTimeout(showHint, 30000);
  }

  function resetHintTimer() {
    clearHintTimer();
    hintTimer = setTimeout(showHint, 30000);
  }

  function clearHintTimer() {
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = null;
  }

  function showHint() {
    if (!currentEra || currentEra.type !== 'dials') return;

    // Find first undiscovered threshold and show its hint
    const next = currentEra.thresholds.find(t => !discoveredInEra.includes(t.produces));
    if (!next || !next.hint) return;

    const hintEl = document.getElementById('dial-hint');
    if (hintEl) {
      hintEl.textContent = next.hint;
      hintEl.style.display = 'block';
      setTimeout(() => hintEl.style.display = 'none', 8000);
    }

    // Reset for next hint
    startHintTimer();
  }

  // === NAVIGATION ===
  function prevEra() {
    if (currentEraIndex > 0) loadEra(currentEraIndex - 1);
  }

  function nextEra() {
    if (currentEraIndex < ERAS.length - 1) loadEra(currentEraIndex + 1);
  }

  // === UTILITY ===
  function sliderToValue(sliderPos, min, max) {
    // Log scale interpolation
    const logMin = Math.log10(Math.max(min, 1e-10));
    const logMax = Math.log10(Math.max(max, 1e-10));
    const t = sliderPos / 1000;
    return Math.pow(10, logMin + t * (logMax - logMin));
  }

  function valueToSlider(value, min, max) {
    const logMin = Math.log10(Math.max(min, 1e-10));
    const logMax = Math.log10(Math.max(max, 1e-10));
    const logVal = Math.log10(Math.max(value, 1e-10));
    return Math.round(((logVal - logMin) / (logMax - logMin)) * 1000);
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
