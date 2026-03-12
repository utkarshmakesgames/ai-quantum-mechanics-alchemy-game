// ============================================================
// Quantum Forge — Procedural Sound Effects (Web Audio API)
// ============================================================

const SFX = (function() {
  'use strict';

  let ctx = null;
  let masterGain = null;
  let muted = false;

  function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function getMaster() {
    ensureContext();
    return masterGain;
  }

  let volume = 0.3; // linear gain value

  // Toggle mute
  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : volume;
    return muted;
  }

  function isMuted() { return muted; }

  // Set volume from a 0-1 linear value (already converted from log slider)
  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    muted = volume === 0;
    if (masterGain) masterGain.gain.value = volume;
  }

  function getVolume() { return volume; }

  // ---- Sound Primitives ----

  function createOsc(type, freq, startTime, duration) {
    const c = ensureContext();
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.start(startTime);
    osc.stop(startTime + duration);
    return osc;
  }

  function createEnvelope(startTime, attack, sustain, release) {
    const c = ensureContext();
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + attack);
    gain.gain.setValueAtTime(1, startTime + attack + sustain);
    gain.gain.linearRampToValueAtTime(0, startTime + attack + sustain + release);
    return gain;
  }

  function createNoiseBurst(startTime, duration, filterFreq, filterQ) {
    const c = ensureContext();
    const bufferSize = Math.ceil(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.start(startTime);
    src.stop(startTime + duration);

    if (filterFreq) {
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = filterFreq;
      filter.Q.value = filterQ || 5;
      src.connect(filter);
      return filter;
    }
    return src;
  }

  // ---- Sound Effects ----

  // Combine success: rising tone sweep + short reverb
  function playSuccess() {
    const c = ensureContext();
    const t = c.currentTime;
    const osc = createOsc('sine', 200, t, 0.3);
    osc.frequency.linearRampToValueAtTime(800, t + 0.3);

    const env = createEnvelope(t, 0.02, 0.15, 0.13);
    env.gain.setValueAtTime(0.6, t);
    osc.connect(env);

    // Bright shimmer overlay
    const osc2 = createOsc('triangle', 600, t + 0.05, 0.2);
    osc2.frequency.linearRampToValueAtTime(1200, t + 0.25);
    const env2 = createEnvelope(t + 0.05, 0.01, 0.08, 0.11);
    env2.gain.setValueAtTime(0.3, t + 0.05);
    osc2.connect(env2);

    env.connect(getMaster());
    env2.connect(getMaster());
  }

  // New discovery: success + sparkle + triumphant chord
  function playDiscovery() {
    const c = ensureContext();
    const t = c.currentTime;

    // Rising sweep
    const osc = createOsc('sine', 300, t, 0.4);
    osc.frequency.linearRampToValueAtTime(900, t + 0.35);
    const env = createEnvelope(t, 0.02, 0.2, 0.18);
    osc.connect(env);
    env.connect(getMaster());

    // Sparkle noise burst
    const noise = createNoiseBurst(t + 0.15, 0.25, 4000, 8);
    const noiseEnv = createEnvelope(t + 0.15, 0.01, 0.08, 0.16);
    noiseEnv.gain.setValueAtTime(0.25, t + 0.15);
    noise.connect(noiseEnv);
    noiseEnv.connect(getMaster());

    // Triumphant major third chord
    const chordStart = t + 0.25;
    [523, 659, 784].forEach((freq, i) => {
      const o = createOsc('sine', freq, chordStart + i * 0.05, 0.5);
      const e = createEnvelope(chordStart + i * 0.05, 0.02, 0.2, 0.28);
      e.gain.setValueAtTime(0.25, chordStart + i * 0.05);
      o.connect(e);
      e.connect(getMaster());
    });
  }

  // Combine fail: low buzz + pitch drop
  function playFail() {
    const c = ensureContext();
    const t = c.currentTime;
    const osc = createOsc('sawtooth', 80, t, 0.25);
    osc.frequency.linearRampToValueAtTime(40, t + 0.25);
    const env = createEnvelope(t, 0.01, 0.1, 0.14);
    env.gain.setValueAtTime(0.3, t);

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    osc.connect(filter);
    filter.connect(env);
    env.connect(getMaster());
  }

  // Element select click: soft tick
  function playClick() {
    const c = ensureContext();
    const t = c.currentTime;
    const noise = createNoiseBurst(t, 0.008, 2000, 10);
    const env = createEnvelope(t, 0.001, 0.003, 0.004);
    env.gain.setValueAtTime(0.4, t);
    noise.connect(env);
    env.connect(getMaster());
  }

  // Streak milestone: ascending arpeggio
  function playStreak(level) {
    const c = ensureContext();
    const t = c.currentTime;
    // Higher base pitch for higher streaks
    const baseFreq = 400 + (level || 0) * 60;
    const notes = [0, 4, 7]; // major triad in semitones
    notes.forEach((semi, i) => {
      const freq = baseFreq * Math.pow(2, semi / 12);
      const o = createOsc('triangle', freq, t + i * 0.08, 0.2);
      const e = createEnvelope(t + i * 0.08, 0.01, 0.08, 0.11);
      e.gain.setValueAtTime(0.35, t + i * 0.08);
      o.connect(e);
      e.connect(getMaster());
    });
  }

  // Decoherence warning: low rumble with beating
  function playDecoherence() {
    const c = ensureContext();
    const t = c.currentTime;

    const osc1 = createOsc('sine', 40, t, 1.5);
    const osc2 = createOsc('sine', 60, t, 1.5);

    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.4, t + 1.0);
    env.gain.linearRampToValueAtTime(0, t + 1.5);

    osc1.connect(env);
    osc2.connect(env);
    env.connect(getMaster());
  }

  // Achievement unlock: fanfare
  function playAchievement() {
    const c = ensureContext();
    const t = c.currentTime;

    // 4-note ascending scale: C5, E5, G5, C6
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = createOsc('sine', freq, t + i * 0.1, 0.35);
      const e = createEnvelope(t + i * 0.1, 0.02, 0.15, 0.18);
      e.gain.setValueAtTime(0.3, t + i * 0.1);
      o.connect(e);
      e.connect(getMaster());
    });

    // Shimmer
    const shimmer = createNoiseBurst(t + 0.3, 0.4, 6000, 3);
    const sEnv = createEnvelope(t + 0.3, 0.05, 0.15, 0.2);
    sEnv.gain.setValueAtTime(0.15, t + 0.3);
    shimmer.connect(sEnv);
    sEnv.connect(getMaster());
  }

  // Stability critical: crackling
  function playCrackle() {
    const c = ensureContext();
    const t = c.currentTime;

    for (let i = 0; i < 3; i++) {
      const offset = i * 0.15 + Math.random() * 0.05;
      const noise = createNoiseBurst(t + offset, 0.02, 1500, 6);
      const env = createEnvelope(t + offset, 0.002, 0.008, 0.01);
      env.gain.setValueAtTime(0.2, t + offset);
      noise.connect(env);
      env.connect(getMaster());
    }
  }

  // ---- Public API ----
  const sounds = {
    success: playSuccess,
    discovery: playDiscovery,
    fail: playFail,
    click: playClick,
    streak: playStreak,
    decoherence: playDecoherence,
    achievement: playAchievement,
    crackle: playCrackle
  };

  function play(name, arg) {
    if (muted) return;
    try {
      const fn = sounds[name];
      if (fn) fn(arg);
    } catch (e) {
      // Silently fail — audio shouldn't break gameplay
    }
  }

  return { play, toggleMute, isMuted, ensureContext, getMaster, setVolume, getVolume };
})();

