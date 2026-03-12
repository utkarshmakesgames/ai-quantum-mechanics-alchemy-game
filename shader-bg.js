// ============================================================
// Quantum Forge — Reactive WebGL Background Shader
// Subtle quantum-themed visuals that react to music.
// ============================================================

const ShaderBG = (function() {
  'use strict';

  let canvas, gl, program;
  let startTime = Date.now();
  let animId = null;
  let analyser = null;
  let freqData = null;

  // Uniforms
  let uTime, uResolution, uBass, uMid, uHigh, uIntensity;
  let intensity = 0;

  // ---- Shaders ----
  const VERT = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Fragment shader: layered noise, wave interference, subtle particle field
  const FRAG = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_bass;
    uniform float u_mid;
    uniform float u_high;
    uniform float u_intensity;

    // ---- Noise functions ----
    // Simple hash
    float hash(vec2 p) {
      float h = dot(p, vec2(127.1, 311.7));
      return fract(sin(h) * 43758.5453123);
    }

    // Value noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f); // smoothstep
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal Brownian Motion — layered noise
    float fbm(vec2 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        val += amp * noise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
        p += vec2(1.7, 9.2); // domain shift
      }
      return val;
    }

    // ---- Wave interference (quantum-inspired) ----
    float waveField(vec2 uv, float t) {
      float w = 0.0;
      // Multiple wave sources
      vec2 c1 = vec2(-0.3, 0.2) + 0.1 * vec2(sin(t * 0.3), cos(t * 0.2));
      vec2 c2 = vec2(0.4, -0.3) + 0.1 * vec2(cos(t * 0.25), sin(t * 0.35));
      vec2 c3 = vec2(0.0, 0.5) + 0.15 * vec2(sin(t * 0.15), cos(t * 0.4));

      float d1 = length(uv - c1);
      float d2 = length(uv - c2);
      float d3 = length(uv - c3);

      // Circular waves with bass reactivity
      float waveScale = 12.0 + u_bass * 8.0;
      w += sin(d1 * waveScale - t * 1.5) / (1.0 + d1 * 4.0);
      w += sin(d2 * waveScale - t * 1.2) / (1.0 + d2 * 4.0);
      w += sin(d3 * waveScale - t * 1.8) / (1.0 + d3 * 5.0);

      return w * 0.33;
    }

    // ---- Flowing nebula ----
    float nebula(vec2 uv, float t) {
      vec2 p = uv * 2.0;
      // Slow domain warping
      float warp = fbm(p + vec2(t * 0.05, t * 0.03));
      float warp2 = fbm(p + vec2(warp * 0.8, t * 0.04));
      return fbm(p + vec2(warp2 * 0.6 + u_mid * 0.3, warp * 0.5));
    }

    // ---- Grid / circuit pattern ----
    float grid(vec2 uv, float t) {
      vec2 g = fract(uv * 8.0) - 0.5;
      float d = min(abs(g.x), abs(g.y));
      float line = smoothstep(0.02, 0.0, d - 0.48);
      // Pulse nodes at intersections
      vec2 id = floor(uv * 8.0);
      float pulse = sin(hash(id) * 6.28 + t * 2.0 + u_high * 3.0) * 0.5 + 0.5;
      float node = smoothstep(0.15, 0.0, length(g)) * pulse;
      return line * 0.15 + node * 0.4;
    }

    // ---- Particle sparkles ----
    float particles(vec2 uv, float t) {
      float sparkle = 0.0;
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 pos = vec2(
          hash(vec2(fi, 0.0)) * 2.0 - 1.0,
          hash(vec2(0.0, fi)) * 2.0 - 1.0
        );
        // Slow drift
        pos += 0.3 * vec2(
          sin(t * 0.2 + fi * 1.7),
          cos(t * 0.15 + fi * 2.3)
        );
        float d = length(uv - pos);
        // Pulsing brightness tied to high frequencies
        float brightness = 0.3 + u_high * 0.7;
        sparkle += brightness * smoothstep(0.05, 0.0, d - 0.005);
        // Soft glow
        sparkle += brightness * 0.15 / (1.0 + d * d * 80.0);
      }
      return sparkle;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
      float t = u_time;
      float aspect = u_resolution.x / u_resolution.y;

      // Base dark background matching game theme
      vec3 col = vec3(0.04, 0.055, 0.15); // --bg-primary approx

      // ---- Layer 1: Deep nebula (always present) ----
      float neb = nebula(uv, t);
      vec3 nebCol = mix(
        vec3(0.03, 0.02, 0.08),   // deep purple
        vec3(0.08, 0.04, 0.20),   // brighter purple
        neb
      );
      // Cyan highlight in bright regions
      nebCol += vec3(0.0, 0.06, 0.10) * smoothstep(0.4, 0.8, neb);
      col += nebCol;

      // ---- Layer 2: Wave interference (reacts to bass) ----
      float wave = waveField(uv, t);
      vec3 waveCol = vec3(0.0);
      waveCol += vec3(0.0, 0.4, 0.55) * max(wave, 0.0);    // cyan peaks
      waveCol += vec3(0.35, 0.0, 0.5) * max(-wave, 0.0);   // purple troughs
      float waveMix = 0.2 + u_bass * 0.4;
      col += waveCol * waveMix;

      // ---- Layer 3: Circuit grid (reacts to high freq) ----
      float g = grid(uv, t);
      vec3 gridCol = vec3(0.0, 0.5, 0.7) * g;
      float gridMix = 0.15 + u_high * 0.35;
      col += gridCol * gridMix;

      // ---- Layer 4: Particle sparkles ----
      float p = particles(uv, t);
      vec3 partCol = mix(
        vec3(0.0, 0.9, 1.0),     // cyan
        vec3(0.8, 0.0, 1.0),     // purple
        sin(t * 0.3) * 0.5 + 0.5
      ) * p;
      col += partCol * 0.5;

      // Vignette — darken edges gently
      float vig = 1.0 - smoothstep(0.5, 1.4, length(uv));
      col *= vig;

      // Intensity boost during streaks
      col *= 0.8 + u_intensity * 0.4;

      // Soft clamp — keep it subdued but visible
      col = min(col, vec3(0.45));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function initGL() {
    canvas = document.getElementById('bg-shader');
    if (!canvas) return false;

    gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) {
      console.warn('[ShaderBG] WebGL not available');
      return false;
    }

    // Compile shaders
    const vs = compileShader(gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[ShaderBG] Link error:', gl.getProgramInfoLog(program));
      return false;
    }
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    uTime = gl.getUniformLocation(program, 'u_time');
    uResolution = gl.getUniformLocation(program, 'u_resolution');
    uBass = gl.getUniformLocation(program, 'u_bass');
    uMid = gl.getUniformLocation(program, 'u_mid');
    uHigh = gl.getUniformLocation(program, 'u_high');
    uIntensity = gl.getUniformLocation(program, 'u_intensity');

    return true;
  }

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[ShaderBG] Shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function resize() {
    if (!canvas) return;
    // Render at half resolution for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = 0.5;
    canvas.width = Math.floor(window.innerWidth * dpr * scale);
    canvas.height = Math.floor(window.innerHeight * dpr * scale);
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function getAudioData() {
    let bass = 0, mid = 0, high = 0;
    if (analyser && freqData) {
      analyser.getByteFrequencyData(freqData);
      const len = freqData.length;
      const bassEnd = Math.floor(len * 0.1);   // ~0-200Hz
      const midEnd = Math.floor(len * 0.4);    // ~200-2kHz
      // Average each band
      let bSum = 0, mSum = 0, hSum = 0;
      for (let i = 0; i < bassEnd; i++) bSum += freqData[i];
      for (let i = bassEnd; i < midEnd; i++) mSum += freqData[i];
      for (let i = midEnd; i < len; i++) hSum += freqData[i];
      bass = bSum / (bassEnd * 255);
      mid = mSum / ((midEnd - bassEnd) * 255);
      high = hSum / ((len - midEnd) * 255);
    }
    return { bass, mid, high };
  }

  function render() {
    if (!gl) return;
    animId = requestAnimationFrame(render);

    const t = (Date.now() - startTime) / 1000;
    const audio = getAudioData();

    gl.uniform1f(uTime, t);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uBass, audio.bass);
    gl.uniform1f(uMid, audio.mid);
    gl.uniform1f(uHigh, audio.high);
    gl.uniform1f(uIntensity, intensity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // ---- Public ----
  function start() {
    if (!initGL()) return;
    resize();
    window.addEventListener('resize', resize);
    startTime = Date.now();
    render();
    console.log('[ShaderBG] Started');
  }

  // Connect to an AudioContext to get frequency data
  function connectAudio(audioCtx, sourceNode) {
    if (!audioCtx) return;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    freqData = new Uint8Array(analyser.frequencyBinCount);
    // Connect source → analyser (analyser doesn't affect output)
    if (sourceNode) {
      sourceNode.connect(analyser);
    }
  }

  function setIntensity(v) {
    intensity = Math.max(0, Math.min(1, v));
  }

  function stop() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    window.removeEventListener('resize', resize);
  }

  return { start, stop, connectAudio, setIntensity };
})();

// Auto-start the shader background
document.addEventListener('DOMContentLoaded', () => {
  ShaderBG.start();
});
