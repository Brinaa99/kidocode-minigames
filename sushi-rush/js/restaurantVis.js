/**
 * Sushi Rush - Restaurant Visualizer Engine
 * Renders the 16-bit retro pixel-art Japanese restaurant environment,
 * animated customers, lanterns, steam, and conveyor belt on HTML5 Canvas.
 */

class RestaurantVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.running = false;
    this.animId = null;

    // Steam particles from rice cooker
    this.steamParticles = [];
    // Conveyor belt offset
    this.conveyorOffset = 0;
    // Current customer state
    this.customer = {
      type: 0, // 0: school kid, 1: office worker, 2: grandma, 3: gourmet
      state: 'sitting', // 'arriving', 'sitting', 'eating', 'happy'
      x: 0,
      y: 0,
      targetX: 0,
      scale: 1.5,
      eatTimer: 0,
      blinkTimer: 0,
      isBlinking: false
    };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initSteam();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 800) * dpr;
    this.canvas.height = (rect.height || 360) * dpr;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 800;
    this.height = rect.height || 360;

    // Update customer position
    this.customer.x = this.width * 0.45;
    this.customer.y = this.height * 0.52;
  }

  initSteam() {
    this.steamParticles = [];
    for (let i = 0; i < 12; i++) {
      this.steamParticles.push({
        x: 0,
        y: 0,
        vy: 0.6 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        size: 3 + Math.random() * 4,
        alpha: Math.random()
      });
    }
  }

  setCustomer(typeIndex, state = 'sitting') {
    this.customer.type = typeIndex % 4;
    this.customer.state = state;
    this.customer.eatTimer = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  update() {
    this.time += 0.03;
    this.conveyorOffset = (this.conveyorOffset + 0.8) % 32;

    // Steam update
    const riceX = this.width * 0.12;
    const riceY = this.height * 0.48;
    for (let p of this.steamParticles) {
      p.y -= p.vy;
      p.x += p.vx;
      p.alpha -= 0.012;
      if (p.alpha <= 0) {
        p.x = riceX + (Math.random() - 0.5) * 16;
        p.y = riceY;
        p.alpha = 0.6 + Math.random() * 0.3;
        p.size = 3 + Math.random() * 4;
      }
    }

    // Blinking
    this.customer.blinkTimer += 0.02;
    if (this.customer.blinkTimer > 3) {
      this.customer.isBlinking = true;
      if (this.customer.blinkTimer > 3.15) {
        this.customer.isBlinking = false;
        this.customer.blinkTimer = 0;
      }
    }

    if (this.customer.state === 'eating') {
      this.customer.eatTimer += 0.04;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width || 800;
    const h = this.height || 360;

    ctx.clearRect(0, 0, w, h);

    // 1. Restaurant Wall & Tatami Background
    this.drawBackground(ctx, w, h);

    // 2. Hanging Paper Lanterns (Warm glow)
    this.drawLanterns(ctx, w);

    // 3. Rice Cooker with animated Steam
    this.drawRiceCooker(ctx, w * 0.12, h * 0.55);

    // 4. Customer at Counter
    this.drawCustomer(ctx, w * 0.45, h * 0.52);

    // 5. Main Sushi Wooden Counter
    this.drawCounter(ctx, w, h);

    // 6. Animated Conveyor Belt (Kaitenzushi)
    this.drawConveyorBelt(ctx, w, h);
  }

  drawBackground(ctx, w, h) {
    // Warm wooden wall
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(0, 0, w, h);

    // Shoji Screen panels (cream paper with wooden lattice)
    const shojiY = 20;
    const shojiH = h * 0.45;
    const panelW = 70;

    for (let x = 10; x < w - 20; x += panelW + 8) {
      // Paper background
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x, shojiY, panelW, shojiH);

      // Wooden border
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, shojiY, panelW, shojiH);

      // Inner wooden grid
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Horizontal slats
      for (let y = shojiY + 18; y < shojiY + shojiH; y += 18) {
        ctx.moveTo(x, y); ctx.lineTo(x + panelW, y);
      }
      // Vertical slats
      ctx.moveTo(x + panelW / 2, shojiY);
      ctx.lineTo(x + panelW / 2, shojiY + shojiH);
      ctx.stroke();
    }

    // Japanese Noren Curtain (Deep Navy / Red with 寿司)
    this.drawNoren(ctx, w * 0.76, 0);
  }

  drawNoren(ctx, x, y) {
    const norenW = 120;
    const norenH = 75;

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x, y, norenW, norenH);

    // Split in curtain
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + norenW / 2 - 2, y, 4, norenH);

    // White text banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('すし', x + norenW * 0.28, y + 42);
    ctx.fillText('寿司', x + norenW * 0.72, y + 42);

    // Hanging rod
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 8, y, norenW + 16, 6);
  }

  drawLanterns(ctx, w) {
    const lanternPositions = [w * 0.08, w * 0.32, w * 0.65, w * 0.92];
    for (let lx of lanternPositions) {
      const sway = Math.sin(this.time * 2 + lx) * 2;
      const ly = 15;

      // Hanging cord
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx + sway, ly);
      ctx.stroke();

      // Red Lantern Body
      const bobX = lx + sway;
      const bobY = ly;

      // Outer warm glow
      const glow = ctx.createRadialGradient(bobX, bobY + 15, 6, bobX, bobY + 15, 35);
      glow.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bobX, bobY + 15, 35, 0, Math.PI * 2);
      ctx.fill();

      // Lantern shape
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(bobX - 12, bobY, 24, 30);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(bobX - 10, bobY - 4, 20, 4);
      ctx.fillRect(bobX - 10, bobY + 30, 20, 4);

      // Black stripes & Kanji
      ctx.fillStyle = '#000000';
      ctx.fillRect(bobX - 12, bobY + 8, 24, 2);
      ctx.fillRect(bobX - 12, bobY + 20, 24, 2);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('祭', bobX, bobY + 17);
    }
  }

  drawRiceCooker(ctx, x, y) {
    // Traditional wooden sushi hangiri / rice steamer
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x - 24, y - 18, 48, 36);

    // Copper hoops
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - 24, y - 12, 48, 4);
    ctx.fillRect(x - 24, y + 8, 48, 4);

    // Fluffy rice visible on top
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x, y - 18, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated Steam rising
    for (let p of this.steamParticles) {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCustomer(ctx, cx, cy) {
    const c = this.customer;
    const type = c.type;
    const isEating = c.state === 'eating';
    const isHappy = c.state === 'happy';

    ctx.save();
    ctx.translate(cx, cy);

    // Bounce slightly when happy
    if (isHappy) {
      ctx.translate(0, -Math.abs(Math.sin(this.time * 8)) * 8);
    }

    // 1. Torso / Shirt
    let shirtColor = '#3b82f6';
    if (type === 1) shirtColor = '#475569'; // Office worker suit
    if (type === 2) shirtColor = '#ec4899'; // Grandma kimono
    if (type === 3) shirtColor = '#10b981'; // Gourmet critic

    ctx.fillStyle = shirtColor;
    ctx.fillRect(-22, -10, 44, 40);

    // 2. Head / Skin
    ctx.fillStyle = '#fcd34d'; // Warm pixel skin
    ctx.fillRect(-18, -48, 36, 38);

    // 3. Hair
    if (type === 0) {
      // Kid spiky black hair + red headband
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-20, -56, 40, 16);
      ctx.fillRect(-22, -44, 6, 12);
      ctx.fillRect(16, -44, 6, 12);
      // Headband
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-20, -42, 40, 6);
    } else if (type === 1) {
      // Office worker neat brown hair + glasses
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-20, -54, 40, 14);
      // Glasses
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.strokeRect(-14, -32, 10, 8);
      ctx.strokeRect(4, -32, 10, 8);
      ctx.beginPath(); ctx.moveTo(-4, -28); ctx.lineTo(4, -28); ctx.stroke();
    } else if (type === 2) {
      // Grandma gray bun
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-20, -52, 40, 14);
      ctx.beginPath();
      ctx.arc(0, -58, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Gourmet Chef tall white hat
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -78, 32, 32);
      ctx.fillRect(-20, -50, 40, 8);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-14, -22, 28, 4); // Gourmet mustache!
    }

    // 4. Eyes & Expression
    if (c.isBlinking) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(-12, -30, 8, 2);
      ctx.fillRect(4, -30, 8, 2);
    } else if (isHappy || isEating) {
      // Happy curved closed eyes ^_^
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-8, -28, 4, Math.PI, 0);
      ctx.arc(8, -28, 4, Math.PI, 0);
      ctx.stroke();
    } else {
      // Normal open eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(-12, -32, 6, 6);
      ctx.fillRect(6, -32, 6, 6);
    }

    // Cheeks blushing
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fillRect(-16, -22, 6, 4);
    ctx.fillRect(10, -22, 6, 4);

    // Mouth
    ctx.fillStyle = '#000000';
    if (isEating) {
      const chew = Math.sin(this.time * 12) > 0;
      ctx.fillRect(-4, -18, 8, chew ? 6 : 2);
    } else if (isHappy) {
      ctx.beginPath();
      ctx.arc(0, -18, 5, 0, Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(-3, -16, 6, 2);
    }

    // Floating Heart if Happy
    if (isHappy) {
      ctx.fillStyle = '#ec4899';
      ctx.font = '18px sans-serif';
      ctx.fillText('❤️', 20, -55 + Math.sin(this.time * 6) * 4);
    }

    ctx.restore();
  }

  drawCounter(ctx, w, h) {
    const counterY = h * 0.65;
    const counterH = h * 0.35;

    // Polished hinoki cypress wood counter top
    const woodGrad = ctx.createLinearGradient(0, counterY, 0, counterY + 25);
    woodGrad.addColorStop(0, '#fef3c7');
    woodGrad.addColorStop(0.3, '#fde68a');
    woodGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(0, counterY, w, 24);

    // Front wood panel
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, counterY + 24, w, counterH - 24);

    // Vertical wooden slats
    ctx.fillStyle = '#451a03';
    for (let x = 0; x < w; x += 36) {
      ctx.fillRect(x, counterY + 24, 3, counterH - 24);
    }
  }

  drawConveyorBelt(ctx, w, h) {
    const beltY = h * 0.82;
    const beltH = 42;

    // Metallic belt frame
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, beltY, w, beltH);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, beltY + 3, w, beltH - 6);

    // Moving belt slats
    ctx.fillStyle = '#475569';
    for (let x = -32 + this.conveyorOffset; x < w + 32; x += 32) {
      ctx.fillRect(x, beltY + 4, 2, beltH - 8);
    }

    // Golden conveyor guide rails
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, beltY - 2, w, 4);
    ctx.fillRect(0, beltY + beltH - 2, w, 4);
  }
}

window.RestaurantVisualizer = RestaurantVisualizer;
