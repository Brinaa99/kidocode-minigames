/**
 * Space Mission Control - Space Observation & Starfield Engine
 * Renders retro pixel-art space environments, animated starfields,
 * planets, asteroids, spacecraft, solar flares, and satellites on HTML5 Canvas.
 */

class SpaceVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.nebulae = [];
    this.dustParticles = [];
    this.asteroids = [];
    this.time = 0;
    this.currentMode = 'menu'; // 'menu', 'level_1', ... 'level_10'
    this.specialObjects = [];
    this.ship = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, angle: 0, thrusting: false };
    this.running = false;
    this.animationId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initStars();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 800) * dpr;
    this.canvas.height = (rect.height || 450) * dpr;
    this.ctx.imageSmoothingEnabled = false; // Preserve crisp pixel-art style
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 800;
    this.height = rect.height || 450;
  }

  initStars() {
    this.stars = [];
    const count = 140;
    const w = this.width || 800;
    const h = this.height || 450;

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() < 0.7 ? 1 : (Math.random() < 0.85 ? 2 : 3),
        speed: 0.15 + Math.random() * 0.45,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() < 0.15 ? '#80d4ff' : (Math.random() < 0.1 ? '#ffcc80' : '#ffffff')
      });
    }

    // Nebulae blobs
    this.nebulae = [
      { x: w * 0.25, y: h * 0.3, radius: 180, color: 'rgba(92, 45, 145, 0.12)' },
      { x: w * 0.75, y: h * 0.7, radius: 220, color: 'rgba(24, 76, 120, 0.14)' },
      { x: w * 0.5, y: h * 0.85, radius: 160, color: 'rgba(128, 30, 90, 0.09)' }
    ];

    // Initialize Ship
    this.ship.x = w * 0.2;
    this.ship.y = h * 0.5;
    this.ship.targetX = w * 0.5;
    this.ship.targetY = h * 0.5;
  }

  setMode(mode, levelData = null) {
    this.currentMode = mode;
    this.time = 0;
    this.asteroids = [];
    this.specialObjects = [];

    const w = this.width || 800;
    const h = this.height || 450;

    if (mode === 'level_3') {
      // Asteroid field
      for (let i = 0; i < 18; i++) {
        this.asteroids.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 8 + Math.random() * 16,
          vx: -(0.4 + Math.random() * 0.8),
          vy: (Math.random() - 0.5) * 0.3,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.03,
          points: this.generateAsteroidPoints(8 + Math.random() * 16)
        });
      }
    }
  }

  generateAsteroidPoints(radius) {
    const pts = [];
    const count = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.75 + Math.random() * 0.5);
      pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return pts;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  update() {
    this.time += 0.02;
    const w = this.width || 800;
    const h = this.height || 450;

    // Update stars
    for (let s of this.stars) {
      s.x -= s.speed;
      if (s.x < 0) s.x = w;
      s.twinklePhase += s.twinkleSpeed;
    }

    // Update asteroids if in level 3
    if (this.currentMode === 'level_3') {
      for (let a of this.asteroids) {
        a.x += a.vx;
        a.y += a.vy;
        a.rot += a.vrot;
        if (a.x < -40) a.x = w + 40;
        if (a.y < -40) a.y = h + 40;
        if (a.y > h + 40) a.y = -40;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width || 800;
    const h = this.height || 450;

    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#040714');
    grad.addColorStop(0.5, '#070b22');
    grad.addColorStop(1, '#0a0d2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw Nebulae
    for (let n of this.nebulae) {
      const radGrad = ctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, n.radius);
      radGrad.addColorStop(0, n.color);
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Stars
    for (let s of this.stars) {
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinklePhase));
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      if (s.size === 3) {
        // Pixel cross
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
        ctx.fillRect(Math.floor(s.x - 1), Math.floor(s.y), 4, 1);
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y - 1), 1, 4);
      } else {
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }
    }
    ctx.globalAlpha = 1.0;

    // Render mode-specific space entities
    this.drawModeSpecificEntities(ctx, w, h);

    // Subtle scanlines overlay
    this.drawScanlines(ctx, w, h);
  }

  drawModeSpecificEntities(ctx, w, h) {
    const t = this.time;

    switch (this.currentMode) {
      case 'menu':
        // Big retro Earth with moon and floating shuttle
        this.drawPixelPlanet(ctx, w * 0.78, h * 0.55, 75, '#2266aa', '#33aa55', '#ffffff');
        this.drawPixelMoon(ctx, w * 0.62 + Math.cos(t * 0.4) * 110, h * 0.55 + Math.sin(t * 0.4) * 35, 16);
        this.drawPixelShuttle(ctx, w * 0.28 + Math.cos(t * 0.3) * 30, h * 0.45 + Math.sin(t * 0.5) * 20, 1.2, true);
        break;

      case 'level_1':
        // Earth orbit & Command Station Alpha
        this.drawPixelPlanet(ctx, w * 0.85, h * 0.7, 95, '#1e488f', '#2a8b5e', '#a3d9ff');
        this.drawSpaceStation(ctx, w * 0.35, h * 0.42, 1.4);
        break;

      case 'level_2':
        // Satellite Echo-7 with emitting microwave comms rings
        this.drawPixelPlanet(ctx, w * 0.15, h * 0.85, 70, '#5a3d7a', '#7b529d', '#b18cd9');
        this.drawSatellite(ctx, w * 0.5, h * 0.45, 1.5, true);
        break;

      case 'level_3':
        // Approaching asteroid belt with cargo transport
        this.drawAsteroids(ctx);
        this.drawCargoShip(ctx, w * 0.22, h * 0.5, 1.2);
        break;

      case 'level_4':
        // Solar Storm: Massive raging sun with coronal flares and radiation waves
        this.drawSolarFlareSun(ctx, w * 0.88, h * 0.5, 110);
        this.drawShieldedStation(ctx, w * 0.28, h * 0.5);
        break;

      case 'level_5':
        // Probability Radar: Navigation buoy and quantum beacon sectors
        this.drawNavigationBuoy(ctx, w * 0.5, h * 0.5);
        break;

      case 'level_6':
        // Moon surface craters & Apollo/Artemis lunar lander
        this.drawLunarSurface(ctx, w, h);
        this.drawLunarLander(ctx, w * 0.5, h * 0.35 + Math.sin(t * 0.8) * 6);
        break;

      case 'level_7':
        // Alien Signal Mystery: Exoplanet Kepler-186f with pulsed harmonic waveforms
        this.drawExoplanet(ctx, w * 0.65, h * 0.45);
        this.drawListeningDish(ctx, w * 0.2, h * 0.65);
        break;

      case 'level_8':
        // Emergency Protocol: Space Station Alpha with red alarm flashes
        this.drawEmergencyStation(ctx, w * 0.5, h * 0.48);
        break;

      case 'level_9':
        // Deep Space Exploration: Ringed gas giant and interstellar probe
        this.drawRingedPlanet(ctx, w * 0.72, h * 0.48, 65);
        this.drawVoyagerProbe(ctx, w * 0.3, h * 0.52);
        break;

      case 'level_10':
        // Grand Commander Challenge: Earth re-entry corridor, plasma entry trail
        this.drawReentryFlagship(ctx, w, h);
        break;

      default:
        this.drawPixelPlanet(ctx, w * 0.75, h * 0.5, 60, '#336699', '#44aa77');
        this.drawPixelShuttle(ctx, w * 0.3, h * 0.5, 1.0, true);
    }
  }

  drawScanlines(ctx, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  // --- Pixel Art Drawing Primitives ---

  drawPixelPlanet(ctx, cx, cy, radius, baseColor, continentColor, cloudColor) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Base surface
    ctx.fillStyle = baseColor;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // Continents / landmass patches
    ctx.fillStyle = continentColor || '#2e7d32';
    const shift = (this.time * 6) % (radius * 2);
    for (let i = -1; i <= 2; i++) {
      const ox = cx - radius + shift + i * radius * 1.5;
      ctx.fillRect(ox - 20, cy - radius * 0.4, 45, 30);
      ctx.fillRect(ox - 35, cy - radius * 0.2, 70, 40);
      ctx.fillRect(ox - 10, cy + radius * 0.2, 55, 35);
      ctx.fillRect(ox + 15, cy - radius * 0.6, 30, 25);
    }

    // Clouds
    if (cloudColor) {
      ctx.fillStyle = cloudColor;
      ctx.globalAlpha = 0.5;
      const cshift = (this.time * 9) % (radius * 2);
      for (let i = -1; i <= 2; i++) {
        const ox = cx - radius + cshift + i * radius * 1.5;
        ctx.fillRect(ox - 40, cy - radius * 0.5, 60, 10);
        ctx.fillRect(ox - 10, cy + radius * 0.1, 75, 12);
        ctx.fillRect(ox + 20, cy + radius * 0.4, 40, 8);
      }
      ctx.globalAlpha = 1.0;
    }

    // Planet shadow / atmospheric curve
    const shadowGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.3, cx, cy, radius);
    shadowGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
    shadowGrad.addColorStop(0.7, 'transparent');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    // Atmospheric outer glow
    ctx.strokeStyle = 'rgba(70, 180, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawPixelMoon(ctx, cx, cy, r) {
    ctx.fillStyle = '#b0b8c4';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Craters
    ctx.fillStyle = '#838d9d';
    ctx.fillRect(cx - r * 0.4, cy - r * 0.3, r * 0.4, r * 0.4);
    ctx.fillRect(cx + r * 0.2, cy + r * 0.2, r * 0.35, r * 0.35);
    ctx.fillRect(cx - r * 0.2, cy + r * 0.4, r * 0.25, r * 0.25);
  }

  drawPixelShuttle(ctx, x, y, scale = 1, thrust = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Rocket Body
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-18, -6, 36, 12);
    // Nosecone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(18, -6);
    ctx.lineTo(30, 0);
    ctx.lineTo(18, 6);
    ctx.closePath();
    ctx.fill();
    // Cockpit glass
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(4, -4, 10, 8);
    // Wings
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-12, -14, 12, 8);
    ctx.fillRect(-12, 6, 12, 8);
    // Wing accents
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-6, -14, 6, 3);
    ctx.fillRect(-6, 11, 6, 3);

    // Thruster engine flame
    if (thrust) {
      const flicker = 10 + Math.random() * 8;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-18, -4);
      ctx.lineTo(-18 - flicker, 0);
      ctx.lineTo(-18, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(-18, -2);
      ctx.lineTo(-18 - flicker * 0.6, 0);
      ctx.lineTo(-18, 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  drawSpaceStation(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Central hub
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-12, -12, 24, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -6, 12, 12);

    // Truss arms
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-45, -3, 90, 6);
    ctx.fillRect(-3, -45, 6, 90);

    // Solar panels
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    // Left solar panels
    ctx.fillRect(-65, -18, 20, 36);
    ctx.strokeRect(-65, -18, 20, 36);
    // Right solar panels
    ctx.fillRect(45, -18, 20, 36);
    ctx.strokeRect(45, -18, 20, 36);

    // Grid lines on solar panels
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(-55, -18); ctx.lineTo(-55, 18);
    ctx.moveTo(55, -18); ctx.lineTo(55, 18);
    ctx.stroke();

    // Blinking station beacons
    const blink = Math.sin(this.time * 4) > 0;
    if (blink) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-65, -20, 3, 3);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(62, -20, 3, 3);
    }

    ctx.restore();
  }

  drawSatellite(ctx, x, y, scale = 1, waves = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Satellite body
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-8, -8, 16, 16);

    // Solar wings
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-40, -6, 26, 12);
    ctx.fillRect(14, -6, 26, 12);

    // Dish antenna
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, -14, 12, Math.PI, 0, true);
    ctx.fill();
    ctx.fillRect(-1, -22, 2, 8);

    // Radio waves
    if (waves) {
      const wavePhase = (this.time * 2) % 1;
      for (let i = 1; i <= 3; i++) {
        const r = (i * 12 + wavePhase * 16);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - r / 60)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -22, r, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawAsteroids(ctx) {
    ctx.fillStyle = '#78716c';
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1.5;

    for (let a of this.asteroids) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);

      ctx.beginPath();
      for (let i = 0; i < a.points.length; i++) {
        const pt = a.points[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crater
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.arc(a.radius * 0.2, a.radius * 0.2, a.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  drawCargoShip(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Main hull
    ctx.fillStyle = '#475569';
    ctx.fillRect(-25, -12, 50, 24);
    // Cargo containers
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-18, -10, 14, 20);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, -10, 14, 20);
    // Bridge
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(16, -6, 10, 12);

    // Shield glow
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-28, -15, 56, 30);

    ctx.restore();
  }

  drawSolarFlareSun(ctx, cx, cy, radius) {
    const t = this.time;

    // Outer plasma corona
    const flareGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.8);
    flareGrad.addColorStop(0, 'rgba(255, 100, 20, 0.8)');
    flareGrad.addColorStop(0.5, 'rgba(255, 60, 0, 0.3)');
    flareGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Sun core
    const sunGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 10, cx, cy, radius);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.4, '#f59e0b');
    sunGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Coronal mass ejection loops
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const angle = (t * 0.5 + i * 1.5) % (Math.PI * 2);
      const fx = cx + Math.cos(angle) * radius;
      const fy = cy + Math.sin(angle) * radius;
      const lx = cx + Math.cos(angle) * (radius + 35 + Math.sin(t * 3 + i) * 15);
      const ly = cy + Math.sin(angle) * (radius + 35 + Math.sin(t * 3 + i) * 15);

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.quadraticCurveTo(lx, ly, cx + Math.cos(angle + 0.3) * radius, cy + Math.sin(angle + 0.3) * radius);
      ctx.stroke();
    }
  }

  drawShieldedStation(ctx, x, y) {
    this.drawSpaceStation(ctx, x, y, 1.2);
    // Deflector shield bubble
    const t = this.time;
    ctx.save();
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + 0.3 * Math.sin(t * 5)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.stroke();

    // Hex pattern hint
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fill();
    ctx.restore();
  }

  drawNavigationBuoy(ctx, x, y) {
    const t = this.time;
    ctx.save();
    ctx.translate(x, y);

    // Center Buoy
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-15, -25, 30, 50);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-10, -18, 20, 36);

    // Flashing Quantum Core
    ctx.fillStyle = Math.sin(t * 6) > 0 ? '#38bdf8' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Concentric beacon pulses
    for (let r = 30; r <= 120; r += 30) {
      const pulse = (r + t * 40) % 120;
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - pulse / 120)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawLunarSurface(ctx, w, h) {
    // Moon horizon curve at bottom
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h + 100, w * 0.8, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Surface craters
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h - 30, 45, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.7, h - 50, 70, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h - 15, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLunarLander(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Gold foil ascent stage
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-16, -16, 32, 20);

    // Crew cabin top
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-12, -26, 24, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -22, 12, 6);

    // Landing legs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Left leg
    ctx.moveTo(-14, 4); ctx.lineTo(-28, 22);
    // Right leg
    ctx.moveTo(14, 4); ctx.lineTo(28, 22);
    ctx.stroke();

    // Footpads
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-32, 22, 10, 3);
    ctx.fillRect(22, 22, 10, 3);

    // Thruster smoke plume
    const t = this.time;
    if (Math.sin(t * 8) > -0.3) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.beginPath();
      ctx.moveTo(-6, 4);
      ctx.lineTo(0, 18 + Math.random() * 8);
      ctx.lineTo(6, 4);
      ctx.fill();
    }

    ctx.restore();
  }

  drawExoplanet(ctx, cx, cy) {
    this.drawPixelPlanet(ctx, cx, cy, 65, '#3b0764', '#701a75', '#e879f9');

    // Pulsed harmonic signal rings
    const t = this.time;
    for (let i = 0; i < 3; i++) {
      const radius = 75 + ((t * 30 + i * 40) % 120);
      const alpha = Math.max(0, 1 - radius / 195);
      ctx.strokeStyle = `rgba(232, 121, 249, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawListeningDish(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Base tower
    ctx.fillStyle = '#475569';
    ctx.fillRect(-6, 0, 12, 35);
    // Large dish angled right
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, -10, 32, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.lineTo(0, -10);
    ctx.fill();
    // Receiver horn
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(28, -10);
    ctx.stroke();
    ctx.restore();
  }

  drawEmergencyStation(ctx, x, y) {
    this.drawSpaceStation(ctx, x, y, 1.4);
    // Flashing red emergency alarm strobe
    const t = this.time;
    if (Math.sin(t * 8) > 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 4, y - 4, 8, 8);
    }
  }

  drawRingedPlanet(ctx, cx, cy, radius) {
    ctx.save();
    // Ring behind planet
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 2.2, radius * 0.5, -0.25, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Planet body
    this.drawPixelPlanet(ctx, cx, cy, radius, '#b45309', '#d97706');

    // Ring in front of planet
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 2.2, radius * 0.5, -0.25, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  drawVoyagerProbe(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // High gain dish
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fill();
    // Instrument booms
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(-40, -15);
    ctx.moveTo(-10, 0); ctx.lineTo(-35, 20);
    ctx.stroke();
    // Thruster glow
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-22, -2, 6, 4);
    ctx.restore();
  }

  drawReentryFlagship(ctx, w, h) {
    const t = this.time;
    // Approaching Earth
    this.drawPixelPlanet(ctx, w * 0.82, h * 0.5, 95, '#1e3a8a', '#15803d', '#ffffff');

    // Flagship entering plasma envelope
    const fx = w * 0.38 + Math.cos(t * 0.4) * 15;
    const fy = h * 0.48 + Math.sin(t * 0.3) * 10;

    // Atmospheric ionization heat shield glow
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.arc(fx + 25, fy, 40, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fill();

    this.drawPixelShuttle(ctx, fx, fy, 1.6, true);
  }
}

// Attach to window
window.SpaceVisualizer = SpaceVisualizer;
