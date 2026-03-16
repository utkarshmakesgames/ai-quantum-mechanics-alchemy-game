// Universe Timeline — Main App Shell
// Mode switching, save/load, global state management.

const App = (function() {
  'use strict';

  const SAVE_KEY = 'universe_timeline_save';

  let state = {
    mode: null,           // 'story' | 'sandbox'
    storyProgress: {
      currentEra: 0,      // 0 = not started, 1-8 = era index
      completedEras: [],   // era IDs that are done
      discoveries: [],     // element IDs discovered in story mode
      totalScore: 0
    },
    sandboxDiscovered: [], // elements available in sandbox (unlocked by story)
    sandboxInventory: {},  // { elementId: count }
    settings: {
      muted: false
    },
    eraStars: {}  // { eraIndex: 1-3 }
  };

  function init() {
    loadGame();
    setupEventListeners();
    updateMenuProgress();

    // Start on title screen or resume mode
    if (state.mode === 'story') {
      switchMode('story');
    } else if (state.mode === 'sandbox') {
      switchMode('sandbox');
    } else {
      showScreen('title');
    }
  }

  function updateMenuProgress() {
    const storyProg = document.getElementById('story-progress-indicator');
    if (storyProg) {
      const completed = state.storyProgress.completedEras.length;
      storyProg.textContent = completed + '/' + ERAS.length + ' Eras';
    }
    const sandboxProg = document.getElementById('sandbox-progress-indicator');
    if (sandboxProg) {
      const discovered = (state.sandboxDiscovered || []).length;
      const total = Object.keys(ELEMENTS).length;
      sandboxProg.textContent = discovered + '/' + total + ' Elements';
    }
  }

  function setupEventListeners() {
    // Title screen buttons
    document.getElementById('btn-story').addEventListener('click', () => switchMode('story'));
    document.getElementById('btn-sandbox').addEventListener('click', () => {
      if (state.storyProgress.discoveries.length === 0) {
        // No progress yet — show hint
        const hint = document.getElementById('sandbox-hint');
        if (hint) {
          hint.style.display = 'block';
          setTimeout(() => hint.style.display = 'none', 3000);
        }
        return;
      }
      switchMode('sandbox');
    });

    // Back to title
    document.querySelectorAll('.btn-back-title').forEach(btn => {
      btn.addEventListener('click', () => {
        state.mode = null;
        saveGame();
        showScreen('title');
        Timeline.stop();
        Particles.stop();
      });
    });

    // Mute toggle
    document.querySelectorAll('.btn-mute').forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.muted = Audio.toggleMute();
        document.querySelectorAll('.btn-mute').forEach(b => {
          b.textContent = state.settings.muted ? '🔇' : '🔊';
        });
        saveGame();
      });
    });
  }

  function switchMode(mode) {
    state.mode = mode;
    saveGame();

    if (mode === 'story') {
      showScreen('story');
      Timeline.init(state);
    } else if (mode === 'sandbox') {
      showScreen('sandbox');
      Sandbox.init(state);
    }
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById('screen-' + id);
    if (screen) screen.classList.add('active');
  }

  // === SAVE / LOAD ===
  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* storage full */ }
  }

  function loadGame() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        state = {
          ...state,
          ...parsed,
          storyProgress: { ...state.storyProgress, ...(parsed.storyProgress || {}) },
          settings: { ...state.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) { /* corrupt save */ }

    // Sync mute state
    if (state.settings.muted) Audio.toggleMute();
  }

  function resetProgress() {
    localStorage.removeItem(SAVE_KEY);
    state = {
      mode: null,
      storyProgress: { currentEra: 0, completedEras: [], discoveries: [], totalScore: 0 },
      sandboxDiscovered: [],
      sandboxInventory: {},
      settings: state.settings // keep settings
    };
    showScreen('title');
  }

  // === PUBLIC API ===
  function getState() { return state; }

  function addDiscovery(elementId) {
    if (!state.storyProgress.discoveries.includes(elementId)) {
      state.storyProgress.discoveries.push(elementId);
    }
    if (!state.sandboxDiscovered.includes(elementId)) {
      state.sandboxDiscovered.push(elementId);
    }
    saveGame();
  }

  function completeEra(eraId) {
    if (!state.storyProgress.completedEras.includes(eraId)) {
      state.storyProgress.completedEras.push(eraId);
    }
    state.storyProgress.currentEra = Math.max(state.storyProgress.currentEra, eraId + 1);
    saveGame();
  }

  function addScore(points) {
    state.storyProgress.totalScore += points;
    saveGame();
  }

  return {
    init, getState, saveGame, addDiscovery, completeEra, addScore,
    switchMode, showScreen, resetProgress
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
