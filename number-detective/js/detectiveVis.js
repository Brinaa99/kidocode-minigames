/**
 * The Number Detective - Scene & Headquarters Visualizer
 * Renders the 16-bit retro pixel-art detective office, crime scenes,
 * interactive evidence hotspots, and detective characters on HTML5 Canvas.
 */

class DetectiveVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.running = false;
    this.animId = null;
    this.currentScene = 'hq'; // 'hq', 'office', 'alley', 'warehouse', etc.

    // Raindrops for window
    this.raindrops = [];
    // Interactive scene hotspots: [{ id, x, y, radius, label, inspected }]
    this.hotspots = [];
    this.onHotspotClick = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initRain();

    this.canvas.addEventListener('click', (e) => this.handleClick(e));
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
  }

  initRain() {
    this.raindrops = [];
    for (let i = 0; i < 35; i++) {
      this.raindrops.push({
        x: Math.random() * (this.width || 800),
        y: Math.random() * (this.height || 360),
        length: 8 + Math.random() * 12,
        speed: 4 + Math.random() * 4
      });
    }
  }

  setScene(sceneName, hotspotsList = []) {
    this.currentScene = sceneName;
    this.hotspots = hotspotsList.map(h => ({
      ...h,
      pulse: 0
    }));
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

    // Rain update
    const h = this.height || 360;
    const w = this.width || 800;
    for (let r of this.raindrops) {
      r.y += r.speed;
      r.x -= 0.8;
      if (r.y > h) {
        r.y = -15;
        r.x = Math.random() * w;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width || 800;
    const h = this.height || 360;

    ctx.clearRect(0, 0, w, h);

    // 1. Dark noir detective room / crime scene background
    this.drawBackgroundScene(ctx, w, h);

    // 2. Interactive evidence hotspots
    this.drawHotspots(ctx);

    // 3. Detective character
    this.drawDetective(ctx, w * 0.18, h * 0.65);

    // 4. Subtle retro scanlines
    this.drawScanlines(ctx, w, h);
  }

  drawBackgroundScene(ctx, w, h) {
    // Deep noir navy/charcoal gradient
    const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
    wallGrad.addColorStop(0, '#0a0e1a');
    wallGrad.addColorStop(0.6, '#141c2e');
    wallGrad.addColorStop(1, '#1b2438');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h);

    // Rainy window pane on left
    const winX = w * 0.45;
    const winY = 20;
    const winW = 160;
    const winH = 140;

    // Window frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(winX, winY, winW, winH);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(winX + 6, winY + 6, winW - 12, winH - 12);

    // Rainy city silhouettes outside window
    ctx.fillStyle = '#090d16';
    ctx.fillRect(winX + 15, winY + 50, 35, 75);
    ctx.fillRect(winX + 60, winY + 30, 40, 95);
    ctx.fillRect(winX + 110, winY + 65, 30, 60);

    // Falling raindrops across window
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    for (let r of this.raindrops) {
      if (r.x > winX && r.x < winX + winW && r.y > winY && r.y < winY + winH) {
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 2, r.y + r.length);
        ctx.stroke();
      }
    }

    // Window crossbars
    ctx.fillStyle = '#334155';
    ctx.fillRect(winX + winW / 2 - 3, winY, 6, winH);
    ctx.fillRect(winX, winY + winH / 2 - 3, winW, 6);

    // Cork Evidence Board on right wall
    const boardX = w * 0.7;
    const boardY = 25;
    const boardW = 200;
    const boardH = 150;

    // Wooden corkboard frame
    ctx.fillStyle = '#78350f';
    ctx.fillRect(boardX, boardY, boardW, boardH);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(boardX + 6, boardY + 6, boardW - 12, boardH - 12);

    // Photos & Red Strings on evidence board
    this.drawEvidenceBoardDetails(ctx, boardX + 6, boardY + 6, boardW - 12, boardH - 12);

    // Detective Desk & Green Blotter
    const deskY = h * 0.65;
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(0, deskY, w, h - deskY);

    // Green leather desk blotter
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(w * 0.35, deskY + 10, w * 0.55, 70);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.35, deskY + 10, w * 0.55, 70);

    // Vintage Desk Lamp with warm amber cone of light
    const lampX = w * 0.38;
    const lampY = deskY - 20;

    // Brass lamp base & green glass shade
    ctx.fillStyle = '#b45309';
    ctx.fillRect(lampX - 8, deskY - 4, 16, 6);
    ctx.fillRect(lampX - 2, lampY + 12, 4, deskY - lampY - 16);
    ctx.fillStyle = '#065f46'; // Banker's lamp emerald green shade
    ctx.fillRect(lampX - 16, lampY, 32, 14);

    // Warm radial light cone
    const lampLight = ctx.createRadialGradient(lampX, lampY + 10, 5, lampX, lampY + 60, 160);
    lampLight.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
    lampLight.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)');
    lampLight.addColorStop(1, 'transparent');
    ctx.fillStyle = lampLight;
    ctx.beginPath();
    ctx.arc(lampX, lampY + 60, 160, 0, Math.PI * 2);
    ctx.fill();

    // Coffee Mug with steaming heat
    const mugX = w * 0.85;
    const mugY = deskY + 25;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(mugX, mugY, 14, 18);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(mugX + 2, mugY + 2, 10, 4); // Dark coffee
    // Handle
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.strokeRect(mugX + 14, mugY + 4, 5, 10);
  }

  drawEvidenceBoardDetails(ctx, bx, by, bw, bh) {
    // 3 small pinned paper notes / suspect photos
    const p1 = { x: bx + 15, y: by + 15, w: 32, h: 36 };
    const p2 = { x: bx + bw - 50, y: by + 20, w: 34, h: 36 };
    const p3 = { x: bx + bw / 2 - 18, y: by + bh - 50, w: 36, h: 36 };

    [p1, p2, p3].forEach((p, idx) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      // Photo silhouette
      ctx.fillStyle = '#475569';
      ctx.fillRect(p.x + 4, p.y + 4, p.w - 8, p.h - 14);
      // Red thumbtack
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + 2, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Red yarn / string connecting pins
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1.x + p1.w / 2, p1.y + 2);
    ctx.lineTo(p3.x + p3.w / 2, p3.y + 2);
    ctx.lineTo(p2.x + p2.w / 2, p2.y + 2);
    ctx.stroke();
  }

  drawDetective(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Fedora Hat
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-18, -44, 36, 6); // Brim
    ctx.fillRect(-12, -56, 24, 14); // Crown
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-12, -47, 24, 4); // Hat ribbon

    // Face / Shadow
    ctx.fillStyle = '#fde047'; // Pixel skin
    ctx.fillRect(-10, -38, 20, 16);
    // Mysterious noir shadow across upper eyes
    ctx.fillStyle = 'rgba(30, 27, 75, 0.6)';
    ctx.fillRect(-10, -38, 20, 8);
    // Keen eyes shining in dark
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -35, 4, 3);
    ctx.fillRect(3, -35, 4, 3);

    // Classic Tan Trench Coat
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-16, -22, 32, 45);
    // Lapels
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(-16, -22); ctx.lineTo(0, -6); ctx.lineTo(-8, -22); ctx.fill();
    ctx.moveTo(16, -22); ctx.lineTo(0, -6); ctx.lineTo(8, -22); ctx.fill();
    // Belt
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-16, -2, 32, 5);
    ctx.fillStyle = '#f59e0b'; // Gold belt buckle
    ctx.fillRect(-4, -3, 8, 7);

    // Hand holding Magnifying Glass
    ctx.fillStyle = '#fde047';
    ctx.fillRect(14, -8, 8, 8);
    // Magnifying glass handle & brass rim
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(28, -12, 10, 0, Math.PI * 2);
    ctx.stroke();
    // Glass shimmer
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(28, -12, 8, 0, Math.PI * 2);
    ctx.fill();
    // Handle rod
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, -6);
    ctx.lineTo(16, -2);
    ctx.stroke();

    ctx.restore();
  }

  drawHotspots(ctx) {
    const t = this.time;
    for (let h of this.hotspots) {
      const pulse = Math.sin(t * 6 + h.x) * 4;
      const r = h.radius + pulse;

      // Outer glowing ring
      ctx.strokeStyle = h.inspected ? 'rgba(74, 222, 128, 0.8)' : 'rgba(251, 191, 36, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(h.x, h.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center evidence marker badge
      ctx.fillStyle = h.inspected ? '#22c55e' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Marker number / icon
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.inspected ? '✓' : '?', h.x, h.y);

      // Label banner
      if (h.label) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(h.x - 45, h.y - 28, 90, 16);
        ctx.strokeStyle = h.inspected ? '#22c55e' : '#f59e0b';
        ctx.lineWidth = 1;
        ctx.strokeRect(h.x - 45, h.y - 28, 90, 16);

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText(h.label, h.x, h.y - 20);
      }
    }
  }

  drawScanlines(ctx, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let h of this.hotspots) {
      const dist = Math.hypot(x - h.x, y - h.y);
      if (dist < h.radius + 15) {
        h.inspected = true;
        if (window.soundCtrl) window.soundCtrl.playInspect();
        if (this.onHotspotClick) this.onHotspotClick(h);
        break;
      }
    }
  }
}

window.DetectiveVisualizer = DetectiveVisualizer;
