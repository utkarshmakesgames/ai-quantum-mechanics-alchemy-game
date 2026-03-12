// Universe Timeline — Audio Manager
// Simple Web Audio API sound effects with no external dependencies.

const Audio = (function() {
  'use strict';

  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function play(type) {
    if (muted) return;
    try {
      const ac = getCtx();
      switch (type) {
        case 'discovery': playDiscovery(ac); break;
        case 'dial-tick': playDialTick(ac); break;
        case 'correct': playCorrect(ac); break;
        case 'wrong': playWrong(ac); break;
        case 'cascade': playCascade(ac); break;
        case 'era-complete': playEraComplete(ac); break;
        case 'combine': playCombine(ac); break;
        case 'click': playClick(ac); break;
      }
    } catch (e) { /* audio not available */ }
  }

  function playTone(ac, freq, duration, type, gain) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.value = gain || 0.15;
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  }

  function playDiscovery(ac) {
    playTone(ac, 523, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(ac, 659, 0.15, 'sine', 0.2), 100);
    setTimeout(() => playTone(ac, 784, 0.3, 'sine', 0.25), 200);
  }

  function playDialTick(ac) {
    playTone(ac, 800, 0.05, 'square', 0.05);
  }

  function playCorrect(ac) {
    playTone(ac, 440, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(ac, 660, 0.2, 'sine', 0.15), 80);
  }

  function playWrong(ac) {
    playTone(ac, 200, 0.3, 'sawtooth', 0.1);
  }

  function playCascade(ac) {
    const freqs = [262, 330, 392, 523, 659];
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(ac, f, 0.2, 'sine', 0.12), i * 80);
    });
  }

  function playEraComplete(ac) {
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(ac, f, 0.3, 'sine', 0.2), i * 150);
    });
  }

  function playCombine(ac) {
    playTone(ac, 350, 0.1, 'triangle', 0.12);
    setTimeout(() => playTone(ac, 500, 0.15, 'triangle', 0.12), 60);
  }

  function playClick(ac) {
    playTone(ac, 600, 0.04, 'square', 0.06);
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  return { play, toggleMute, isMuted: () => muted };
})();
