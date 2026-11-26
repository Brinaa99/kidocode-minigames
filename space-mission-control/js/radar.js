/**
 * Space Mission Control - Radar Display System
 * Interactive retro radar console with rotating sweep beam,
 * phosphor persistence, target blips, and sector analysis.
 */

class RadarSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 0;
    this.speed = 0.04;
    this.blips = [];
    this.running = false;
    this.animId = null;
    this.selectedBlip = null;
    this.onBlipClick = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(rect.width || 220, rect.height || 220);
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(dpr, dpr);
    this.size = size;
  }

  setBlips(blipsList) {
    // Each blip: { id, angle (rad), dist (0..1), label, type, lit: 0, color }
    this.blips = blipsList.map(b => ({
      ...b,
      lit: 0
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
    this.angle = (this.angle + this.speed) % (Math.PI * 2);

    // Check sweep intersection with blips
    const sweepTolerance = 0.08;
    for (let b of this.blips) {
      let diff = Math.abs(this.angle - b.angle);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;

      if (diff < sweepTolerance) {
        if (b.lit <= 0.2) {
          // Trigger ping sound if not silent
          if (window.soundCtrl && Math.random() < 0.4) {
            window.soundCtrl.playRadarPing();
          }
        }
        b.lit = 1.0;
      } else {
        b.lit = Math.max(0, b.lit - 0.012);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const s = this.size;
    const cx = s / 2;
    const cy = s / 2;
    const radius = s / 2 - 8;

    // Background
    ctx.clearRect(0, 0, s, s);

    // Radar screen circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#061a14';
    ctx.fillRect(0, 0, s, s);

    // Range rings
    ctx.strokeStyle = '#005533';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius / 3) * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
    ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
    ctx.stroke();

    // 45 degree diagonals
    ctx.strokeStyle = '#003322';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    const d = radius * 0.7071;
    ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d);
    ctx.moveTo(cx - d, cy + d); ctx.lineTo(cx + d, cy - d);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rotating Radar Sweep cone with gradient
    const sweepGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    sweepGrad.addColorStop(0, 'rgba(0, 255, 128, 0.4)');
    sweepGrad.addColorStop(1, 'rgba(0, 255, 128, 0.05)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, this.angle - 0.4, this.angle);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Leading edge line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(this.angle) * radius, cy + Math.sin(this.angle) * radius);
    ctx.stroke();
    ctx.restore();

    // Draw Blips
    for (let b of this.blips) {
      const bx = cx + Math.cos(b.angle) * (b.dist * radius);
      const by = cy + Math.sin(b.angle) * (b.dist * radius);

      const alpha = 0.25 + b.lit * 0.75;
      const bColor = b.color || '#00ff88';

      // Blip glow
      ctx.save();
      ctx.fillStyle = bColor;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(bx, by, 3 + b.lit * 3, 0, Math.PI * 2);
      ctx.fill();

      // Blip label
      if (b.label && b.lit > 0.3) {
        ctx.fillStyle = '#a7f3d0';
        ctx.font = '8px monospace';
        ctx.fillText(b.label, bx + 6, by + 3);
      }
      ctx.restore();
    }

    ctx.restore();

    // Radar bezel / border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Outer degree ticks
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const tickAngle = (i / 12) * Math.PI * 2;
      const tx1 = cx + Math.cos(tickAngle) * radius;
      const ty1 = cy + Math.sin(tickAngle) * radius;
      const tx2 = cx + Math.cos(tickAngle) * (radius - 5);
      const ty2 = cy + Math.sin(tickAngle) * (radius - 5);
      ctx.beginPath();
      ctx.moveTo(tx1, ty1); ctx.lineTo(tx2, ty2);
      ctx.stroke();
    }

    // Cardinal letters
    ctx.fillStyle = '#34d399';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx, cy - radius + 10);
    ctx.fillText('S', cx, cy + radius - 10);
    ctx.fillText('E', cx + radius - 10, cy);
    ctx.fillText('W', cx - radius + 10, cy);
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = this.size;
    const cx = s / 2;
    const cy = s / 2;
    const radius = s / 2 - 8;

    for (let b of this.blips) {
      const bx = cx + Math.cos(b.angle) * (b.dist * radius);
      const by = cy + Math.sin(b.angle) * (b.dist * radius);
      const dist = Math.hypot(x - bx, y - by);

      if (dist < 14) {
        if (this.onBlipClick) this.onBlipClick(b);
        b.lit = 1.0;
        if (window.soundCtrl) window.soundCtrl.playClick();
        break;
      }
    }
  }
}

window.RadarSystem = RadarSystem;
