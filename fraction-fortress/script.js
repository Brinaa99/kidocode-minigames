/**
 * ============================================================================
 * FRACTION FORTRESS — STANDALONE EDUCATIONAL MINI-GAME
 * Topic: Understanding Fractions & Equal Parts (Standard 3 Mathematics)
 * ============================================================================
 *
 * Core Concept:
 * Real interactive exploration & structural rebuilding game.
 * Mathematics happens naturally through player actions:
 * EXPLORE → COLLECT PIECES → UNDERSTAND THE WHOLE → PLACE FRACTION → REBUILD → SCORE.
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER — ZERO EXTERNAL ASSETS)
  // ==========================================================================
  class FortressAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.initialized = false;
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

    playTone(freq, type, duration, startVol = 0.15, endVol = 0.001, pitchDrop = null) {
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

    playClick() {
      this.playTone(600, 'sine', 0.05, 0.1, 0.01, 300);
    }

    playStep() {
      this.playTone(160, 'triangle', 0.05, 0.03, 0.001, 80);
    }

    playPickUp() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [440, 659.25].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
    }

    playPlacePart() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Satisfying heavy stone placement thud + magic chime
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Chime
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.08);
      gain2.gain.setValueAtTime(0.15, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.3);
    }

    playWrong() {
      this.playTone(180, 'sawtooth', 0.2, 0.1, 0.01, 100);
    }

    playStructureComplete() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.16, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    }

    playGrandVictory() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const notes = [
        { f: 523.25, t: 0.0, d: 0.18 },
        { f: 659.25, t: 0.18, d: 0.18 },
        { f: 783.99, t: 0.36, d: 0.18 },
        { f: 1046.50, t: 0.54, d: 0.4 },
        { f: 880.00, t: 0.94, d: 0.2 },
        { f: 1046.50, t: 1.14, d: 0.8 }
      ];
      const now = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }
  }

  const audio = new FortressAudioEngine();

  // ==========================================================================
  // 2. ROUND DEFINITIONS (10 PROGRESSIVE FRACTION MISSIONS)
  // ==========================================================================
  const ROUNDS_CONFIG = [
    {
      roundNum: 1,
      title: 'Halves: Castle Wall',
      subtitle: 'Repair 1/2 of the fortress wall.',
      taskDesc: 'Repair 1/2 of the Castle Wall (1 of 2 equal sections).',
      structureType: 'wall',
      numerator: 1,
      denominator: 2,
      prefilled: 0,
      requiredPieces: 1,
      pieceType: 'stone',
      pieceName: 'Stone Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 2,
      title: 'Quarters: Watchtower',
      subtitle: 'Repair 1/4 of the watchtower.',
      taskDesc: 'Repair 1/4 of the Watchtower (1 of 4 equal tiers).',
      structureType: 'tower',
      numerator: 1,
      denominator: 4,
      prefilled: 0,
      requiredPieces: 1,
      pieceType: 'stone',
      pieceName: 'Tower Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 3,
      title: 'Three Quarters: Fortress Wall',
      subtitle: 'Repair 3/4 of the castle wall.',
      taskDesc: 'Repair 3/4 of the Castle Wall (3 of 4 equal sections).',
      structureType: 'wall',
      numerator: 3,
      denominator: 4,
      prefilled: 0,
      requiredPieces: 3,
      pieceType: 'stone',
      pieceName: 'Stone Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 4,
      title: 'Thirds: Royal Garden',
      subtitle: 'Repair 2/3 of the royal garden.',
      taskDesc: 'Repair 2/3 of the Garden (2 of 3 equal planting plots).',
      structureType: 'garden',
      numerator: 2,
      denominator: 3,
      prefilled: 0,
      requiredPieces: 2,
      pieceType: 'garden',
      pieceName: 'Flowerbed Tile',
      pieceIcon: '🌷'
    },
    {
      roundNum: 5,
      title: 'Fifths: Wooden Drawbridge',
      subtitle: 'Repair 3/5 of the bridge.',
      taskDesc: 'Repair 3/5 of the Drawbridge (3 of 5 equal wooden planks).',
      structureType: 'bridge',
      numerator: 3,
      denominator: 5,
      prefilled: 0,
      requiredPieces: 3,
      pieceType: 'wood',
      pieceName: 'Wooden Plank',
      pieceIcon: '🪵'
    },
    {
      roundNum: 6,
      title: 'Eighths: Fortress Battlements',
      subtitle: 'Repair 5/8 of the fortress wall.',
      taskDesc: 'Repair 5/8 of the Fortress Wall (5 of 8 equal sections).',
      structureType: 'wall',
      numerator: 5,
      denominator: 8,
      prefilled: 0,
      requiredPieces: 5,
      pieceType: 'stone',
      pieceName: 'Stone Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 7,
      title: 'Partially Completed Structure',
      subtitle: 'Complete 5/8 of the wall (3 sections already built).',
      taskDesc: 'Complete 5/8 of the Wall. 3 are built, so place 2 more!',
      structureType: 'wall',
      numerator: 5,
      denominator: 8,
      prefilled: 3, // 3 already filled
      requiredPieces: 2, // 5 - 3 = 2
      pieceType: 'stone',
      pieceName: 'Stone Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 8,
      title: 'Equivalent Fractions: 1/2 = 2/4',
      subtitle: 'Build one half of the bridge using 2 quarter planks.',
      taskDesc: 'Build 1/2 of the Bridge (Place 2 of 4 quarter planks: 1/2 = 2/4).',
      structureType: 'bridge',
      numerator: 2,
      denominator: 4,
      equivalentNote: '1/2 = 2/4',
      prefilled: 0,
      requiredPieces: 2,
      pieceType: 'wood',
      pieceName: 'Quarter Plank',
      pieceIcon: '🪵'
    },
    {
      roundNum: 9,
      title: 'Compare Visual Fractions',
      subtitle: 'Observe two towers and repair Tower B to reach 3/4.',
      taskDesc: 'Tower A has 2/4. Repair Tower B to 3/4 by placing 3 of 4 tiers.',
      structureType: 'tower',
      numerator: 3,
      denominator: 4,
      prefilled: 0,
      requiredPieces: 3,
      pieceType: 'stone',
      pieceName: 'Tower Block',
      pieceIcon: '🧱'
    },
    {
      roundNum: 10,
      title: 'Grand Finale: Master Fortress Restoration',
      subtitle: 'Rebuild all 4 damaged structures of the Grand Fortress!',
      taskDesc: 'Restore the entire fortress: Wall (3/4), Garden (2/3), Bridge (5/8), Tower (1/2)!',
      isMultiStructure: true,
      multiTargets: [
        { type: 'wall', num: 3, den: 4, piece: 'stone', label: 'Wall (3/4)' },
        { type: 'garden', num: 2, den: 3, piece: 'garden', label: 'Garden (2/3)' },
        { type: 'bridge', num: 5, den: 8, piece: 'wood', label: 'Bridge (5/8)' },
        { type: 'tower', num: 1, den: 2, piece: 'stone', label: 'Tower (1/2)' }
      ]
    }
  ];

  // ==========================================================================
  // 3. FORTRESS WORLD & STRUCTURES
  // ==========================================================================
  const WORLD = {
    width: 2200,
    height: 1600,
    depots: [
      { id: 'stone_quarry', type: 'stone', name: 'Stone Quarry', icon: '🧱', x: 400, y: 400, w: 140, h: 100 },
      { id: 'lumber_yard', type: 'wood', name: 'Lumber Yard', icon: '🪵', x: 400, y: 1200, w: 140, h: 100 },
      { id: 'garden_nursery', type: 'garden', name: 'Flower Nursery', icon: '🌷', x: 1800, y: 400, w: 140, h: 100 }
    ],
    castleMoat: { x: 1100, y: 1150, w: 500, h: 120 }
  };

  // ==========================================================================
  // 4. STRUCTURE COMPONENT CLASS (EQUAL FRACTION DIVISION)
  // ==========================================================================
  class FortressStructure {
    constructor(id, type, x, y, width, height, totalParts, targetParts, prefilled = 0, pieceType = 'stone') {
      this.id = id;
      this.type = type; // 'wall', 'tower', 'garden', 'bridge'
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.totalParts = totalParts; // Denominator
      this.targetParts = targetParts; // Numerator
      this.currentParts = prefilled;
      this.prefilled = prefilled;
      this.pieceType = pieceType;
      this.isCompleted = (this.currentParts >= this.targetParts);
      this.animTimer = 0;

      // Generate equal geometric slots
      this.slots = [];
      this.generateEqualSlots();
    }

    generateEqualSlots() {
      this.slots = [];
      const slotWidth = this.width / this.totalParts;

      for (let i = 0; i < this.totalParts; i++) {
        this.slots.push({
          index: i,
          x: this.x - this.width / 2 + i * slotWidth + slotWidth / 2,
          y: this.y,
          w: slotWidth - 4,
          h: this.height - 6,
          isFilled: i < this.prefilled,
          isTarget: i < this.targetParts
        });
      }
    }

    addPart() {
      if (this.currentParts < this.targetParts) {
        this.slots[this.currentParts].isFilled = true;
        this.currentParts++;
        this.animTimer = 0.5; // Trigger sparkle & snap animation

        if (this.currentParts >= this.targetParts) {
          this.isCompleted = true;
        }
        return true;
      }
      return false;
    }

    render(ctx) {
      ctx.save();

      if (this.type === 'wall') {
        this.renderWall(ctx);
      } else if (this.type === 'tower') {
        this.renderTower(ctx);
      } else if (this.type === 'garden') {
        this.renderGarden(ctx);
      } else if (this.type === 'bridge') {
        this.renderBridge(ctx);
      }

      ctx.restore();
    }

    renderWall(ctx) {
      // Wall Foundation
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(this.x - this.width/2 - 10, this.y - this.height/2 - 10, this.width + 20, this.height + 20, 10);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Equal Section Slots
      this.slots.forEach((s, idx) => {
        if (s.isFilled) {
          // Solid Repaired Stone Crenel
          ctx.fillStyle = (idx < this.prefilled) ? '#0284c7' : '#16a34a'; // Blue for prefilled, green for user placed
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 6);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Stone Brick Texture
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(s.x - s.w/2 + 4, s.y - s.h/2 + 4, s.w - 8, s.h/2 - 4);

          // Equal part label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        } else {
          // Broken / Damaged Empty Slot
          ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 6);
          ctx.fill();

          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = (s.isTarget) ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = (s.isTarget) ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        }
      });

      // Title Banner above structure
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(this.x - 70, this.y - this.height/2 - 34, 140, 22, 6);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`WALL: ${this.currentParts}/${this.totalParts} PARTS`, this.x, this.y - this.height/2 - 19);
    }

    renderTower(ctx) {
      // Tower vertical cylinder or tiered battlements
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(this.x - this.width/2 - 8, this.y - this.height/2 - 8, this.width + 16, this.height + 16, 8);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();

      this.slots.forEach((s, idx) => {
        if (s.isFilled) {
          ctx.fillStyle = (idx < this.prefilled) ? '#0284c7' : '#16a34a';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 6);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        } else {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 6);
          ctx.fill();

          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = (s.isTarget) ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        }
      });

      // Roof conical turret
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.height/2 - 35);
      ctx.lineTo(this.x - this.width/2 - 4, this.y - this.height/2 - 8);
      ctx.lineTo(this.x + this.width/2 + 4, this.y - this.height/2 - 8);
      ctx.closePath();
      ctx.fill();

      // Flag
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(this.x, this.y - this.height/2 - 50, 3, 16);
      ctx.beginPath();
      ctx.moveTo(this.x + 3, this.y - this.height/2 - 50);
      ctx.lineTo(this.x + 18, this.y - this.height/2 - 44);
      ctx.lineTo(this.x + 3, this.y - this.height/2 - 38);
      ctx.closePath();
      ctx.fill();
    }

    renderGarden(ctx) {
      // Garden Soil bed
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(this.x - this.width/2 - 8, this.y - this.height/2 - 8, this.width + 16, this.height + 16, 12);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.stroke();

      this.slots.forEach((s) => {
        if (s.isFilled) {
          // Lush blooming flowers
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 8);
          ctx.fill();
          ctx.strokeStyle = '#86efac';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Flowers
          ['#ec4899', '#facc15', '#38bdf8'].forEach((col, fi) => {
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(s.x - 12 + fi * 12, s.y, 6, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y + 18);
        } else {
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 8);
          ctx.fill();

          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        }
      });
    }

    renderBridge(ctx) {
      // Wooden bridge spans over moat
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(this.x - this.width/2 - 12, this.y - this.height/2 - 6, this.width + 24, this.height + 12);

      this.slots.forEach((s) => {
        if (s.isFilled) {
          // Sturdy Wooden Planks
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 4);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Wood grain line
          ctx.fillStyle = '#78350f';
          ctx.fillRect(s.x - s.w/2 + 2, s.y, s.w - 4, 3);

          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        } else {
          // Water showing through broken bridge
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h);

          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.strokeRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h);
          ctx.setLineDash([]);

          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`1/${this.totalParts}`, s.x, s.y);
        }
      });
    }
  }

  // ==========================================================================
  // 5. PLAYER BUILDER CLASS ("SIR FRACTION")
  // ==========================================================================
  class BuilderPlayer {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.speed = 4.5;
      this.facing = 1;
      this.animFrame = 0;
      this.isWalking = false;
      this.heldPiece = null; // null or { type: 'stone'|'wood'|'garden', name: 'Stone Block', icon: '🧱' }
      this.targetX = null;
      this.targetY = null;
    }

    update(dt, inputState) {
      let moveX = 0;
      let moveY = 0;

      if (inputState.keys['KeyW'] || inputState.keys['ArrowUp']) moveY -= 1;
      if (inputState.keys['KeyS'] || inputState.keys['ArrowDown']) moveY += 1;
      if (inputState.keys['KeyA'] || inputState.keys['ArrowLeft']) moveX -= 1;
      if (inputState.keys['KeyD'] || inputState.keys['ArrowRight']) moveX += 1;

      if (inputState.joystick.active) {
        moveX = inputState.joystick.dx;
        moveY = inputState.joystick.dy;
        this.targetX = null;
      }

      // Tap-to-move
      if (this.targetX !== null && this.targetY !== null && !inputState.joystick.active && moveX === 0 && moveY === 0) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          moveX = dx / dist;
          moveY = dy / dist;
        } else {
          this.targetX = null;
          this.targetY = null;
        }
      }

      if (moveX !== 0 || moveY !== 0) {
        const len = Math.hypot(moveX, moveY);
        const normX = moveX / (len > 1 ? len : 1);
        const normY = moveY / (len > 1 ? len : 1);

        this.vx = normX * this.speed;
        this.vy = normY * this.speed;
        this.isWalking = true;
        this.animFrame += dt * 14;

        if (moveX > 0.05) this.facing = 1;
        if (moveX < -0.05) this.facing = -1;

        if (Math.floor(this.animFrame) % 4 === 0 && Math.random() < 0.15) {
          audio.playStep();
        }
      } else {
        this.vx *= 0.7;
        this.vy *= 0.7;
        this.isWalking = false;
      }

      this.x = Math.max(50, Math.min(WORLD.width - 50, this.x + this.vx));
      this.y = Math.max(50, Math.min(WORLD.height - 50, this.y + this.vy));
    }

    render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 18, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(this.facing, 1);

      const bob = this.isWalking ? Math.sin(this.animFrame) * 2.5 : Math.sin(Date.now() * 0.003) * 1;
      const legSwing = this.isWalking ? Math.sin(this.animFrame) * 8 : 0;

      // Legs
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8 + legSwing * 0.5, 8, 6, 12);
      ctx.fillRect(2 - legSwing * 0.5, 8, 6, 12);

      // Boots
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-10 + legSwing * 0.5, 18, 8, 4);
      ctx.fillRect(1 - legSwing * 0.5, 18, 8, 4);

      // Builder Tunic (Royal Blue)
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.roundRect(-11, -8 + bob, 22, 18, 4);
      ctx.fill();

      // Tool Belt & Buckle
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-11, 4 + bob, 22, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-3, 3 + bob, 6, 6);

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -16 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -17 + bob, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Golden Builder Helmet
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -22 + bob, 11, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-12, -22 + bob, 24, 4);

      // Held Item Rendered Above Head
      if (this.heldPiece) {
        ctx.save();
        ctx.translate(0, -42 + bob);

        // Halo / Glow
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Block box
        if (this.heldPiece.type === 'stone') {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(-12, -10, 24, 20);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-12, -10, 24, 20);
        } else if (this.heldPiece.type === 'wood') {
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-14, -8, 28, 16);
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-14, -8, 28, 16);
        } else if (this.heldPiece.type === 'garden') {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(-12, -10, 24, 20);
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. MAIN GAME ENGINE
  // ==========================================================================
  class FractionFortressGame {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');

      // Screens & Modals
      this.screenTitle = document.getElementById('screen-title');
      this.screenGameOver = document.getElementById('screen-game-over');
      this.modalInstructions = document.getElementById('modal-instructions');
      this.modalRoundComplete = document.getElementById('modal-round-complete');
      this.hud = document.getElementById('hud');
      this.interactPrompt = document.getElementById('interact-prompt');
      this.promptText = document.getElementById('prompt-text');
      this.promptIcon = document.getElementById('prompt-icon');
      this.toastContainer = document.getElementById('toast-container');
      this.touchControls = document.getElementById('touch-controls');

      // HUD elements
      this.hudRound = document.getElementById('hud-round');
      this.hudScore = document.getElementById('hud-score');
      this.hudLives = document.getElementById('hud-lives');
      this.missionText = document.getElementById('mission-text');
      this.fractionNum = document.getElementById('fraction-numerator');
      this.fractionDen = document.getElementById('fraction-denominator');
      this.equalPartsSlots = document.getElementById('equal-parts-slots');
      this.equalBarTitle = document.getElementById('equal-bar-title');
      this.heldItemDisplay = document.getElementById('held-item-display');
      this.heldItemIcon = document.getElementById('held-item-icon');
      this.heldItemName = document.getElementById('held-item-name');

      // Game state
      this.currentRoundIdx = 0;
      this.score = 0;
      this.lives = 3;
      this.structuresRepaired = 0;
      this.gameStartTime = 0;
      this.roundStartTime = 0;
      this.isGameRunning = false;
      this.isRoundActive = false;

      // Entities
      this.player = new BuilderPlayer(1100, 800);
      this.structures = [];
      this.activeStructure = null;
      this.nearbyDepot = null;
      this.nearbyStructure = null;

      // Input State
      this.inputState = {
        keys: {},
        joystick: { active: false, dx: 0, dy: 0, touchId: null }
      };

      this.camera = { x: 1100, y: 800 };

      // Initialize
      this.initEventListeners();
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      this.lastTime = performance.now();
      requestAnimationFrame(time => this.mainLoop(time));
    }

    handleResize() {
      const dpr = window.devicePixelRatio || 1;
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch && this.isGameRunning) {
        this.touchControls.classList.remove('hidden');
      } else {
        this.touchControls.classList.add('hidden');
      }
    }

    initEventListeners() {
      window.addEventListener('keydown', e => {
        this.inputState.keys[e.code] = true;

        if (e.code === 'Space' || e.code === 'KeyE') {
          if (this.isRoundActive && !this.isModalOpen()) {
            this.handleAction();
          }
        }

        if (e.code === 'Escape') {
          this.closeAllModals();
        }
      });

      window.addEventListener('keyup', e => {
        this.inputState.keys[e.code] = false;
      });

      // Canvas Pointer Click / Tap
      this.canvas.addEventListener('pointerdown', e => {
        if (!this.isRoundActive || this.isModalOpen()) return;

        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const worldX = screenX - this.width / 2 + this.camera.x;
        const worldY = screenY - this.height / 2 + this.camera.y;

        // Check if clicked depot or structure
        let clicked = false;

        // Depot click
        WORLD.depots.forEach(d => {
          if (worldX > d.x - d.w/2 && worldX < d.x + d.w/2 && worldY > d.y - d.h/2 && worldY < d.y + d.h/2) {
            this.player.targetX = d.x;
            this.player.targetY = d.y + 60;
            clicked = true;
          }
        });

        // Structure click
        this.structures.forEach(s => {
          if (worldX > s.x - s.width/2 && worldX < s.x + s.width/2 && worldY > s.y - s.height/2 && worldY < s.y + s.height/2) {
            this.player.targetX = s.x;
            this.player.targetY = s.y + 70;
            clicked = true;
          }
        });

        if (!clicked) {
          this.player.targetX = worldX;
          this.player.targetY = worldY;
        }
      });

      // UI Buttons
      document.getElementById('btn-start-game').addEventListener('click', () => {
        audio.playClick();
        this.startGame();
      });

      document.getElementById('btn-how-to-play').addEventListener('click', () => {
        audio.playClick();
        this.modalInstructions.classList.remove('hidden');
      });

      document.getElementById('btn-close-instructions').addEventListener('click', () => {
        audio.playClick();
        this.modalInstructions.classList.add('hidden');
      });

      document.getElementById('btn-instructions-gotit').addEventListener('click', () => {
        audio.playClick();
        this.modalInstructions.classList.add('hidden');
        if (!this.isGameRunning) this.startGame();
      });

      document.getElementById('btn-help').addEventListener('click', () => {
        audio.playClick();
        this.modalInstructions.classList.remove('hidden');
      });

      document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        document.getElementById('sound-icon').textContent = isMuted ? '🔇' : '🔊';
      });

      document.getElementById('btn-next-round').addEventListener('click', () => {
        audio.playClick();
        this.modalRoundComplete.classList.add('hidden');
        this.nextRound();
      });

      document.getElementById('btn-play-again').addEventListener('click', () => {
        audio.playClick();
        this.screenGameOver.classList.add('hidden');
        this.startGame();
      });

      document.getElementById('btn-touch-action').addEventListener('pointerdown', e => {
        e.preventDefault();
        this.handleAction();
      });

      this.initVirtualJoystick();
    }

    initVirtualJoystick() {
      const stick = document.getElementById('joystick-stick');
      const base = document.getElementById('joystick-base');
      const maxRadius = 40;

      const handleTouch = (clientX, clientY) => {
        const rect = base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxRadius) {
          dx = (dx / dist) * maxRadius;
          dy = (dy / dist) * maxRadius;
        }

        stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        this.inputState.joystick.active = true;
        this.inputState.joystick.dx = dx / maxRadius;
        this.inputState.joystick.dy = dy / maxRadius;
      };

      const resetStick = () => {
        stick.style.transform = 'translate(-50%, -50%)';
        this.inputState.joystick.active = false;
        this.inputState.joystick.dx = 0;
        this.inputState.joystick.dy = 0;
        this.inputState.joystick.touchId = null;
      };

      base.addEventListener('pointerdown', e => {
        e.preventDefault();
        this.inputState.joystick.touchId = e.pointerId;
        handleTouch(e.clientX, e.clientY);
      });

      window.addEventListener('pointermove', e => {
        if (this.inputState.joystick.touchId === e.pointerId) {
          handleTouch(e.clientX, e.clientY);
        }
      });

      window.addEventListener('pointerup', e => {
        if (this.inputState.joystick.touchId === e.pointerId) {
          resetStick();
        }
      });

      window.addEventListener('pointercancel', e => {
        if (this.inputState.joystick.touchId === e.pointerId) {
          resetStick();
        }
      });
    }

    isModalOpen() {
      return (
        !this.modalRoundComplete.classList.contains('hidden') ||
        !this.modalInstructions.classList.contains('hidden') ||
        !this.screenTitle.classList.contains('hidden') ||
        !this.screenGameOver.classList.contains('hidden')
      );
    }

    closeAllModals() {
      this.modalInstructions.classList.add('hidden');
    }

    // ========================================================================
    // 7. ROUNDS & MISSION LIFECYCLE
    // ========================================================================
    startGame() {
      this.screenTitle.classList.add('hidden');
      this.screenGameOver.classList.add('hidden');
      this.hud.classList.remove('hidden');

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) this.touchControls.classList.remove('hidden');

      this.score = 0;
      this.lives = 3;
      this.structuresRepaired = 0;
      this.currentRoundIdx = 0;
      this.gameStartTime = Date.now();
      this.isGameRunning = true;
      this.hasReportedEnd = false;

      this.startRound(this.currentRoundIdx);
    }

    startRound(idx) {
      this.currentRoundIdx = idx;
      const roundConfig = ROUNDS_CONFIG[idx];
      this.isRoundActive = true;
      this.roundStartTime = Date.now();

      // Reset Player position & held item
      this.player.x = 1100;
      this.player.y = 800;
      this.player.heldPiece = null;
      this.updateInventoryDisplay();

      // Build Structures for this round
      this.setupStructuresForRound(roundConfig);

      // Update HUD
      this.hudRound.textContent = `${roundConfig.roundNum}/10`;
      this.hudScore.textContent = this.score;
      this.updateLivesDisplay();
      this.updateMissionCard();

      this.showToast(`🏰 Round ${roundConfig.roundNum}: ${roundConfig.title}`, 'bonus');
    }

    setupStructuresForRound(roundConfig) {
      this.structures = [];

      if (roundConfig.isMultiStructure) {
        // Round 10: Multi-structure restoration
        roundConfig.multiTargets.forEach((t, i) => {
          const positions = [
            { x: 1100, y: 550, w: 360, h: 70 }, // North Wall
            { x: 1650, y: 800, w: 280, h: 80 }, // East Garden
            { x: 1100, y: 1200, w: 320, h: 75 }, // South Bridge
            { x: 550, y: 800, w: 200, h: 80 }   // West Tower
          ];
          const pos = positions[i];
          const st = new FortressStructure(`st_${t.type}`, t.type, pos.x, pos.y, pos.w, pos.h, t.den, t.num, 0, t.piece);
          this.structures.push(st);
        });
        this.activeStructure = this.structures[0];
      } else if (roundConfig.roundNum === 9) {
        // Round 9: Compare two towers
        const tA = new FortressStructure('tower_a', 'tower', 950, 750, 180, 75, 4, 2, 2, 'stone');
        const tB = new FortressStructure('tower_b', 'tower', 1250, 750, 180, 75, 4, 3, 0, 'stone');
        this.structures.push(tA, tB);
        this.activeStructure = tB;
      } else {
        // Single Structure
        const sType = roundConfig.structureType;
        let pos = { x: 1100, y: 800, w: 380, h: 75 };

        if (sType === 'wall') pos = { x: 1100, y: 750, w: 420, h: 75 };
        else if (sType === 'tower') pos = { x: 1100, y: 750, w: 260, h: 80 };
        else if (sType === 'garden') pos = { x: 1100, y: 750, w: 380, h: 80 };
        else if (sType === 'bridge') pos = { x: 1100, y: 1150, w: 400, h: 75 };

        const st = new FortressStructure(
          'main_structure',
          sType,
          pos.x,
          pos.y,
          pos.w,
          pos.h,
          roundConfig.denominator,
          roundConfig.numerator,
          roundConfig.prefilled || 0,
          roundConfig.pieceType
        );
        this.structures.push(st);
        this.activeStructure = st;
      }
    }

    updateMissionCard() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];

      if (roundConfig.isMultiStructure) {
        this.missionText.textContent = roundConfig.taskDesc;
        this.fractionNum.textContent = '4';
        this.fractionDen.textContent = '4';
        this.equalBarTitle.textContent = 'REBUILD 4 STRUCTURES:';

        let html = '';
        this.structures.forEach(s => {
          const isFilled = s.isCompleted;
          html += `<div class="equal-segment-slot ${isFilled ? 'filled' : ''}">${s.currentParts}/${s.targetParts}</div>`;
        });
        this.equalPartsSlots.innerHTML = html;
      } else {
        this.missionText.textContent = roundConfig.taskDesc;
        this.fractionNum.textContent = roundConfig.numerator;
        this.fractionDen.textContent = roundConfig.denominator;
        this.equalBarTitle.textContent = `WHOLE (${roundConfig.denominator} EQUAL PARTS):`;

        let html = '';
        for (let i = 0; i < roundConfig.denominator; i++) {
          const isPrefilled = i < (roundConfig.prefilled || 0);
          const isFilled = i < this.activeStructure.currentParts;
          const cls = isPrefilled ? 'prefilled' : (isFilled ? 'filled' : '');
          html += `<div class="equal-segment-slot ${cls}">1/${roundConfig.denominator}</div>`;
        }
        this.equalPartsSlots.innerHTML = html;
      }
    }

    updateInventoryDisplay() {
      if (this.player.heldPiece) {
        this.heldItemIcon.textContent = this.player.heldPiece.icon;
        this.heldItemName.textContent = this.player.heldPiece.name.toUpperCase();
        this.heldItemDisplay.className = 'held-item-active';
      } else {
        this.heldItemIcon.textContent = '✋';
        this.heldItemName.textContent = 'EMPTY';
        this.heldItemDisplay.className = 'held-item-empty';
      }
    }

    updateLivesDisplay() {
      let html = '';
      for (let i = 0; i < 3; i++) {
        html += `<span class="life-heart">${i < this.lives ? '❤️' : '🖤'}</span>`;
      }
      this.hudLives.innerHTML = html;
    }

    // ========================================================================
    // 8. INTERACTION & BUILDING MECHANICS
    // ========================================================================
    handleAction() {
      // 1. If near a material depot and inventory is empty -> Pick up block
      if (this.nearbyDepot && !this.player.heldPiece) {
        this.player.heldPiece = {
          type: this.nearbyDepot.type,
          name: this.nearbyDepot.name,
          icon: this.nearbyDepot.icon
        };
        audio.playPickUp();
        this.updateInventoryDisplay();
        this.showToast(`Picked up ${this.nearbyDepot.name}! Carry it to the structure.`, 'info');
        return;
      }

      // 2. If holding a block and near matching structure -> Place part!
      if (this.nearbyStructure && this.player.heldPiece) {
        if (this.player.heldPiece.type === this.nearbyStructure.pieceType) {
          if (this.nearbyStructure.currentParts < this.nearbyStructure.targetParts) {
            this.nearbyStructure.addPart();
            audio.playPlacePart();
            this.player.heldPiece = null;
            this.updateInventoryDisplay();
            this.addScore(10);
            this.updateMissionCard();
            this.showToast(`✨ Part placed! (${this.nearbyStructure.currentParts}/${this.nearbyStructure.totalParts}) +10 pts`, 'bonus');

            // Check if structure or round is complete
            this.checkRoundCompletion();
          } else {
            this.showToast('This structure already has the required fraction!', 'info');
          }
        } else {
          // Wrong piece type
          audio.playWrong();
          this.showToast(`This structure needs a ${this.nearbyStructure.pieceType} block!`, 'info');
        }
        return;
      }

      // 3. If near depot while holding item -> swap/drop
      if (this.nearbyDepot && this.player.heldPiece) {
        if (this.player.heldPiece.type !== this.nearbyDepot.type) {
          this.player.heldPiece = {
            type: this.nearbyDepot.type,
            name: this.nearbyDepot.name,
            icon: this.nearbyDepot.icon
          };
          audio.playPickUp();
          this.updateInventoryDisplay();
          this.showToast(`Swapped for ${this.nearbyDepot.name}!`, 'info');
        }
      }
    }

    checkRoundCompletion() {
      const allDone = this.structures.every(s => s.isCompleted);
      if (allDone) {
        this.completeRound();
      }
    }

    completeRound() {
      this.isRoundActive = false;
      this.structuresRepaired++;
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      const timeTaken = Math.max(1, Math.round((Date.now() - this.roundStartTime) / 1000));

      let roundBonus = 100;
      if (timeTaken < 30) roundBonus += 50; // Speed bonus
      if (this.currentRoundIdx === 9) roundBonus += 300; // Grand expedition bonus

      this.addScore(roundBonus);
      audio.playStructureComplete();

      if (this.currentRoundIdx >= ROUNDS_CONFIG.length - 1) {
        setTimeout(() => this.showFinalGameComplete(), 600);
        return;
      }

      // Populate round victory modal
      document.getElementById('round-complete-title').textContent = `${roundConfig.title} Restored!`;
      document.getElementById('celebration-fraction-text').textContent = `${roundConfig.numerator}/${roundConfig.denominator}`;
      document.getElementById('round-stat-parts').textContent = roundConfig.requiredPieces || roundConfig.numerator;
      document.getElementById('round-stat-score').textContent = `+${roundBonus}`;
      document.getElementById('round-stat-time').textContent = `${timeTaken}s`;
      document.getElementById('round-stat-prec').textContent = '100%';

      // Render celebration preview bar
      let barHtml = '';
      for (let i = 0; i < roundConfig.denominator; i++) {
        barHtml += `<div class="c-slot ${i < roundConfig.numerator ? 'filled' : ''}"></div>`;
      }
      document.getElementById('celebration-bar-preview').innerHTML = barHtml;

      this.modalRoundComplete.classList.remove('hidden');
    }

    nextRound() {
      if (this.currentRoundIdx < ROUNDS_CONFIG.length - 1) {
        this.startRound(this.currentRoundIdx + 1);
      } else {
        this.showFinalGameComplete();
      }
    }

    showFinalGameComplete() {
      this.isGameRunning = false;
      this.isRoundActive = false;
      audio.playGrandVictory();

      const totalTimeSec = Math.round((Date.now() - this.gameStartTime) / 1000);
      const mins = Math.floor(totalTimeSec / 60);
      const secs = totalTimeSec % 60;
      const formattedTime = `${mins}m ${secs}s`;

      document.getElementById('final-score').textContent = this.score.toLocaleString();
      document.getElementById('final-structures').textContent = `${this.structuresRepaired} / 10`;
      document.getElementById('final-fractions-count').textContent = '10 Types';
      document.getElementById('final-time').textContent = formattedTime;
      document.getElementById('final-accuracy').textContent = '100%';
      document.getElementById('final-rank').textContent = 'ROYAL GRAND ARCHITECT';

      this.screenGameOver.classList.remove('hidden');

      if (!this.hasReportedEnd) {
        this.hasReportedEnd = true;
        const maxPts = (window.game && window.game.config && window.game.config.maxPoints) || 100;
        const scaledScore = Math.round((this.score / 3500) * maxPts);

        if (window.game && typeof window.game.end === 'function') {
          window.game.end({
            score: scaledScore,
            maxScore: maxPts,
            timeTaken: totalTimeSec,
            success: true
          });
        }
      }
    }

    addScore(pts) {
      this.score += pts;
      this.hudScore.textContent = this.score;
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast-item ${type}`;
      toast.innerHTML = `<span>${message}</span>`;
      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 2200);
    }

    // ========================================================================
    // 9. MAIN LOOP & RENDERING
    // ========================================================================
    mainLoop(timestamp) {
      const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
      this.lastTime = timestamp;

      this.update(dt);
      this.render();

      requestAnimationFrame(time => this.mainLoop(time));
    }

    update(dt) {
      if (!this.isGameRunning || !this.isRoundActive) return;

      this.player.update(dt, this.inputState);

      // Camera lerp
      this.camera.x += (this.player.x - this.camera.x) * 0.1;
      this.camera.y += (this.player.y - this.camera.y) * 0.1;

      // Check proximity to Depots
      let closestDepot = null;
      let minDepotDist = 90;
      WORLD.depots.forEach(d => {
        const dist = Math.hypot(this.player.x - d.x, this.player.y - d.y);
        if (dist < minDepotDist) {
          closestDepot = d;
          minDepotDist = dist;
        }
      });
      this.nearbyDepot = closestDepot;

      // Check proximity to Structures
      let closestStructure = null;
      let minStructDist = 120;
      this.structures.forEach(s => {
        const dist = Math.hypot(this.player.x - s.x, this.player.y - s.y);
        if (dist < minStructDist) {
          closestStructure = s;
          minStructDist = dist;
        }
      });
      this.nearbyStructure = closestStructure;

      this.updateInWorldPrompt();
    }

    updateInWorldPrompt() {
      if (this.nearbyDepot && !this.player.heldPiece) {
        const screenX = this.nearbyDepot.x - this.camera.x + this.width / 2;
        const screenY = this.nearbyDepot.y - this.camera.y + this.height / 2 - 40;

        this.interactPrompt.style.left = `${screenX}px`;
        this.interactPrompt.style.top = `${screenY}px`;
        this.promptIcon.textContent = this.nearbyDepot.icon;
        this.promptText.textContent = `PICK UP ${this.nearbyDepot.name.toUpperCase()}`;
        this.interactPrompt.classList.remove('hidden');
      } else if (this.nearbyStructure && this.player.heldPiece) {
        const screenX = this.nearbyStructure.x - this.camera.x + this.width / 2;
        const screenY = this.nearbyStructure.y - this.camera.y + this.height / 2 - 50;

        this.interactPrompt.style.left = `${screenX}px`;
        this.interactPrompt.style.top = `${screenY}px`;
        this.promptIcon.textContent = '🔨';
        this.promptText.textContent = `PLACE PART (${this.nearbyStructure.currentParts + 1}/${this.nearbyStructure.totalParts})`;
        this.interactPrompt.classList.remove('hidden');
      } else {
        this.interactPrompt.classList.add('hidden');
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.translate(Math.round(this.width / 2 - this.camera.x), Math.round(this.height / 2 - this.camera.y));

      // 1. Draw Fortress Ground Courtyard
      this.renderCourtyard(ctx);

      // 2. Draw Material Depots
      this.renderDepots(ctx);

      // 3. Draw Damaged & Rebuilt Structures
      this.structures.forEach(s => s.render(ctx));

      // 4. Draw Player Builder
      this.player.render(ctx);

      ctx.restore();
    }

    renderCourtyard(ctx) {
      // Base slate stone floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);

      // Flagstone grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let x = 0; x < WORLD.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD.height);
        ctx.stroke();
      }
      for (let y = 0; y < WORLD.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD.width, y);
        ctx.stroke();
      }

      // Castle Moat Water Channel
      const m = WORLD.castleMoat;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(m.x - m.w/2, m.y - m.h/2, m.w, m.h, 20);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Water waves
      const time = Date.now() * 0.002;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(m.x + Math.sin(time) * 30, m.y, m.w * 0.4, 25, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    renderDepots(ctx) {
      WORLD.depots.forEach(d => {
        // Depot Base Platform
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(d.x - d.w/2, d.y - d.h/2, d.w, d.h, 12);
        ctx.fill();
        ctx.strokeStyle = (d.type === 'stone') ? '#94a3b8' : (d.type === 'wood' ? '#d97706' : '#22c55e');
        ctx.lineWidth = 3;
        ctx.stroke();

        // Stacked material piles
        for (let i = 0; i < 4; i++) {
          const ox = -30 + i * 20;
          const oy = -10 + (i % 2) * 15;

          if (d.type === 'stone') {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(d.x + ox, d.y + oy, 18, 14);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.strokeRect(d.x + ox, d.y + oy, 18, 14);
          } else if (d.type === 'wood') {
            ctx.fillStyle = '#b45309';
            ctx.fillRect(d.x + ox, d.y + oy, 24, 10);
          } else if (d.type === 'garden') {
            ctx.fillStyle = '#15803d';
            ctx.fillRect(d.x + ox, d.y + oy, 18, 14);
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(d.x + ox + 9, d.y + oy + 7, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Depot Label Banner
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(d.x - 65, d.y + d.h/2 - 12, 130, 22, 6);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.icon} ${d.name.toUpperCase()}`, d.x, d.y + d.h/2 + 3);
      });
    }
  }

  // ==========================================================================
  // 10. STUCENT INTEGRATION EXPORTS & BOOTSTRAP
  // ==========================================================================
  window.game = window.game || {};

  window.game.init = function(config) {
    window.game.config = config || {};
    console.log('[Fraction Fortress] Initialized with config:', config);
  };

  if (!window.game.end) {
    window.game.end = function(result) {
      console.log('[Fraction Fortress] Game finished with result:', result);
    };
  }

  let gameInstance = null;
  const initGame = () => {
    if (!gameInstance) {
      gameInstance = new FractionFortressGame();
      window.fractionFortressInstance = gameInstance;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
