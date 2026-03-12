// Universe Timeline — Particle Visualization
// Canvas-based particle simulation that reacts to dial settings.

const Particles = (function() {
  'use strict';

  let canvas, ctx;
  let particles = [];
  let running = false;
  let animFrame = null;
  let config = {
    temperature: 1e12,
    density: 1e30,
    energy: 1e6,
    particleTypes: ['quark'], // what particles to show
    backgroundColor: '#0a0e1a'
  };

  // Particle colors by type
  const COLORS = {
    quark: ['#ff4444', '#44ff44', '#4444ff'], // RGB for color charge
    proton: '#ff8844',
    neutron: '#8888ff',
    electron: '#ffff44',
    positron: '#ff44ff',
    photon: '#ffffff',
    neutrino: '#666688',
    hydrogen: '#44ddff',
    helium: '#ffcc44',
    deuterium: '#44ffcc',
    lithium: '#ff88cc',
    carbon: '#888888',
    nitrogen: '#4488ff',
    oxygen: '#44ff88',
    iron: '#cc8844',
    neutron_star: '#aaaaff',
    generic: '#aaaacc'
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function setConfig(newConfig) {
    Object.assign(config, newConfig);
    regenerateParticles();
  }

  function regenerateParticles() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    // Number of particles scales with density (log scale, capped)
    const densityFactor = Math.log10(Math.max(config.density, 1)) / 40;
    const count = Math.floor(20 + densityFactor * 150);

    // Speed scales with temperature (log scale)
    const tempFactor = Math.log10(Math.max(config.temperature, 1)) / 15;
    const baseSpeed = 0.5 + tempFactor * 8;

    particles = [];
    for (let i = 0; i < count; i++) {
      const type = config.particleTypes[Math.floor(Math.random() * config.particleTypes.length)];
      const colorSet = COLORS[type] || COLORS.generic;
      const color = Array.isArray(colorSet) ? colorSet[Math.floor(Math.random() * colorSet.length)] : colorSet;

      // Size varies by type
      let size = 2 + Math.random() * 3;
      if (type === 'proton' || type === 'neutron') size = 4 + Math.random() * 2;
      if (type === 'hydrogen' || type === 'helium') size = 5 + Math.random() * 3;
      if (type === 'photon') size = 1 + Math.random() * 1.5;

      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() - 0.5) * baseSpeed,
        size,
        color,
        type,
        phase: Math.random() * Math.PI * 2,
        trail: []
      });
    }
  }

  function start() {
    if (running) return;
    running = true;
    regenerateParticles();
    tick();
  }

  function stop() {
    running = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
  }

  function tick() {
    if (!running) return;
    update();
    draw();
    animFrame = requestAnimationFrame(tick);
  }

  function update() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const tempFactor = Math.log10(Math.max(config.temperature, 1)) / 15;

    for (const p of particles) {
      // Random brownian motion scaled by temperature
      p.vx += (Math.random() - 0.5) * tempFactor * 0.3;
      p.vy += (Math.random() - 0.5) * tempFactor * 0.3;

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }

      // Trail for photons
      p.phase += 0.05;
      if (p.type === 'photon') {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();
      }
    }
  }

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    // Clear with fade effect for trails
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = p.color + '40';
        ctx.lineWidth = 1;
        for (let i = 0; i < p.trail.length; i++) {
          if (i === 0) ctx.moveTo(p.trail[i].x, p.trail[i].y);
          else ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.stroke();
      }

      // Draw particle
      const glow = 1 + 0.3 * Math.sin(p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * glow * 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '20';
      ctx.fill();
    }
  }

  // Flash effect when a discovery happens
  function flash(color) {
    if (!ctx || !canvas) return;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.fillStyle = (color || '#ffffff') + '40';
    ctx.fillRect(0, 0, w, h);
  }

  // Cascade effect — burst of new particles
  function burst(type, count) {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const cx = w / 2, cy = h / 2;
    const colorSet = COLORS[type] || COLORS.generic;

    for (let i = 0; i < (count || 15); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      const color = Array.isArray(colorSet) ? colorSet[Math.floor(Math.random() * colorSet.length)] : colorSet;
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        type,
        phase: Math.random() * Math.PI * 2,
        trail: []
      });
    }
    // Trim if too many
    if (particles.length > 300) particles.splice(0, particles.length - 300);
  }

  return { init, start, stop, setConfig, flash, burst, resize };
})();