// ============================================================
// Quantum Forge — Procedural Generative Music (Web Audio API)
// Ambient electronica: arpeggiated pads, evolving chords,
// gentle melody, slow tempo. Ramps with streaks.
// ============================================================

const AMBIENCE = (function() {
  'use strict';

  let running = false;
  let muted = false;
  let intensity = 0;        // 0–1
  let ctx = null;
  let masterGain = null;
  let reverbGain = null;
  let convolver = null;
  let compressor = null;
  let loopTimer = null;
  let padOscs = [];

  // ---- Musical data ----
  // All frequencies in Hz. A minor / C major pentatonic flavour.
  const SCALE = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24]; // semitones from root (A minor pentatonic, 2 octaves)
  const ROOT = 220; // A3

  // Chord progressions (semitone offsets from root)
  const PROGRESSIONS = [
    [[0, 7, 12, 15],  [5, 12, 17, 19], [3, 10, 15, 19], [7, 12, 15, 19]],   // Am → F → C → Em feel
    [[0, 7, 12, 19],  [3, 7, 12, 15],  [5, 10, 17, 22], [0, 5, 12, 17]],    // dreamy variant
    [[0, 12, 15, 19], [5, 12, 17, 24], [7, 10, 15, 22], [3, 10, 12, 19]],   // wider voicing
  ];

  let currentProg = 0;
  let currentChord = 0;
  let beat = 0;

  // Tempo: ~70 BPM, each "tick" = 1 eighth note
  const BPM = 70;
  const TICK_MS = (60000 / BPM) / 2; // ~428ms per eighth note

  // ---- Helpers ----
  function semiToFreq(semi) {
    return ROOT * Math.pow(2, semi / 12);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Create a simple reverb impulse response
  function createReverbIR(ctx, duration, decay) {
    const rate = ctx.sampleRate;
    const len = rate * duration;
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  // Play a single note with envelope (returns nothing, fire-and-forget)
  function playNote(freq, startTime, duration, volume, type) {
    if (!ctx || muted) return;
    type = type || 'sine';
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    // Slight random detune for warmth
    osc.detune.value = (Math.random() - 0.5) * 8;

    const env = ctx.createGain();
    const att = Math.min(0.08, duration * 0.15);
    const rel = duration * 0.5;
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(volume, startTime + att);
    env.gain.setValueAtTime(volume, startTime + duration - rel);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(env);
    env.connect(compressor);

    // Also send to reverb
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.3;
    env.connect(reverbSend);
    reverbSend.connect(convolver);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Soft pad chord — long sustained notes
  function playPadChord(chord, startTime, duration) {
    chord.forEach((semi, i) => {
      const freq = semiToFreq(semi);
      // Stagger slightly for lush feel
      const offset = i * 0.06;
      playNote(freq, startTime + offset, duration, 0.06, 'sine');
      // Double with quiet triangle an octave down for body
      if (i === 0) {
        playNote(freq / 2, startTime, duration, 0.04, 'triangle');
      }
    });
  }

  // Arpeggio pattern — picks notes from current chord
  function playArpNote(chord, startTime) {
    const semi = pick(chord);
    const freq = semiToFreq(semi);
    // Occasionally play an octave up for sparkle
    const octaveUp = Math.random() < 0.3 ? 2 : 1;
    const vol = 0.04 + intensity * 0.04; // louder with intensity
    playNote(freq * octaveUp, startTime, 0.4 + Math.random() * 0.3, vol, 'sine');
  }

  // Melody — pentatonic wandering line, sparse
  function playMelodyNote(chord, startTime) {
    // Pick from scale, biased toward chord tones
    const useChordTone = Math.random() < 0.6;
    let semi;
    if (useChordTone) {
      semi = pick(chord);
    } else {
      semi = pick(SCALE);
    }
    // Melody sits an octave above root
    const freq = semiToFreq(semi + 12);
    const vol = 0.03 + intensity * 0.03;
    const dur = 0.6 + Math.random() * 0.8;
    playNote(freq, startTime, dur, vol, 'triangle');
  }

  // ---- Main loop ----
  function tick() {
    if (!running || !ctx) return;
    const t = ctx.currentTime;
    const prog = PROGRESSIONS[currentProg];
    const chord = prog[currentChord];

    // Every 16 beats (2 bars) = new chord
    if (beat % 16 === 0) {
      playPadChord(chord, t, TICK_MS * 16 / 1000);
    }

    // Arpeggio: play on beats 0, 2, 4, 6... (quarter notes) with some randomness
    if (beat % 2 === 0 && Math.random() < 0.7 + intensity * 0.25) {
      playArpNote(chord, t);
    }

    // Melody: sparse, ~1 note per bar on random beat
    if (beat % 8 === Math.floor(Math.random() * 8) && Math.random() < 0.4 + intensity * 0.3) {
      playMelodyNote(chord, t + Math.random() * 0.1);
    }

    // Higher intensity: extra arp notes on off-beats
    if (intensity > 0.4 && beat % 2 === 1 && Math.random() < intensity * 0.5) {
      playArpNote(chord, t);
    }

    // Advance
    beat++;
    if (beat % 16 === 0) {
      currentChord = (currentChord + 1) % prog.length;
      // Every full cycle, maybe switch progression
      if (currentChord === 0 && Math.random() < 0.3) {
        currentProg = Math.floor(Math.random() * PROGRESSIONS.length);
      }
    }

    loopTimer = setTimeout(tick, TICK_MS);
  }

  // ---- Public ----
  function start() {
    if (running) return;
    ctx = SFX.ensureContext();
    if (!ctx) return;
    running = true;
    console.log('[AMBIENCE] Starting generative music');

    // Master output
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);

    // Compressor to glue it together
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.3;
    compressor.connect(masterGain);

    // Reverb
    convolver = ctx.createConvolver();
    convolver.buffer = createReverbIR(ctx, 3.0, 2.5);
    reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.4;
    convolver.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Reset state
    beat = 0;
    currentChord = 0;
    currentProg = Math.floor(Math.random() * PROGRESSIONS.length);

    // Connect shader visualizer to music output
    if (typeof ShaderBG !== 'undefined') {
      ShaderBG.connectAudio(ctx, masterGain);
    }

    // Start the sequencer
    tick();
  }

  function stop() {
    running = false;
    if (loopTimer) clearTimeout(loopTimer);
    loopTimer = null;
    masterGain = null;
    compressor = null;
    convolver = null;
    reverbGain = null;
    ctx = null;
  }

  function setIntensity(value) {
    intensity = Math.max(0, Math.min(1, value));
    // Volume stays constant — intensity affects note density and brightness
    if (typeof ShaderBG !== 'undefined') ShaderBG.setIntensity(intensity);
  }

  function onStreak(streakCount) {
    setIntensity(Math.min(streakCount / 10, 1));
  }

  function onStreakBreak() {
    setIntensity(0);
  }

  let volume = 0.8;

  function setMuted(m) {
    muted = m;
    if (masterGain) {
      masterGain.gain.value = m ? 0 : volume;
    }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    muted = volume === 0;
    if (masterGain) masterGain.gain.value = volume;
  }

  function getVolume() { return volume; }

  return { start, stop, setIntensity, onStreak, onStreakBreak, setMuted, setVolume, getVolume };
})();
