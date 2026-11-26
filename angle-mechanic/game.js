/**
 * ANGLE MECHANIC — ACUTE & OBTUSE ANGLES WORKSHOP
 * Mathematics Topic: Acute and Obtuse Angles (Stucent Room: Acute and Obtuse)
 * Room ID: a11ac5d9-f530-422d-b904-63b1c169ba43
 *
 * Physical machine manipulation arcade game where players rotate mechanical parts
 * to repair workshop machines by constructing accurate acute and obtuse angles.
 */

(() => {
  'use strict';

  const doc = typeof root !== 'undefined' ? root : document;
  const gameGlobal = typeof game !== 'undefined' ? game : (window.game = window.game || {});

  // ==========================================================================
  // 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER)
  // ==========================================================================
  class ArcadeAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.initialized = false;
      this.lastClickTime = 0;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio not supported:', e);
      }
    }

    ensureContext() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type, duration, startVol = 0.2, endVol = 0.01, pitchDrop = null) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchDrop !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, pitchDrop), now + duration);
      }

      gain.gain.setValueAtTime(startVol, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    playRatchetClick(angleDeg) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      if (now - this.lastClickTime < 0.04) return; // Throttle rapid clicks
      this.lastClickTime = now;

      // Base click frequency shifts smoothly with angle (300Hz to 700Hz)
      const baseFreq = 320 + (angleDeg / 180) * 400;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.025);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }

    playLockSound() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Heavy metallic latch click
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(60, now + 0.1);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // High metallic chime ring
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1100, now + 0.02);
      gain2.gain.setValueAtTime(0.15, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.25);
    }

    playMachinePowerUp() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Resonant upward motor spin
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);

      // Steam hiss
      this.playSteamHiss(0.35);
    }

    playSteamHiss(duration = 0.3) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 2.5;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    }

    playSuccessJingle(streak = 1) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const baseTime = this.ctx.currentTime + 0.05;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, baseTime + idx * 0.09);

        gain.gain.setValueAtTime(0.15, baseTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + idx * 0.09 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(baseTime + idx * 0.09);
        osc.stop(baseTime + idx * 0.09 + 0.25);
      });

      if (streak >= 3) {
        // High sparkling chime for high streak
        setTimeout(() => {
          this.playTone(1318.51, 'sine', 0.4, 0.12, 0.001); // E6
        }, 360);
      }
    }

    playErrorBuzz() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Double buzz
      [0, 0.14].forEach(offset => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now + offset);
        osc.frequency.setValueAtTime(110, now + offset + 0.08);

        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
      });
    }

    playHeartLoss() {
      this.playTone(280, 'sawtooth', 0.35, 0.25, 0.001, 80);
    }

    playVictoryFanfare() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const fanfare = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.15 },
        { f: 783.99, d: 0.15, t: 0.3 },
        { f: 1046.50, d: 0.45, t: 0.48 },
        { f: 880.00, d: 0.2, t: 0.98 },
        { f: 1046.50, d: 0.65, t: 1.2 }
      ];

      const now = this.ctx.currentTime;
      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0.2, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + note.d + 0.05);
      });
    }
  }

  const audio = new ArcadeAudioEngine();

  // ==========================================================================
  // 2. PARTICLE & VISUAL EFFECTS SYSTEM
  // ==========================================================================
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.floatingTexts = [];
    }

    spawnSparks(x, y, count = 20, baseColor = '#fbbf24') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          gravity: 0.18,
          radius: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.3 ? baseColor : '#ffffff',
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          type: 'spark'
        });
      }
    }

    spawnSteam(x, y, count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() * 0.8 - 0.4);
        const speed = 1.5 + Math.random() * 3.5;
        this.particles.push({
          x: x + (Math.random() * 12 - 6),
          y: y + (Math.random() * 6 - 3),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: -0.04, // Floats up
          radius: 6 + Math.random() * 10,
          color: 'rgba(220, 235, 255, 0.7)',
          alpha: 0.8,
          decay: 0.015 + Math.random() * 0.02,
          type: 'steam'
        });
      }
    }

    spawnFloatingText(text, x, y, color = '#fbbf24', scale = 1) {
      this.floatingTexts.push({
        text,
        x,
        y,
        vy: -1.8,
        alpha: 1,
        color,
        scale,
        life: 1
      });
    }

    update() {
      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        if (p.type === 'steam') {
          p.radius += 0.35; // Expands as it cools
        }
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.018;
        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    render(ctx) {
      // Draw particles
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.type === 'spark') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'steam') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw floating texts
      for (const ft of this.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `900 ${Math.round(20 * ft.scale)}px var(--font-display)`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }
    }
  }

  // ==========================================================================
  // 3. APPRENTICE MECHANIC CHARACTER ("BOLT")
  // ==========================================================================
  class MechanicCharacter {
    constructor() {
      this.x = 180;
      this.y = 0;
      this.targetX = 180;
      this.state = 'IDLE'; // IDLE, WALKING, REPAIRING, CELEBRATING, CONFUSED
      this.facing = 1; // 1 = right, -1 = left
      this.stateTime = 0;
      this.animTime = 0;
    }

    update(dt) {
      this.animTime += dt;
      this.stateTime += dt;

      // Handle walking movement toward target
      const dx = this.targetX - this.x;
      if (Math.abs(dx) > 4) {
        this.state = 'WALKING';
        this.facing = dx > 0 ? 1 : -1;
        this.x += Math.sign(dx) * Math.min(Math.abs(dx), 160 * dt);
      } else if (this.state === 'WALKING') {
        this.state = 'IDLE';
      }

      if ((this.state === 'REPAIRING' || this.state === 'CELEBRATING' || this.state === 'CONFUSED') && this.stateTime > 1.6) {
        this.state = 'IDLE';
      }
    }

    setTargetX(tx) {
      this.targetX = tx;
    }

    triggerRepair() {
      this.state = 'REPAIRING';
      this.stateTime = 0;
    }

    triggerCelebrate() {
      this.state = 'CELEBRATING';
      this.stateTime = 0;
    }

    triggerConfused() {
      this.state = 'CONFUSED';
      this.stateTime = 0;
    }

    render(ctx, groundY) {
      this.y = groundY;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.facing, 1);

      const t = this.animTime * 6;
      let bobY = 0;
      let legSwing = 0;
      let armAngle = 0;
      let wrenchY = 0;

      if (this.state === 'WALKING') {
        bobY = Math.abs(Math.sin(t)) * 6;
        legSwing = Math.sin(t) * 12;
        armAngle = Math.cos(t) * 0.4;
      } else if (this.state === 'IDLE') {
        bobY = Math.sin(t * 0.4) * 2;
      } else if (this.state === 'REPAIRING') {
        bobY = Math.sin(t * 2) * 3;
        armAngle = Math.sin(t * 3) * 0.8;
        wrenchY = Math.sin(t * 3) * 8;
      } else if (this.state === 'CELEBRATING') {
        bobY = -Math.abs(Math.sin(t * 1.5)) * 18;
        armAngle = -1.2 + Math.sin(t * 2) * 0.2;
      } else if (this.state === 'CONFUSED') {
        bobY = 0;
        armAngle = -0.7;
      }

      // Character shadow
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Legs / Boots
      ctx.fillStyle = '#334155'; // Dark industrial boots
      // Left leg
      ctx.fillRect(-12 + legSwing, -18 - bobY, 9, 18 + bobY);
      // Right leg
      ctx.fillRect(3 - legSwing, -18 - bobY, 9, 18 + bobY);
      // Boots sole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14 + legSwing, -6, 12, 6);
      ctx.fillRect(1 - legSwing, -6, 12, 6);

      // Body (Overalls / Jumpsuit)
      ctx.fillStyle = '#0284c7'; // Mechanic blue overalls
      ctx.beginPath();
      ctx.roundRect(-16, -52 - bobY, 32, 36, [8, 8, 4, 4]);
      ctx.fill();

      // Orange utility belt & pouch
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-16, -26 - bobY, 32, 6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-4, -25 - bobY, 8, 8); // Belt buckle

      // Chest pocket with pencil / badge
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(2, -44 - bobY, 10, 10);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(5, -48 - bobY, 3, 6); // Pocket tool

      // Head & Face
      ctx.fillStyle = '#fed7aa'; // Skin tone
      ctx.beginPath();
      ctx.arc(0, -66 - bobY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Hair (messy mechanic brown hair)
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, -72 - bobY, 14, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-14, -72 - bobY);
      ctx.lineTo(-6, -68 - bobY);
      ctx.lineTo(0, -74 - bobY);
      ctx.lineTo(8, -68 - bobY);
      ctx.lineTo(14, -72 - bobY);
      ctx.fill();

      // Goggles on forehead
      ctx.fillStyle = '#475569';
      ctx.fillRect(-14, -76 - bobY, 28, 5); // Strap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-6, -74 - bobY, 6, 0, Math.PI * 2);
      ctx.arc(6, -74 - bobY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8'; // Glowing blue goggle lenses
      ctx.beginPath();
      ctx.arc(-6, -74 - bobY, 4, 0, Math.PI * 2);
      ctx.arc(6, -74 - bobY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & Expression
      ctx.fillStyle = '#0f172a';
      if (this.state === 'CONFUSED') {
        // One raised eyebrow, wavy mouth
        ctx.fillRect(2, -67 - bobY, 3, 3);
        ctx.fillRect(7, -69 - bobY, 3, 3);
        ctx.fillRect(4, -60 - bobY, 6, 2);
      } else if (this.state === 'CELEBRATING') {
        // Happy squinting ^_^ eyes
        ctx.beginPath();
        ctx.arc(4, -66 - bobY, 3, Math.PI, 0);
        ctx.arc(9, -66 - bobY, 3, Math.PI, 0);
        ctx.stroke();
        // Big open smile
        ctx.beginPath();
        ctx.arc(6, -61 - bobY, 4, 0, Math.PI);
        ctx.fill();
      } else {
        // Normal eyes
        ctx.fillRect(4, -67 - bobY, 3, 4);
        ctx.fillRect(9, -67 - bobY, 3, 4);
        // Determined small smile
        ctx.fillRect(5, -60 - bobY, 5, 2);
      }

      // Mechanic Arm & Wrench
      ctx.save();
      ctx.translate(8, -44 - bobY);
      ctx.rotate(armAngle);

      // Arm sleeve
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-4, 0, 8, 16);
      // Hand (glove)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Silver Wrench
      ctx.save();
      ctx.translate(0, 18 + wrenchY);
      ctx.rotate(0.3);
      ctx.fillStyle = '#cbd5e1'; // Chrome/steel
      ctx.fillRect(-2, -18, 4, 26);
      // Wrench head open jaws
      ctx.beginPath();
      ctx.arc(0, -18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2, -22, 4, 5); // Jaw cutout
      ctx.restore();

      ctx.restore();

      ctx.restore();
    }
  }

  // ==========================================================================
  // 4. MACHINES SYSTEM (INTERACTIVE WORKSHOP OBJECTS)
  // ==========================================================================

  class Machine {
    constructor(id, type, name, cx, cy, armLength, baseAngle = 0) {
      this.id = id;
      this.type = type; // ROBOTIC_ARM, MECHANICAL_DOOR, CRANE, DRAWBRIDGE, SATELLITE, FACTORY_ARM, WIND_TURBINE, STEAM_VALVE
      this.name = name;
      this.cx = cx;
      this.cy = cy;
      this.armLength = armLength;
      this.baseAngle = baseAngle; // Reference horizontal angle in radians (usually 0)
      this.currentAngleDeg = 45; // Degrees from 5 to 175
      this.targetType = 'ACUTE'; // 'ACUTE', 'OBTUSE', or 'PRECISION'
      this.targetMinDeg = 0;
      this.targetMaxDeg = 90;
      this.isLocked = false;
      this.isActivated = false;
      this.activationTime = 0;
      this.isOscillating = false;
      this.oscillationSpeed = 1.2;
      this.oscillationTime = 0;
      this.isDragging = false;
    }

    setTarget(type, minDeg, maxDeg) {
      this.targetType = type;
      this.targetMinDeg = minDeg;
      this.targetMaxDeg = maxDeg;
      this.isLocked = false;
      this.isActivated = false;
    }

    setAngle(deg) {
      if (this.isLocked) return;
      this.currentAngleDeg = Math.max(5, Math.min(175, Math.round(deg)));
    }

    update(dt) {
      if (this.isActivated) {
        this.activationTime += dt;
      }

      if (this.isOscillating && !this.isLocked) {
        this.oscillationTime += dt * this.oscillationSpeed;
        // Smooth sine wave between 20° and 160°
        const t = (Math.sin(this.oscillationTime) + 1) / 2;
        this.currentAngleDeg = Math.round(20 + t * 140);
      }
    }

    checkSuccess() {
      const deg = this.currentAngleDeg;
      if (this.targetType === 'ACUTE') {
        return deg > 0 && deg < 90;
      } else if (this.targetType === 'OBTUSE') {
        return deg > 90 && deg < 180;
      } else if (this.targetType === 'PRECISION') {
        return deg >= this.targetMinDeg && deg <= this.targetMaxDeg;
      }
      return false;
    }

    getTipPos() {
      // In standard orientation, angle is measured up from positive X axis (left-to-right)
      // or from base horizontal ray. Screen coordinates: -Y is up.
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      return {
        x: this.cx + Math.cos(-rad) * this.armLength,
        y: this.cy + Math.sin(-rad) * this.armLength
      };
    }

    isPointNearHandle(px, py) {
      const tip = this.getTipPos();
      const dist = Math.hypot(px - tip.x, py - tip.y);
      return dist <= 42; // Generous touch/click radius
    }

    render(ctx) {
      // Base Machine Rendering Strategy based on machine type
      switch (this.type) {
        case 'ROBOTIC_ARM':
          this.renderRoboticArm(ctx);
          break;
        case 'MECHANICAL_DOOR':
          this.renderMechanicalDoor(ctx);
          break;
        case 'CRANE':
          this.renderCrane(ctx);
          break;
        case 'DRAWBRIDGE':
          this.renderDrawbridge(ctx);
          break;
        case 'SATELLITE':
          this.renderSatellite(ctx);
          break;
        case 'FACTORY_ARM':
          this.renderFactoryArm(ctx);
          break;
        case 'WIND_TURBINE':
          this.renderWindTurbine(ctx);
          break;
        case 'STEAM_VALVE':
          this.renderSteamValve(ctx);
          break;
        default:
          this.renderRoboticArm(ctx);
          break;
      }

      // Draw standard Protractor Arc and Geometric Angle Indicator
      this.renderAngleArc(ctx);
    }

    // --- PROTRACTOR & ANGLE ARC OVERLAY ---
    renderAngleArc(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const arcRadius = Math.min(this.armLength * 0.45, 90);
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const isAcute = this.currentAngleDeg < 90;
      const isRight = this.currentAngleDeg === 90;

      ctx.save();

      // 1. Base Reference Ray (Horizontal 0°)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + this.armLength * 0.9, cy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Base ray arrow tip
      ctx.beginPath();
      ctx.moveTo(cx + this.armLength * 0.9 + 6, cy);
      ctx.lineTo(cx + this.armLength * 0.9 - 4, cy - 4);
      ctx.lineTo(cx + this.armLength * 0.9 - 4, cy + 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      // 2. Target Range Shaded Zone (if in precision mode)
      if (this.targetType === 'PRECISION') {
        const minR = (this.targetMinDeg * Math.PI) / 180;
        const maxR = (this.targetMaxDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, arcRadius + 14, -minR, -maxR, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Right Angle (90°) Reference Guide Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - arcRadius * 1.3);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 90° square marker
      const sq = 12;
      ctx.strokeRect(cx, cy - sq, sq, sq);

      // 4. Angle Arc Fill & Stroke
      let arcColor = isAcute ? '#06b6d4' : '#f97316';
      if (isRight) arcColor = '#10b981';
      if (this.isActivated) arcColor = '#10b981';

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, arcRadius, 0, -rad, true);
      ctx.closePath();
      ctx.fillStyle = isAcute ? 'rgba(6, 182, 212, 0.18)' : 'rgba(249, 115, 22, 0.18)';
      if (this.isActivated) ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, arcRadius, 0, -rad, true);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // 5. Angle Degree Label & Badge
      const midRad = -rad / 2;
      const labelDist = arcRadius + 26;
      const lx = cx + Math.cos(midRad) * labelDist;
      const ly = cy + Math.sin(midRad) * labelDist;

      // Label background badge
      const labelText = `${this.currentAngleDeg}°`;
      ctx.font = '900 16px var(--font-mono)';
      const textWidth = ctx.measureText(labelText).width;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(lx - textWidth / 2 - 8, ly - 12, textWidth + 16, 24, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, lx, ly);

      // 6. Interactive Drag Handle Knob at Tip of movable arm
      const tip = this.getTipPos();
      ctx.save();
      ctx.translate(tip.x, tip.y);

      // Pulsing glow around handle knob
      const pulse = Math.sin(Date.now() * 0.008) * 4;
      ctx.beginPath();
      ctx.arc(0, 0, 18 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = this.isLocked ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)';
      ctx.fill();

      // Main handle knob
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = this.isLocked ? '#10b981' : '#f59e0b';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Inner icon / ring
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // "DRAG" tooltip hint if idle and unlocked
      if (!this.isLocked && !this.isOscillating) {
        ctx.fillStyle = '#fde68a';
        ctx.font = '800 10px var(--font-display)';
        ctx.fillText('DRAG', 0, -22);
      }

      ctx.restore();

      ctx.restore();
    }

    // --- INDIVIDUAL MACHINE GRAPHICS & REACTIONS ---

    // 1. ROBOTIC SERVO ARM
    renderRoboticArm(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Heavy Base Pedestal
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 36, cy, 72, 32, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Hazard Stripes on base
      ctx.save();
      ctx.clip();
      ctx.fillStyle = '#f59e0b';
      for (let x = cx - 50; x < cx + 50; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x + 8, cy);
        ctx.lineTo(x - 2, cy + 32);
        ctx.lineTo(x - 10, cy + 32);
        ctx.fill();
      }
      ctx.restore();

      // Hydraulic Base Cylinder
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Movable Boom Arm
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      // Hydraulic piston rod behind arm (pumps when active)
      const pistonShift = this.isActivated ? Math.sin(t * 12) * 5 : 0;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(16 + pistonShift, 6, this.armLength * 0.55, 6);
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 4, 24, 10);

      // Main Steel Beam
      ctx.fillStyle = this.isActivated ? '#0369a1' : '#0284c7';
      ctx.strokeStyle = this.isActivated ? '#38bdf8' : '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(0, -10, this.armLength, 20, 6);
      ctx.fill();
      ctx.stroke();

      // Glowing power conduit along boom if activated
      if (this.isActivated) {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(this.armLength - 12, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Lightening cutouts in boom
      ctx.fillStyle = '#0c4a6e';
      for (let bx = 30; bx < this.armLength - 30; bx += 32) {
        ctx.beginPath();
        ctx.ellipse(bx, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tip Claw / Laser Welder
      ctx.translate(this.armLength, 0);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Claw Jaws (Snaps open and shut when activated)
      const jawAngle = this.isActivated ? Math.sin(t * 15) * 0.35 : 0.2;
      // Upper jaw
      ctx.save();
      ctx.rotate(-jawAngle);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(4, -4);
      ctx.lineTo(16, -10);
      ctx.lineTo(18, -4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Lower jaw
      ctx.save();
      ctx.rotate(jawAngle);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.lineTo(16, 10);
      ctx.lineTo(18, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Glowing laser emitter in center
      if (this.isActivated) {
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 14;
        ctx.fillRect(4, -3, 8, 6);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(4, -3, 6, 6);
      }

      ctx.restore(); // restore boom transform

      // If active, fire laser welding beam down to metal plate below with sparks
      if (this.isActivated) {
        const plateY = cy + 18;
        const beamX = tip.x;

        // Laser beam line
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3 + Math.sin(t * 20) * 1.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(beamX, plateY);
        ctx.stroke();

        // Inner white hot core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(beamX, plateY);
        ctx.stroke();

        // Metal workpiece plate on ground
        ctx.fillStyle = '#64748b';
        ctx.fillRect(beamX - 22, plateY, 44, 8);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(beamX, plateY, 5 + Math.sin(t * 30) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Center pivot bolt
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. MECHANICAL BLAST HATCH / DOOR
    renderMechanicalDoor(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Door Frame Chamber / Reveal behind open door
      ctx.fillStyle = '#090e17';
      ctx.fillRect(cx, cy - this.armLength * 0.9, this.armLength * 0.95, this.armLength * 0.95);

      // Glowing engine / power reactor core visible through open door
      const openRatio = this.currentAngleDeg / 180;
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, cy - this.armLength * 0.9, this.armLength * 0.95, this.armLength * 0.95);
      ctx.clip();

      const coreX = cx + this.armLength * 0.45;
      const coreY = cy - this.armLength * 0.45;

      // Reactor core glow
      const reactorGlow = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, 50);
      reactorGlow.addColorStop(0, this.isActivated ? 'rgba(56, 189, 248, 0.9)' : 'rgba(56, 189, 248, 0.4)');
      reactorGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = reactorGlow;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Rotating containment rings in reactor
      ctx.save();
      ctx.translate(coreX, coreY);
      const ringSpin = this.isActivated ? t * 4 : Date.now() * 0.001;
      ctx.rotate(ringSpin);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -16, 32, 32);
      ctx.rotate(-ringSpin * 1.6);
      ctx.strokeRect(-22, -22, 44, 44);
      ctx.restore();

      ctx.restore();

      // Status indicator lights atop the door frame
      const lightColor = this.isActivated ? '#10b981' : '#f59e0b';
      ctx.fillStyle = lightColor;
      ctx.shadowColor = lightColor;
      ctx.shadowBlur = this.isActivated ? 10 : 4;
      ctx.beginPath();
      ctx.arc(cx + 20, cy - this.armLength * 0.9 - 8, 4, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy - this.armLength * 0.9 - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Vault Hinge Mount
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - 24, cy - 20, 24, 40);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 20, cy - 14, 8, 28);

      // Movable Heavy Steel Blast Door Slab
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(0, -8, this.armLength, 16, 4);
      ctx.fill();
      ctx.stroke();

      // Door Rivets & Locking Teeth
      ctx.fillStyle = '#cbd5e1';
      for (let rx = 18; rx < this.armLength - 10; rx += 22) {
        ctx.beginPath();
        ctx.arc(rx, -4, 2, 0, Math.PI * 2);
        ctx.arc(rx, 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pressure Wheel on Door (spins if activated)
      ctx.save();
      ctx.translate(this.armLength * 0.5, 0);
      if (this.isActivated) ctx.rotate(t * 6);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Hinge Pivot Pin
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 3. INDUSTRIAL CRANE
    renderCrane(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Crane Support Tower / Mast
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + 80);
      ctx.lineTo(cx - 15, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.lineTo(cx + 30, cy + 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tower cross trusses
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 25, cy + 60);
      ctx.lineTo(cx + 20, cy + 25);
      ctx.moveTo(cx + 25, cy + 60);
      ctx.lineTo(cx - 20, cy + 25);
      ctx.stroke();

      // Movable Lattice Boom Arm
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      // Lattice Crane Truss Structure
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(this.armLength, -2);
      ctx.lineTo(this.armLength, 2);
      ctx.lineTo(0, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner truss X-braces
      ctx.lineWidth = 1.5;
      for (let bx = 16; bx < this.armLength - 16; bx += 26) {
        ctx.beginPath();
        ctx.moveTo(bx, -10);
        ctx.lineTo(bx + 26, 10);
        ctx.moveTo(bx + 26, -10);
        ctx.lineTo(bx, 10);
        ctx.stroke();
      }

      // Pulley Winch Wheel at Crane Tip (Spins when lifting)
      ctx.save();
      ctx.translate(this.armLength, 0);
      if (this.isActivated) ctx.rotate(t * 10);
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Dynamic Crane Cargo Hoist Physics
      // When activated, cable shortens smoothly, lifting crate into the air!
      const liftOffset = this.isActivated ? Math.min(32, t * 24) : 0;
      const cableLength = Math.max(16, 48 - liftOffset);
      const swayAngle = this.isActivated ? Math.sin(t * 5) * 0.08 : 0;

      const hookX = tip.x + Math.sin(swayAngle) * cableLength;
      const hookY = tip.y + Math.cos(swayAngle) * cableLength;

      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(hookX, hookY);
      ctx.stroke();

      // Dangling Cargo Crate / Magnet
      ctx.save();
      ctx.translate(hookX, hookY);
      ctx.rotate(swayAngle);

      // Lift Magnet Head
      ctx.fillStyle = this.isActivated ? '#10b981' : '#475569';
      ctx.fillRect(-12, 0, 24, 6);

      // Wooden Cargo Crate
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.fillRect(-14, 6, 28, 22);
      ctx.strokeRect(-14, 6, 28, 22);

      // Crate label
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 10px var(--font-display)';
      ctx.textAlign = 'center';
      ctx.fillText('CARGO', 0, 20);

      // Magnetic sparkles if lifting
      if (this.isActivated) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(-8, 3, 2, 0, Math.PI * 2);
        ctx.arc(8, 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      // Center pivot hub
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. HYDRAULIC DRAWBRIDGE
    renderDrawbridge(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // River / Water trench below bridge
      ctx.fillStyle = '#082f49';
      ctx.fillRect(cx - 60, cy + 10, this.armLength * 1.5, 60);

      // Water waves
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      for (let wx = cx - 50; wx < cx + this.armLength * 1.4; wx += 24) {
        ctx.beginPath();
        ctx.arc(wx, cy + 25, 8, 0, Math.PI);
        ctx.fill();
      }

      // If activated, animate a cargo boat sailing smoothly across under the open bridge!
      if (this.isActivated) {
        const boatX = cx - 40 + t * 45;
        const boatY = cy + 26;

        ctx.save();
        // Boat hull
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(boatX - 16, boatY);
        ctx.lineTo(boatX + 16, boatY);
        ctx.lineTo(boatX + 12, boatY + 10);
        ctx.lineTo(boatX - 12, boatY + 10);
        ctx.closePath();
        ctx.fill();

        // Cabin
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(boatX - 6, boatY - 8, 12, 8);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(boatX + 1, boatY - 6, 4, 4);

        // Smokestack
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(boatX - 4, boatY - 14, 4, 6);

        // Little smoke puff
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(boatX - 2, boatY - 18, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Left Bridge Abutment / Roadway Pier
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - 70, cy - 8, 70, 78);
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 70, cy - 14, 70, 8); // Road asphalt

      // Hydraulic Lift Cylinder Body (gleams and extends when active)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - 30, cy + 12, 16, 32);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 26, cy + 4, 8, 14); // Chrome ram rod

      // Flashing navigation beacon light on pier
      const navColor = this.isActivated ? '#10b981' : '#ef4444';
      ctx.fillStyle = navColor;
      ctx.shadowColor = navColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx - 10, cy - 20, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Movable Bridge Deck
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      // Heavy Roadway Truss
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(0, -6, this.armLength, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Safety Railings on bridge deck
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, -18);
      ctx.lineTo(this.armLength - 10, -18);
      for (let rx = 10; rx <= this.armLength - 10; rx += 20) {
        ctx.moveTo(rx, -6);
        ctx.lineTo(rx, -18);
      }
      ctx.stroke();

      ctx.restore();

      // Pier Pivot Pin
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 5. RADAR / SATELLITE DISH
    renderSatellite(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Satellite Pedestal Base & Electronics Bay
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 28, cy + 10, 56, 50);

      // Equalizer bars on console bay (dances when active)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 20, cy + 20, 40, 16);
      for (let eq = 0; eq < 4; eq++) {
        const barH = this.isActivated ? 4 + Math.abs(Math.sin(t * 10 + eq)) * 8 : 4;
        ctx.fillStyle = this.isActivated ? '#10b981' : '#0284c7';
        ctx.fillRect(cx - 16 + eq * 9, cy + 34 - barH, 6, barH);
      }

      // Rotating Aiming Bracket & Dish
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      // Support Boom
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.armLength * 0.7, 0);
      ctx.stroke();

      // Parabolic Dish Curve
      ctx.translate(this.armLength * 0.7, 0);
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36, -Math.PI / 2.4, Math.PI / 2.4);
      ctx.lineTo(6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Feed Horn Antenna Stalk extending from dish
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();

      // Receiver Horn Tip
      ctx.fillStyle = this.isActivated ? '#38bdf8' : '#ef4444';
      ctx.shadowColor = this.isActivated ? '#38bdf8' : 'transparent';
      ctx.shadowBlur = this.isActivated ? 12 : 0;
      ctx.beginPath();
      ctx.arc(24, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Concentric Radar Waves pulsing outwards into space when active
      if (this.isActivated) {
        for (let w = 1; w <= 3; w++) {
          const wavePhase = (t * 2 + w * 0.35) % 1;
          const waveRadius = 15 + wavePhase * 45;
          const waveAlpha = Math.max(0, 1 - wavePhase);

          ctx.strokeStyle = `rgba(56, 189, 248, ${waveAlpha})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(24, 0, waveRadius, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Base Pivot Pin
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 6. HEAVY FACTORY ARM / CONVEYOR PRESS
    renderFactoryArm(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Conveyor belt platform below
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 60, cy + 30, this.armLength * 1.5, 24);

      // Rolling conveyor slats (animates when active)
      const rollerShift = this.isActivated ? (t * 40) % 18 : 0;
      ctx.fillStyle = '#475569';
      for (let cxp = cx - 60 + rollerShift; cxp < cx + this.armLength * 1.4; cxp += 18) {
        ctx.fillRect(cxp, cy + 33, 10, 18);
      }

      // Factory Base Pillar
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - 30, cy - 10, 30, 64);

      // Movable Press Arm
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      ctx.fillStyle = this.isActivated ? '#c2410c' : '#ea580c';
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(0, -12, this.armLength, 24, 6);
      ctx.fill();
      ctx.stroke();

      // Heavy Stamping Hammer at tip (punches down rhythmically when active)
      const punchY = this.isActivated ? Math.abs(Math.sin(t * 8)) * 14 : 0;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(this.armLength - 16, -20 + punchY, 24, 40);

      // Impact sparks on anvil if stamping
      if (this.isActivated && punchY > 10) {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.armLength - 4, 22, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Pivot Pin
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 7. WIND TURBINE GENERATOR
    renderWindTurbine(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Turbine White Tower
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy + 80);
      ctx.lineTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.lineTo(cx + 16, cy + 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Energy transmission pulse down tower when active
      if (this.isActivated) {
        const pulseY = cy + (t * 60) % 80;
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, pulseY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Nacelle Generator Pod
      ctx.fillStyle = this.isActivated ? '#0284c7' : '#0369a1';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Movable Pitch Blade (Spins rapidly when activated)
      ctx.save();
      ctx.translate(cx, cy);
      const bladeSpin = this.isActivated ? -rad + t * 12 : -rad;
      ctx.rotate(bladeSpin);

      // 3 Blades arrangement when spinning, or single calibration blade
      const numBlades = this.isActivated ? 3 : 1;
      for (let b = 0; b < numBlades; b++) {
        ctx.save();
        ctx.rotate((b * Math.PI * 2) / numBlades);

        // Aerodynamic Tapered Rotor Blade
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(this.armLength * 0.4, -12);
        ctx.lineTo(this.armLength, -2);
        ctx.lineTo(this.armLength, 2);
        ctx.lineTo(this.armLength * 0.4, 8);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Red safety tip stripe
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.armLength - 20, -4, 20, 8);

        ctx.restore();
      }

      ctx.restore();

      // Center Rotor Hub Nosecone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 8. STEAM VALVE PISTON
    renderSteamValve(ctx) {
      const cx = this.cx;
      const cy = this.cy;
      const tip = this.getTipPos();
      const rad = (this.currentAngleDeg * Math.PI) / 180;
      const t = this.activationTime;

      ctx.save();

      // Brass Piping
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.fillRect(cx - 60, cy - 14, 120, 28);
      ctx.strokeRect(cx - 60, cy - 14, 120, 28);

      // Top Relief Chimney Pipe
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - 10, cy - 42, 20, 28);

      // High-pressure steam blast jet upwards when active
      if (this.isActivated) {
        ctx.save();
        for (let sp = 0; sp < 4; sp++) {
          const plumePhase = (t * 3 + sp * 0.25) % 1;
          const plumeY = cy - 44 - plumePhase * 55;
          const plumeR = 8 + plumePhase * 16;
          const plumeA = Math.max(0, 0.8 - plumePhase);

          ctx.fillStyle = `rgba(240, 248, 255, ${plumeA})`;
          ctx.beginPath();
          ctx.arc(cx + Math.sin(t * 10 + sp) * 4, plumeY, plumeR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Pressure Dial Gauge on pipe
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx + 36, cy - 36, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Safe green zone arc on gauge
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx + 36, cy - 36, 12, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();

      // Dial needle (settles in green zone when active)
      const needleAngle = this.isActivated ? 0.2 + Math.sin(t * 15) * 0.05 : -1.1;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + 36, cy - 36);
      ctx.lineTo(cx + 36 + Math.cos(needleAngle) * 11, cy - 36 + Math.sin(needleAngle) * 11);
      ctx.stroke();

      // Movable Heavy Brass Valve Lever
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, -8, this.armLength, 16, 4);
      ctx.fill();
      ctx.stroke();

      // Weighted Brass Ball at tip
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(this.armLength, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Valve Pivot Flange
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================================================
  // 5. ROUND DEFINITIONS & PROGRESSION ENGINE
  // ==========================================================================

  const ROUND_CONFIGS = [
    // Round 1 — Basic Acute (Simple & Clear)
    {
      round: 1,
      title: 'ROUND 1 — BASIC ACUTE',
      machineType: 'ROBOTIC_ARM',
      machineName: 'HYDRAULIC ROBOTIC ARM',
      targetType: 'ACUTE',
      targetMin: 15,
      targetMax: 85,
      initialAngle: 135,
      missionText: 'CREATE AN ACUTE ANGLE (< 90°)',
      targetBadge: 'ACUTE (< 90°)',
      timeLimit: 60,
      description: 'Drag the robotic arm so that its angle is sharp and less than 90°.'
    },
    // Round 2 — Basic Obtuse (Simple & Clear)
    {
      round: 2,
      title: 'ROUND 2 — BASIC OBTUSE',
      machineType: 'MECHANICAL_DOOR',
      machineName: 'BLAST HATCH DOOR',
      targetType: 'OBTUSE',
      targetMin: 95,
      targetMax: 165,
      initialAngle: 35,
      missionText: 'CREATE AN OBTUSE ANGLE (> 90°)',
      targetBadge: 'OBTUSE (> 90°)',
      timeLimit: 60,
      description: 'Open the door wide until its angle is greater than 90°.'
    },
    // Round 3 — Crane Acute (Simple & Clear)
    {
      round: 3,
      title: 'ROUND 3 — CRANE CALIBRATION',
      machineType: 'CRANE',
      machineName: 'INDUSTRIAL CRANE',
      targetType: 'ACUTE',
      targetMin: 20,
      targetMax: 80,
      initialAngle: 145,
      missionText: 'SET THE CRANE TO AN ACUTE ANGLE (< 90°)',
      targetBadge: 'ACUTE (< 90°)',
      timeLimit: 55,
      description: 'Adjust the crane boom to a safe acute angle.'
    },
    // Round 4 — Bridge Obtuse
    {
      round: 4,
      title: 'ROUND 4 — DRAWBRIDGE DECK',
      machineType: 'DRAWBRIDGE',
      machineName: 'HYDRAULIC DRAWBRIDGE',
      targetType: 'OBTUSE',
      targetMin: 100,
      targetMax: 160,
      initialAngle: 30,
      missionText: 'OPEN THE BRIDGE TO AN OBTUSE ANGLE (> 90°)',
      targetBadge: 'OBTUSE (> 90°)',
      timeLimit: 55,
      description: 'Raise the bridge deck wide to allow cargo ships through.'
    },
    // Round 5 — Mixed Challenge (Varied Phrasing)
    {
      round: 5,
      title: 'ROUND 5 — MIXED WORKSHOP CHALLENGE',
      machineType: 'SATELLITE',
      machineName: 'RADAR SATELLITE DISH',
      targetType: 'RANDOM', // Dynamically chooses Acute or Obtuse
      targetMin: 0,
      targetMax: 0,
      initialAngle: 90,
      missionText: '',
      targetBadge: '',
      timeLimit: 50,
      description: 'Read the mission carefully to set the required angle type.'
    },
    // Round 6 — Close to 90° (Boundary Challenge)
    {
      round: 6,
      title: 'ROUND 6 — CLOSE TO 90° BOUNDARY',
      machineType: 'STEAM_VALVE',
      machineName: 'STEAM PISTON VALVE',
      targetType: 'PRECISION',
      targetMin: 80,
      targetMax: 89,
      initialAngle: 120,
      missionText: 'CREATE AN ACUTE ANGLE CLOSE TO 90° (80° - 89°)',
      targetBadge: '80° - 89° (ACUTE)',
      timeLimit: 50,
      description: '89° is acute, but 90° is right and 91° is obtuse! Stay between 80° and 89°.'
    },
    // Round 7 — Moving / Oscillating Machine (Timing Challenge)
    {
      round: 7,
      title: 'ROUND 7 — MOVING MECHANISM TIMING',
      machineType: 'FACTORY_ARM',
      machineName: 'HIGH-SPEED FACTORY ARM',
      targetType: 'OBTUSE',
      targetMin: 95,
      targetMax: 165,
      initialAngle: 45,
      isOscillating: true,
      missionText: 'TIMING: STOP ARM AT AN ANGLE GREATER THAN 90°',
      targetBadge: '> 90° (OBTUSE)',
      timeLimit: 45,
      description: 'The arm is swinging automatically! Hit LOCK ANGLE [SPACE] when it is obtuse (> 90°).'
    },
    // Round 8 — Precision Challenge
    {
      round: 8,
      title: 'ROUND 8 — PRECISION RADAR ALIGNMENT',
      machineType: 'SATELLITE',
      machineName: 'PRECISION TELECOM RADAR',
      targetType: 'PRECISION',
      targetMin: 115,
      targetMax: 135,
      initialAngle: 40,
      missionText: 'CALIBRATE RADAR: SET ANGLE BETWEEN 115° AND 135°',
      targetBadge: '115° - 135° (OBTUSE)',
      timeLimit: 45,
      description: 'Carefully calibrate the satellite into the target green zone.'
    },
    // Round 9 — Machine Combo (2 Machines)
    {
      round: 9,
      title: 'ROUND 9 — DUAL MACHINE COMBO',
      multiMachines: [
        { type: 'ROBOTIC_ARM', name: 'SERVO 1', targetType: 'ACUTE', min: 15, max: 85, init: 140, prompt: 'SET SERVO 1 TO AN ANGLE LESS THAN 90°' },
        { type: 'MECHANICAL_DOOR', name: 'DOOR 2', targetType: 'OBTUSE', min: 95, max: 165, init: 30, prompt: 'OPEN DOOR 2 TO AN ANGLE GREATER THAN 90°' }
      ],
      timeLimit: 50,
      description: 'Two machines are broken! Switch between them to calibrate both.'
    },
    // Round 10 — Master Mechanic (3 Machines Finale)
    {
      round: 10,
      title: 'ROUND 10 — MASTER MECHANIC FINALE',
      multiMachines: [
        { type: 'CRANE', name: 'CRANE A', targetType: 'ACUTE', min: 20, max: 80, init: 135, prompt: 'CRANE A: SET TO ACUTE (< 90°)' },
        { type: 'DRAWBRIDGE', name: 'BRIDGE B', targetType: 'OBTUSE', min: 100, max: 160, init: 25, prompt: 'BRIDGE B: SET TO OBTUSE (> 90°)' },
        { type: 'ROBOTIC_ARM', name: 'SERVO C', targetType: 'ACUTE', min: 25, max: 85, init: 150, prompt: 'SERVO C: SET TO ACUTE (< 90°)' }
      ],
      timeLimit: 60,
      description: 'All factory units need repair! Complete all 3 machines before the timer expires!'
    }
  ];

  // ==========================================================================
  // 6. MAIN GAME STATE & CONTROLLER
  // ==========================================================================

  const gameState = {
    screen: 'START', // START, HOW_TO_PLAY, PLAYING, PAUSED, GAMEOVER, VICTORY
    currentRoundIndex: 0,
    score: 0,
    lives: 3,
    maxLives: 3,
    streak: 1,
    maxStreak: 1,
    timeRemaining: 60,
    totalTimeSpent: 0,
    roundActive: false,
    roundSuccessCount: 0,

    // Active Machines on Canvas
    machines: [],
    activeMachineIndex: 0,

    // Character & FX
    character: new MechanicCharacter(),
    particles: new ParticleSystem(),

    // Canvas & Viewport
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    scale: 1,

    // Input state
    isPointerDown: false,
    draggedMachine: null,
    lastFrameTime: performance.now(),
    feedbackTimer: null
  };

  // ==========================================================================
  // 7. INITIALIZATION & RESIZE MANAGEMENT
  // ==========================================================================

  function initDOM() {
    gameState.canvas = document.getElementById('game-canvas');
    if (!gameState.canvas) return;
    gameState.ctx = gameState.canvas.getContext('2d');

    // Resize canvas on window changes
    window.addEventListener('resize', handleResize);
    handleResize();

    // DOM Controls Binding
    bindUIEvents();

    // Setup Start Screen
    setScreen('START');
  }

  function handleResize() {
    const gameplayArea = document.getElementById('gameplay-area');
    if (!gameplayArea || !gameState.canvas) return;

    const rect = gameplayArea.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    gameState.width = rect.width;
    gameState.height = rect.height;

    gameState.canvas.width = rect.width * dpr;
    gameState.canvas.height = rect.height * dpr;

    gameState.ctx.resetTransform();
    gameState.ctx.scale(dpr, dpr);

    // Reposition active machines based on new canvas size
    layoutMachines();
  }

  function layoutMachines() {
    const count = gameState.machines.length;
    if (count === 0) return;

    const groundY = gameState.height * 0.72;
    const availableWidth = gameState.width;

    if (count === 1) {
      const m = gameState.machines[0];
      m.cx = availableWidth * 0.52;
      m.cy = groundY - 20;
      m.armLength = Math.min(availableWidth * 0.28, gameState.height * 0.38, 170);
      gameState.character.setTargetX(m.cx - m.armLength * 0.85);
    } else if (count === 2) {
      const spacing = availableWidth / 3;
      gameState.machines.forEach((m, idx) => {
        m.cx = spacing * (idx + 1);
        m.cy = groundY - 15;
        m.armLength = Math.min(availableWidth * 0.18, gameState.height * 0.28, 120);
      });
      const activeM = gameState.machines[gameState.activeMachineIndex];
      if (activeM) gameState.character.setTargetX(activeM.cx - 60);
    } else if (count >= 3) {
      const spacing = availableWidth / (count + 1);
      gameState.machines.forEach((m, idx) => {
        m.cx = spacing * (idx + 1);
        m.cy = groundY - 10;
        m.armLength = Math.min(availableWidth * 0.14, gameState.height * 0.24, 95);
      });
      const activeM = gameState.machines[gameState.activeMachineIndex];
      if (activeM) gameState.character.setTargetX(activeM.cx - 50);
    }
  }

  // ==========================================================================
  // 8. SCREEN STATE MANAGEMENT
  // ==========================================================================

  function setScreen(newScreen) {
    gameState.screen = newScreen;

    // Hide all modal overlays
    const modals = [
      'start-screen',
      'how-to-play-modal',
      'pause-modal',
      'game-over-modal',
      'victory-modal'
    ];
    modals.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    if (newScreen === 'START') {
      document.getElementById('start-screen')?.classList.add('active');
    } else if (newScreen === 'HOW_TO_PLAY') {
      document.getElementById('how-to-play-modal')?.classList.add('active');
    } else if (newScreen === 'PAUSED') {
      document.getElementById('pause-score').textContent = gameState.score;
      document.getElementById('pause-round').textContent = `${gameState.currentRoundIndex + 1} / 10`;
      document.getElementById('pause-streak').textContent = `${gameState.streak}x`;
      document.getElementById('pause-modal')?.classList.add('active');
    } else if (newScreen === 'GAMEOVER') {
      audio.playErrorBuzz();
      document.getElementById('gameover-score').textContent = String(gameState.score).padStart(6, '0');
      document.getElementById('gameover-rounds').textContent = `${gameState.roundSuccessCount} / 10`;
      document.getElementById('gameover-streak').textContent = `${gameState.maxStreak}x`;
      document.getElementById('gameover-time').textContent = `${Math.round(gameState.totalTimeSpent)}s`;
      document.getElementById('game-over-modal')?.classList.add('active');

      // Stucent End Hook (Guarded Single Fire)
      if (!gameState.hasReportedEnd && gameGlobal && typeof gameGlobal.end === 'function') {
        gameState.hasReportedEnd = true;
        const maxPoints = (gameGlobal.config && gameGlobal.config.maxPoints) || 100;
        const scaledScore = Math.min(maxPoints * 2, Math.round((gameState.score * maxPoints) / 2500));
        gameGlobal.end({
          score: scaledScore,
          maxScore: maxPoints,
          timeTaken: Math.round(gameState.totalTimeSpent * 1000),
          success: false
        });
      }
    } else if (newScreen === 'VICTORY') {
      audio.playVictoryFanfare();
      document.getElementById('victory-score').textContent = String(gameState.score).padStart(6, '0');
      document.getElementById('victory-rounds').textContent = '10 / 10';
      document.getElementById('victory-streak').textContent = `${gameState.maxStreak}x`;
      document.getElementById('victory-time').textContent = `${Math.round(gameState.totalTimeSpent)}s`;
      document.getElementById('victory-modal')?.classList.add('active');

      // Stucent End Hook (Guarded Single Fire)
      if (!gameState.hasReportedEnd && gameGlobal && typeof gameGlobal.end === 'function') {
        gameState.hasReportedEnd = true;
        const maxPoints = (gameGlobal.config && gameGlobal.config.maxPoints) || 100;
        const scaledScore = Math.min(maxPoints * 2, Math.round((gameState.score * maxPoints) / 2500));
        gameGlobal.end({
          score: scaledScore,
          maxScore: maxPoints,
          timeTaken: Math.round(gameState.totalTimeSpent * 1000),
          success: true
        });
      }
    }
  }

  // ==========================================================================
  // 9. GAMEPLAY SETUP & ROUND PROGRESSION
  // ==========================================================================

  function startNewGame() {
    gameState.score = 0;
    gameState.lives = gameState.maxLives;
    gameState.streak = 1;
    gameState.maxStreak = 1;
    gameState.currentRoundIndex = 0;
    gameState.totalTimeSpent = 0;
    gameState.roundSuccessCount = 0;

    updateHUD();
    loadRound(0);
    setScreen('PLAYING');
  }

  function loadRound(roundIndex) {
    if (roundIndex >= ROUND_CONFIGS.length) {
      setScreen('VICTORY');
      return;
    }

    gameState.currentRoundIndex = roundIndex;
    const cfg = ROUND_CONFIGS[roundIndex];
    gameState.timeRemaining = cfg.timeLimit || 60;
    gameState.roundActive = true;
    gameState.machines = [];
    gameState.activeMachineIndex = 0;

    // Single machine round
    if (!cfg.multiMachines) {
      let targetType = cfg.targetType;
      let minDeg = cfg.targetMin;
      let maxDeg = cfg.targetMax;
      let missionText = cfg.missionText;
      let targetBadge = cfg.targetBadge;

      // Handle Round 5 randomized selection (Varied Phrasing)
      if (targetType === 'RANDOM') {
        const isAcute = Math.random() > 0.5;
        if (isAcute) {
          targetType = 'ACUTE';
          minDeg = 15;
          maxDeg = 85;
          missionText = 'CREATE AN ANGLE LESS THAN 90°';
          targetBadge = '< 90° (ACUTE)';
        } else {
          targetType = 'OBTUSE';
          minDeg = 95;
          maxDeg = 165;
          missionText = 'CREATE AN ANGLE GREATER THAN 90°';
          targetBadge = '> 90° (OBTUSE)';
        }
      }

      const m = new Machine(
        'machine-1',
        cfg.machineType,
        cfg.machineName,
        gameState.width * 0.52,
        gameState.height * 0.65,
        150,
        0
      );
      m.currentAngleDeg = cfg.initialAngle;
      m.setTarget(targetType, minDeg, maxDeg);
      if (cfg.isOscillating) {
        m.isOscillating = true;
      }
      gameState.machines.push(m);

      // Update Mission Banner
      document.getElementById('banner-machine-tag').textContent = cfg.machineName;
      document.getElementById('banner-text').textContent = missionText;
      document.getElementById('target-badge-val').textContent = targetBadge;

      // Hide multi-machine tabs
      const tabsEl = document.getElementById('multi-machine-tabs');
      if (tabsEl) tabsEl.classList.add('hidden');
    } else {
      // Multi-machine round (Round 9 and Round 10)
      cfg.multiMachines.forEach((mCfg, idx) => {
        const m = new Machine(
          `machine-${idx + 1}`,
          mCfg.type,
          mCfg.name,
          0,
          0,
          110,
          0
        );
        m.currentAngleDeg = mCfg.init;
        m.setTarget(mCfg.targetType, mCfg.min, mCfg.max);
        gameState.machines.push(m);
      });

      // Update Mission Banner
      document.getElementById('banner-machine-tag').textContent = `COMBO: ${cfg.multiMachines.length} MACHINES`;
      document.getElementById('banner-text').textContent = 'REPAIR ALL MACHINES BEFORE TIME RUNS OUT!';
      document.getElementById('target-badge-val').textContent = 'COMBO';

      // Setup Multi-Machine Tabs
      renderMultiMachineTabs();
    }

    layoutMachines();
    updateSliderAndAngleHUD();
    updateHUD();

    // Animate banner entry
    const banner = document.getElementById('mission-instruction-banner');
    if (banner) {
      banner.style.animation = 'none';
      void banner.offsetWidth; // Trigger reflow
      banner.style.animation = 'pulse 0.4s ease';
    }
  }

  function renderMultiMachineTabs() {
    const tabsEl = document.getElementById('multi-machine-tabs');
    if (!tabsEl) return;

    tabsEl.innerHTML = '';
    tabsEl.classList.remove('hidden');

    gameState.machines.forEach((m, idx) => {
      const btn = document.createElement('button');
      btn.className = `machine-tab-btn ${idx === gameState.activeMachineIndex ? 'active' : ''} ${m.isActivated ? 'completed' : ''}`;
      btn.innerHTML = `<span>${m.isActivated ? '✓' : '⚙️'}</span> <span>${m.name}: ${m.targetType}</span>`;
      btn.addEventListener('click', () => {
        setActiveMachine(idx);
      });
      tabsEl.appendChild(btn);
    });
  }

  function setActiveMachine(index) {
    if (index < 0 || index >= gameState.machines.length) return;
    gameState.activeMachineIndex = index;
    const activeM = gameState.machines[index];
    gameState.character.setTargetX(activeM.cx - 60);

    // Update Banner to show active machine requirement with clear target phrasing
    const targetLabel = activeM.targetType === 'ACUTE' ? '< 90° (ACUTE)' : (activeM.targetType === 'OBTUSE' ? '> 90° (OBTUSE)' : `${activeM.targetMinDeg}° - ${activeM.targetMaxDeg}°`);
    document.getElementById('banner-machine-tag').textContent = activeM.name;
    document.getElementById('banner-text').textContent = `SET ${activeM.name} TO ${targetLabel}`;
    document.getElementById('target-badge-val').textContent = targetLabel;

    renderMultiMachineTabs();
    updateSliderAndAngleHUD();
  }

  // ==========================================================================
  // 10. ANGLE TESTING & REPAIR LOGIC
  // ==========================================================================

  function handleLockAndTest() {
    if (gameState.screen !== 'PLAYING' || !gameState.roundActive) return;

    const activeM = gameState.machines[gameState.activeMachineIndex];
    if (!activeM || activeM.isLocked) return;

    audio.playLockSound();

    const isSuccess = activeM.checkSuccess();
    const currentDeg = activeM.currentAngleDeg;

    if (isSuccess) {
      // SUCCESS!
      activeM.isLocked = true;
      activeM.isActivated = true;
      audio.playMachinePowerUp();
      audio.playSuccessJingle(gameState.streak);

      // Trigger Character animations & particles
      gameState.character.triggerRepair();
      setTimeout(() => gameState.character.triggerCelebrate(), 350);

      // Score and streak calculation
      const pointsEarned = 100 * gameState.streak;
      gameState.score += pointsEarned;
      gameState.streak = Math.min(5, gameState.streak + 1);
      if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
      }

      const tip = activeM.getTipPos();
      gameState.particles.spawnSparks(activeM.cx, activeM.cy, 35, '#10b981');
      gameState.particles.spawnSteam(tip.x, tip.y, 20);
      gameState.particles.spawnFloatingText(`✓ LOCKED! +${pointsEarned}`, tip.x, tip.y - 20, '#10b981', 1.2);

      showFeedbackPopup(true, 'ANGLE LOCKED!', `MACHINE ACTIVATED • +${pointsEarned} PTS`);

      // Check if all machines in current round are repaired
      const allFixed = gameState.machines.every(m => m.isActivated);
      if (allFixed) {
        gameState.roundSuccessCount++;
        gameState.roundActive = false;

        setTimeout(() => {
          loadRound(gameState.currentRoundIndex + 1);
        }, 1350);
      } else {
        // Switch to next unfixed machine
        renderMultiMachineTabs();
        const nextIndex = gameState.machines.findIndex(m => !m.isActivated);
        if (nextIndex !== -1) {
          setTimeout(() => setActiveMachine(nextIndex), 700);
        }
      }
    } else {
      // WRONG ANGLE — Educational Diagnostic Feedback
      audio.playErrorBuzz();
      gameState.streak = 1; // Reset streak
      gameState.lives = Math.max(0, gameState.lives - 1);
      gameState.character.triggerConfused();

      const tip = activeM.getTipPos();
      gameState.particles.spawnSparks(tip.x, tip.y, 15, '#ef4444');

      let errorMsg = 'INCORRECT ANGLE';
      let errorSub = 'Adjust the mechanism and try again.';

      if (activeM.targetType === 'ACUTE') {
        if (currentDeg === 90) {
          errorMsg = '90° IS A RIGHT ANGLE!';
          errorSub = 'Acute angles must be strictly LESS than 90°. Make it sharper!';
        } else if (currentDeg > 90) {
          errorMsg = 'TOO WIDE! THAT IS OBTUSE.';
          errorSub = `${currentDeg}° is Obtuse (> 90°). Rotate down below 90° for Acute!`;
        }
      } else if (activeM.targetType === 'OBTUSE') {
        if (currentDeg === 90) {
          errorMsg = '90° IS A RIGHT ANGLE!';
          errorSub = 'Obtuse angles must be strictly GREATER than 90°. Open it wider!';
        } else if (currentDeg < 90) {
          errorMsg = 'TOO NARROW! THAT IS ACUTE.';
          errorSub = `${currentDeg}° is Acute (< 90°). Rotate wider past 90° for Obtuse!`;
        }
      } else if (activeM.targetType === 'PRECISION') {
        errorMsg = 'OUT OF TARGET RANGE!';
        errorSub = `Current: ${currentDeg}°. Target range is ${activeM.targetMinDeg}° to ${activeM.targetMaxDeg}°.`;
      }

      showFeedbackPopup(false, errorMsg, errorSub);

      if (gameState.lives <= 0) {
        gameState.roundActive = false;
        setTimeout(() => setScreen('GAMEOVER'), 1200);
      }
    }

    updateHUD();
  }

  function showFeedbackPopup(isSuccess, title, subtitle) {
    const popup = document.getElementById('feedback-popup');
    const icon = document.getElementById('feedback-icon');
    const titleEl = document.getElementById('feedback-title');
    const subEl = document.getElementById('feedback-subtitle');

    if (!popup) return;

    if (gameState.feedbackTimer) clearTimeout(gameState.feedbackTimer);

    popup.className = `feedback-popup ${isSuccess ? 'success' : 'error'} active`;
    if (icon) icon.textContent = isSuccess ? '✓' : '⚠️';
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subtitle;

    gameState.feedbackTimer = setTimeout(() => {
      popup.classList.remove('active');
    }, 2200);
  }

  // ==========================================================================
  // 11. HUD & CONTROL SYNCHRONIZATION
  // ==========================================================================

  function updateHUD() {
    // Score
    const scoreEl = document.getElementById('score-display');
    if (scoreEl) scoreEl.textContent = String(gameState.score).padStart(6, '0');

    // Round
    const roundEl = document.getElementById('round-display');
    if (roundEl) roundEl.textContent = `${String(gameState.currentRoundIndex + 1).padStart(2, '0')} / 10`;

    // Streak
    const streakEl = document.getElementById('streak-display');
    if (streakEl) streakEl.textContent = `${gameState.streak}x`;

    // Timer
    const timerEl = document.getElementById('timer-display');
    if (timerEl) timerEl.textContent = String(Math.ceil(gameState.timeRemaining)).padStart(3, '0');

    // Lives
    for (let i = 1; i <= gameState.maxLives; i++) {
      const heart = document.getElementById(`life-${i}`);
      if (heart) {
        if (i <= gameState.lives) {
          heart.className = 'arcade-life life-full';
        } else {
          heart.className = 'arcade-life life-lost';
        }
      }
    }

    updateSliderAndAngleHUD();
  }

  function updateSliderAndAngleHUD() {
    const activeM = gameState.machines[gameState.activeMachineIndex];
    if (!activeM) return;

    const deg = activeM.currentAngleDeg;

    // Angle display in HUD
    const angleHud = document.getElementById('angle-hud-display');
    if (angleHud) angleHud.textContent = `${deg}°`;

    // Type Badge in HUD
    const typeHud = document.getElementById('type-hud-display');
    if (typeHud) {
      if (deg < 90) {
        typeHud.textContent = 'ACUTE';
        typeHud.className = 'hud-value type-badge-acute';
      } else if (deg > 90) {
        typeHud.textContent = 'OBTUSE';
        typeHud.className = 'hud-value type-badge-obtuse';
      } else {
        typeHud.textContent = 'RIGHT (90°)';
        typeHud.className = 'hud-value type-badge-right';
      }
    }

    // Canvas Slider sync
    const slider = document.getElementById('angle-range-slider');
    if (slider && !gameState.isPointerDown) {
      slider.value = deg;
    }
  }

  function adjustActiveAngleBy(delta) {
    const activeM = gameState.machines[gameState.activeMachineIndex];
    if (!activeM || activeM.isLocked) return;

    const newDeg = activeM.currentAngleDeg + delta;
    activeM.setAngle(newDeg);
    audio.playRatchetClick(activeM.currentAngleDeg);
    updateSliderAndAngleHUD();
  }

  // ==========================================================================
  // 12. INPUT EVENT HANDLERS (POINTER, TOUCH & KEYBOARD)
  // ==========================================================================

  function bindUIEvents() {
    // Start Game
    document.getElementById('start-game-btn')?.addEventListener('click', () => {
      audio.init();
      startNewGame();
    });

    // How to Play buttons
    document.getElementById('how-to-play-btn')?.addEventListener('click', () => {
      audio.init();
      setScreen('HOW_TO_PLAY');
    });
    document.getElementById('hud-how-to-play-btn')?.addEventListener('click', () => {
      audio.init();
      setScreen('HOW_TO_PLAY');
    });
    document.getElementById('close-instructions-btn')?.addEventListener('click', () => {
      setScreen(gameState.roundActive ? 'PLAYING' : 'START');
    });
    document.getElementById('modal-start-btn')?.addEventListener('click', () => {
      if (gameState.roundActive) {
        setScreen('PLAYING');
      } else {
        startNewGame();
      }
    });

    // Pause & Resume
    document.getElementById('pause-btn')?.addEventListener('click', () => {
      if (gameState.screen === 'PLAYING') setScreen('PAUSED');
    });
    document.getElementById('resume-btn')?.addEventListener('click', () => {
      if (gameState.screen === 'PAUSED') setScreen('PLAYING');
    });
    document.getElementById('pause-restart-btn')?.addEventListener('click', () => {
      startNewGame();
    });

    // End Game Retry buttons
    document.getElementById('gameover-retry-btn')?.addEventListener('click', () => startNewGame());
    document.getElementById('victory-play-again-btn')?.addEventListener('click', () => startNewGame());

    // Sound Toggle
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
      audio.isMuted = !audio.isMuted;
      document.getElementById('sound-icon-on')?.classList.toggle('hidden', audio.isMuted);
      document.getElementById('sound-icon-off')?.classList.toggle('hidden', !audio.isMuted);
    });

    // Big Lock Lever & Button
    document.getElementById('btn-lock-angle')?.addEventListener('click', () => handleLockAndTest());
    document.getElementById('touch-btn-lock')?.addEventListener('click', () => handleLockAndTest());

    // Micro-tuning buttons
    document.getElementById('btn-deg-minus-5')?.addEventListener('click', () => adjustActiveAngleBy(-5));
    document.getElementById('btn-deg-minus-1')?.addEventListener('click', () => adjustActiveAngleBy(-1));
    document.getElementById('btn-deg-plus-1')?.addEventListener('click', () => adjustActiveAngleBy(1));
    document.getElementById('btn-deg-plus-5')?.addEventListener('click', () => adjustActiveAngleBy(5));

    // Touch Bar buttons
    document.getElementById('touch-btn-minus')?.addEventListener('click', () => adjustActiveAngleBy(-5));
    document.getElementById('touch-btn-plus')?.addEventListener('click', () => adjustActiveAngleBy(5));

    // Range Slider
    const slider = document.getElementById('angle-range-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const activeM = gameState.machines[gameState.activeMachineIndex];
        if (activeM && !activeM.isLocked) {
          activeM.setAngle(val);
          audio.playRatchetClick(val);
          updateSliderAndAngleHUD();
        }
      });
    }

    // Direct Canvas Pointer Dragging
    const canvas = gameState.canvas;
    if (canvas) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', handleKeyDown);
  }

  function getCanvasPointerPos(e) {
    const rect = gameState.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function handlePointerDown(e) {
    if (gameState.screen !== 'PLAYING' || !gameState.roundActive) return;
    audio.ensureContext();

    const pos = getCanvasPointerPos(e);
    gameState.isPointerDown = true;

    // Check if clicked near any machine's handle or base to select/drag
    for (let i = 0; i < gameState.machines.length; i++) {
      const m = gameState.machines[i];
      if (m.isLocked) continue;

      if (m.isPointNearHandle(pos.x, pos.y) || Math.hypot(pos.x - m.cx, pos.y - m.cy) < m.armLength + 30) {
        gameState.draggedMachine = m;
        setActiveMachine(i);
        updateAngleFromPointer(pos.x, pos.y, m);
        break;
      }
    }
  }

  function handlePointerMove(e) {
    if (!gameState.isPointerDown || !gameState.draggedMachine) return;
    const pos = getCanvasPointerPos(e);
    updateAngleFromPointer(pos.x, pos.y, gameState.draggedMachine);
  }

  function handlePointerUp() {
    gameState.isPointerDown = false;
    gameState.draggedMachine = null;
  }

  function updateAngleFromPointer(px, py, machine) {
    if (!machine || machine.isLocked) return;

    // Calculate angle in degrees from base horizontal (dx > 0, dy < 0)
    const dx = px - machine.cx;
    const dy = machine.cy - py; // Invert Y because canvas Y points downwards

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg = 0;
    if (deg > 180) deg = 180;

    const prevDeg = machine.currentAngleDeg;
    machine.setAngle(deg);

    if (Math.abs(machine.currentAngleDeg - prevDeg) >= 2) {
      audio.playRatchetClick(machine.currentAngleDeg);
    }

    updateSliderAndAngleHUD();
  }

  function handleKeyDown(e) {
    if (gameState.screen !== 'PLAYING') return;

    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      handleLockAndTest();
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      adjustActiveAngleBy(-3);
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      adjustActiveAngleBy(3);
    } else if (e.code === 'Digit1') {
      setActiveMachine(0);
    } else if (e.code === 'Digit2') {
      setActiveMachine(1);
    } else if (e.code === 'Digit3') {
      setActiveMachine(2);
    } else if (e.code === 'Tab') {
      e.preventDefault();
      const nextIdx = (gameState.activeMachineIndex + 1) % gameState.machines.length;
      setActiveMachine(nextIdx);
    } else if (e.code === 'KeyP' || e.code === 'Escape') {
      setScreen('PAUSED');
    }
  }

  // ==========================================================================
  // 13. WORKSHOP BACKGROUND RENDERING
  // ==========================================================================

  function renderWorkshopBackground(ctx, width, height) {
    const groundY = height * 0.72;

    // 1. Dark Industrial Workshop Wall Gradient
    const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    wallGrad.addColorStop(0, '#0a0f1a');
    wallGrad.addColorStop(0.5, '#111b2b');
    wallGrad.addColorStop(1, '#17253b');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, width, groundY);

    // Wall Paneling & Rivet Seams
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let x = 60; x < width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    // 2. Ceiling Girders & Overhead Crane Rail
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, 28);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(width, 28);
    ctx.stroke();

    // Hanging Industrial Lamp with ambient light cone
    const lampX = width * 0.5;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampX, 28);
    ctx.lineTo(lampX, 70);
    ctx.stroke();

    // Lamp shade
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(lampX - 18, 85);
    ctx.lineTo(lampX + 18, 85);
    ctx.lineTo(lampX + 10, 70);
    ctx.lineTo(lampX - 10, 70);
    ctx.closePath();
    ctx.fill();

    // Subtle ambient light cone
    const lightCone = ctx.createRadialGradient(lampX, 85, 20, lampX, groundY, 320);
    lightCone.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
    lightCone.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = lightCone;
    ctx.beginPath();
    ctx.moveTo(lampX, 85);
    ctx.lineTo(lampX - 220, groundY);
    ctx.lineTo(lampX + 220, groundY);
    ctx.closePath();
    ctx.fill();

    // 3. Rotating Background Gears
    renderBackgroundGear(ctx, width * 0.12, 100, 36, Date.now() * 0.0005);
    renderBackgroundGear(ctx, width * 0.12 + 48, 130, 24, -Date.now() * 0.00075);
    renderBackgroundGear(ctx, width * 0.88, 120, 42, Date.now() * 0.0004);

    // 4. Steam Pipes & Pressure Dials
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 140, width, 14);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 142, width, 10);

    // 5. Workshop Floor (Heavy Concrete & Hazard Striping)
    const floorGrad = ctx.createLinearGradient(0, groundY, 0, height);
    floorGrad.addColorStop(0, '#1e293b');
    floorGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Hazard Stripes on ground boundary
    ctx.fillStyle = '#f59e0b';
    for (let hx = 0; hx < width; hx += 24) {
      ctx.beginPath();
      ctx.moveTo(hx, groundY);
      ctx.lineTo(hx + 12, groundY);
      ctx.lineTo(hx + 4, groundY + 8);
      ctx.lineTo(hx - 8, groundY + 8);
      ctx.fill();
    }
  }

  function renderBackgroundGear(ctx, gx, gy, radius, angle) {
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.lineWidth = 1.5;

    const teeth = 10;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth;
      const aNext = ((i + 0.5) * Math.PI * 2) / teeth;
      ctx.arc(0, 0, radius + 5, a, aNext);
      ctx.arc(0, 0, radius, aNext, ((i + 1) * Math.PI * 2) / teeth);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gear hub hole
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0f1a';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // ==========================================================================
  // 14. MAIN GAME LOOP (UPDATE & RENDER)
  // ==========================================================================

  function gameLoop(currentTime) {
    const dt = Math.min(0.1, (currentTime - gameState.lastFrameTime) / 1000);
    gameState.lastFrameTime = currentTime;

    if (gameState.screen === 'PLAYING') {
      gameState.totalTimeSpent += dt;

      if (gameState.roundActive) {
        gameState.timeRemaining -= dt;
        if (gameState.timeRemaining <= 0) {
          gameState.timeRemaining = 0;
          gameState.roundActive = false;
          showFeedbackPopup(false, 'TIME EXPIRED!', 'The workshop ran out of power.');
          setTimeout(() => setScreen('GAMEOVER'), 1000);
        }
      }

      // Update character, machines, particles
      gameState.character.update(dt);
      gameState.machines.forEach(m => m.update(dt));
      gameState.particles.update();

      // Periodic timer & HUD refresh
      const timerEl = document.getElementById('timer-display');
      if (timerEl) timerEl.textContent = String(Math.ceil(gameState.timeRemaining)).padStart(3, '0');
    }

    // Render Canvas Frame
    render();

    requestAnimationFrame(gameLoop);
  }

  function render() {
    const ctx = gameState.ctx;
    if (!ctx) return;

    const width = gameState.width;
    const height = gameState.height;
    const groundY = height * 0.72;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw 2D Workshop Background
    renderWorkshopBackground(ctx, width, height);

    // 2. Draw Active Machines
    gameState.machines.forEach(m => m.render(ctx));

    // 3. Draw Mechanic Character ("Bolt")
    gameState.character.render(ctx, groundY);

    // 4. Draw Particles & FX
    gameState.particles.render(ctx);
  }

  // ==========================================================================
  // 15. STUCENT INTEGRATION HOOKS
  // ==========================================================================
  window.game = window.game || {};

  window.game.init = function(config) {
    window.game.config = config || {};
    console.log('[Angle Mechanic] Initialized with config:', config);
  };

  window.game.end = function(result) {
    console.log('[Angle Mechanic] Game Finished Result:', result);
  };

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDOM();
      requestAnimationFrame(gameLoop);
    });
  } else {
    initDOM();
    requestAnimationFrame(gameLoop);
  }

})();
