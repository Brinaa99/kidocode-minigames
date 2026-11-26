/**
 * ============================================================================
 * DATA DETECTIVE — STANDALONE EDUCATIONAL MINI-GAME
 * Topic: Collecting and Recording Data (Standard 3 Mathematics)
 * ============================================================================
 *
 * Core Concept:
 * Real interactive exploration & data collection arcade game.
 * Mathematics happens naturally through player actions:
 * EXPLORE → OBSERVE → COUNT → RECORD (TALLIES) → ORGANIZE DATA → CHARTS → SCORE.
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER — ZERO EXTERNAL DEPENDENCIES)
  // ==========================================================================
  class DetectiveAudioEngine {
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
      this.playTone(180, 'triangle', 0.06, 0.04, 0.001, 90);
    }

    playObserve() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggio chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    }

    playTallyStroke() {
      // Crisp pencil scratch simulation
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1400, now + 0.07);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }

    playBundleComplete() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    }

    playStationEnter() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.14, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.3);
      });
    }

    playRoundComplete() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.18, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    }

    playGrandVictory() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const melody = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 523.25, t: 0.15, d: 0.15 },
        { f: 523.25, t: 0.3, d: 0.15 },
        { f: 659.25, t: 0.45, d: 0.3 },
        { f: 783.99, t: 0.75, d: 0.3 },
        { f: 1046.50, t: 1.05, d: 0.8 }
      ];
      const now = this.ctx.currentTime;
      melody.forEach(n => {
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

  const audio = new DetectiveAudioEngine();

  // ==========================================================================
  // 2. SPECIES DEFINITIONS & METADATA
  // ==========================================================================
  const SPECIES_CONFIG = {
    birds: {
      id: 'birds',
      name: 'Birds',
      singular: 'Bird',
      icon: '🐦',
      color: '#38bdf8',
      darkColor: '#0284c7',
      behavior: 'perch_fly',
      speed: 1.8,
      soundName: 'Chirp'
    },
    butterflies: {
      id: 'butterflies',
      name: 'Butterflies',
      singular: 'Butterfly',
      icon: '🦋',
      color: '#fbbf24',
      darkColor: '#d97706',
      behavior: 'flutter_meadow',
      speed: 1.4,
      soundName: 'Flutter'
    },
    rabbits: {
      id: 'rabbits',
      name: 'Rabbits',
      singular: 'Rabbit',
      icon: '🐇',
      color: '#f472b6',
      darkColor: '#db2777',
      behavior: 'hop_pause',
      speed: 2.2,
      soundName: 'Hop'
    },
    squirrels: {
      id: 'squirrels',
      name: 'Squirrels',
      singular: 'Squirrel',
      icon: '🐿️',
      color: '#34d399',
      darkColor: '#059669',
      behavior: 'scurry_tree',
      speed: 2.5,
      soundName: 'Scurry'
    }
  };

  // ==========================================================================
  // 3. ROUND CONFIGURATIONS (10 PROGRESSIVE EDUCATIONAL STAGES)
  // ==========================================================================
  const ROUNDS_CONFIG = [
    {
      roundNum: 1,
      title: 'Garden Birds Survey',
      subtitle: 'Find and observe all birds in the garden.',
      taskDesc: 'Explore the garden and observe all 4 Birds.',
      targetSpecies: ['birds'],
      spawns: [
        { type: 'birds', count: 4, zone: 'garden' }
      ],
      targets: { birds: 4 },
      timeLimit: 75,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Walk near each bird and press OBSERVE [Space/Tap].'
    },
    {
      roundNum: 2,
      title: 'Meadow Biodiversity',
      subtitle: 'Collect data from two different categories.',
      taskDesc: 'Observe 3 Birds and 4 Butterflies in the Flower Meadow.',
      targetSpecies: ['birds', 'butterflies'],
      spawns: [
        { type: 'birds', count: 3, zone: 'garden' },
        { type: 'butterflies', count: 4, zone: 'meadow' }
      ],
      targets: { birds: 3, butterflies: 4 },
      timeLimit: 80,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Butterflies hover near flower patches; birds perch near trees.'
    },
    {
      roundNum: 3,
      title: 'The Power of Five (Tally Bundling)',
      subtitle: 'Practice bundling tally marks into groups of 5.',
      taskDesc: 'Observe 6 Rabbits to create your first completed 5-tally bundle (||||/) + 1!',
      targetSpecies: ['rabbits'],
      spawns: [
        { type: 'rabbits', count: 6, zone: 'meadow' }
      ],
      targets: { rabbits: 6 },
      timeLimit: 85,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Notice how the 5th rabbit strikes a line across the 4 tallies!'
    },
    {
      roundNum: 4,
      title: 'Moving Wildlife Tracking',
      subtitle: 'Track agile animals on the move.',
      taskDesc: 'Track and record 4 moving Butterflies and 3 scurrying Squirrels.',
      targetSpecies: ['butterflies', 'squirrels'],
      spawns: [
        { type: 'butterflies', count: 4, zone: 'all' },
        { type: 'squirrels', count: 3, zone: 'grove' }
      ],
      targets: { butterflies: 4, squirrels: 3 },
      timeLimit: 90,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Follow their movement paths to get close enough to observe.'
    },
    {
      roundNum: 5,
      title: 'Tri-Species Park Survey',
      subtitle: 'Record data across three species categories.',
      taskDesc: 'Survey the park for 4 Birds, 3 Butterflies, and 3 Rabbits.',
      targetSpecies: ['birds', 'butterflies', 'rabbits'],
      spawns: [
        { type: 'birds', count: 4, zone: 'grove' },
        { type: 'butterflies', count: 3, zone: 'meadow' },
        { type: 'rabbits', count: 3, zone: 'pond' }
      ],
      targets: { birds: 4, butterflies: 3, rabbits: 3 },
      timeLimit: 95,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Check all park zones to find every specimen.'
    },
    {
      roundNum: 6,
      title: 'Habitat Comparison: North vs South',
      subtitle: 'Compare wildlife counts between two park zones.',
      taskDesc: 'Collect data in North Grove & South Pond, then compare them at the Station.',
      targetSpecies: ['birds', 'squirrels', 'rabbits'],
      isZoned: true,
      spawns: [
        { type: 'birds', count: 3, zone: 'north' },
        { type: 'squirrels', count: 2, zone: 'north' },
        { type: 'birds', count: 2, zone: 'south' },
        { type: 'rabbits', count: 4, zone: 'south' }
      ],
      targets: {
        north: { birds: 3, squirrels: 2 },
        south: { birds: 2, rabbits: 4 }
      },
      timeLimit: 100,
      stationRequired: true,
      stationType: 'habitat_comparison',
      hint: 'Visit both North and South zones before heading to the Research Station.'
    },
    {
      roundNum: 7,
      title: '45-Second Rapid Data Blitz',
      subtitle: 'Collect as many observations as you can against the clock!',
      taskDesc: 'Speed expedition! Observe at least 8 specimens across the park in 45 seconds.',
      targetSpecies: ['birds', 'butterflies', 'rabbits', 'squirrels'],
      spawns: [
        { type: 'birds', count: 4, zone: 'all' },
        { type: 'butterflies', count: 4, zone: 'all' },
        { type: 'rabbits', count: 3, zone: 'all' },
        { type: 'squirrels', count: 3, zone: 'all' }
      ],
      targets: { minTotal: 8 },
      timeLimit: 45,
      stationRequired: true,
      stationType: 'standard_table',
      hint: 'Hurry! Any animal counts towards your data tally!'
    },
    {
      roundNum: 8,
      title: 'Research Database Reconstruction',
      subtitle: 'Use your collected data to complete missing log records.',
      taskDesc: 'Observe 4 Birds, 3 Butterflies, and 3 Squirrels, then stamp the missing records in the database.',
      targetSpecies: ['birds', 'butterflies', 'squirrels'],
      spawns: [
        { type: 'birds', count: 4, zone: 'grove' },
        { type: 'butterflies', count: 3, zone: 'meadow' },
        { type: 'squirrels', count: 3, zone: 'grove' }
      ],
      targets: { birds: 4, butterflies: 3, squirrels: 3 },
      timeLimit: 100,
      stationRequired: true,
      stationType: 'stamp_puzzle',
      hint: 'Collect the field data first, then slot your verified tallies into the missing table slots.'
    },
    {
      roundNum: 9,
      title: 'Visual Bar Chart Construction',
      subtitle: 'Transform collected tallies into an animated bar chart.',
      taskDesc: 'Observe 5 Birds, 3 Butterflies, and 4 Rabbits, then build the visual bar chart at the Station.',
      targetSpecies: ['birds', 'butterflies', 'rabbits'],
      spawns: [
        { type: 'birds', count: 5, zone: 'all' },
        { type: 'butterflies', count: 3, zone: 'all' },
        { type: 'rabbits', count: 4, zone: 'all' }
      ],
      targets: { birds: 5, butterflies: 3, rabbits: 4 },
      timeLimit: 105,
      stationRequired: true,
      stationType: 'chart_builder',
      hint: 'Adjust each chart bar height to match your exact tally count!'
    },
    {
      roundNum: 10,
      title: 'The Grand Master Expedition',
      subtitle: 'The ultimate research mission combining all data skills!',
      taskDesc: 'Grand survey: Collect data across all 4 species in North and South zones, verify the records, and construct the master chart!',
      targetSpecies: ['birds', 'butterflies', 'rabbits', 'squirrels'],
      isZoned: true,
      spawns: [
        { type: 'birds', count: 5, zone: 'north' },
        { type: 'squirrels', count: 4, zone: 'north' },
        { type: 'butterflies', count: 4, zone: 'south' },
        { type: 'rabbits', count: 5, zone: 'south' }
      ],
      targets: {
        north: { birds: 5, squirrels: 4 },
        south: { butterflies: 4, rabbits: 5 }
      },
      timeLimit: 130,
      stationRequired: true,
      stationType: 'grand_finale',
      hint: 'Complete the entire park dataset to earn your Chief Scientist Certification!'
    }
  ];

  // ==========================================================================
  // 4. WORLD MAP & ENVIRONMENT MODEL
  // ==========================================================================
  const WORLD = {
    width: 2400,
    height: 1800,
    station: {
      x: 1200,
      y: 900,
      width: 190,
      height: 150,
      doorX: 1200,
      doorY: 970
    },
    zones: {
      north: { x: 200, y: 150, width: 2000, height: 600, name: 'North Grove & Meadow' },
      south: { x: 200, y: 1050, width: 2000, height: 600, name: 'South Pond & Orchard' },
      garden: { x: 800, y: 550, width: 800, height: 500, name: 'Central Research Garden' },
      meadow: { x: 300, y: 250, width: 700, height: 500, name: 'Wildflower Meadow' },
      grove: { x: 1400, y: 250, width: 700, height: 500, name: 'Pine Grove' },
      pond: { x: 400, y: 1150, width: 750, height: 500, name: 'Lily Pond' },
      orchard: { x: 1300, y: 1150, width: 800, height: 500, name: 'Apple Orchard' }
    },
    // Trees, pond, paths, flowerbeds
    trees: [],
    flowerPatches: [],
    ponds: [],
    benches: [],
    signposts: []
  };

  function generateWorldDecorations() {
    WORLD.trees = [];
    WORLD.flowerPatches = [];
    WORLD.ponds = [];
    WORLD.benches = [];
    WORLD.signposts = [];

    // Main Pond in South-West
    WORLD.ponds.push({
      x: 750,
      y: 1400,
      rx: 280,
      ry: 180,
      lilypads: [
        { x: 700, y: 1360, r: 24 },
        { x: 820, y: 1420, r: 28 },
        { x: 640, y: 1430, r: 20 },
        { x: 790, y: 1340, r: 22 }
      ]
    });

    // Signposts
    WORLD.signposts.push({ x: 1200, y: 680, text: 'NORTH MEADOW 🌲' });
    WORLD.signposts.push({ x: 1200, y: 1120, text: 'SOUTH POND 🦆' });
    WORLD.signposts.push({ x: 1050, y: 920, text: 'RESEARCH LAB 🔬' });

    // Benches
    WORLD.benches.push({ x: 960, y: 780, w: 70, h: 30 });
    WORLD.benches.push({ x: 1440, y: 780, w: 70, h: 30 });
    WORLD.benches.push({ x: 960, y: 1020, w: 70, h: 30 });
    WORLD.benches.push({ x: 1440, y: 1020, w: 70, h: 30 });

    // Trees throughout park
    const treePositions = [
      // North
      { x: 350, y: 220, r: 45, type: 'pine' },
      { x: 500, y: 180, r: 52, type: 'oak' },
      { x: 700, y: 260, r: 48, type: 'oak' },
      { x: 950, y: 200, r: 55, type: 'pine' },
      { x: 1450, y: 220, r: 50, type: 'pine' },
      { x: 1650, y: 180, r: 58, type: 'oak' },
      { x: 1900, y: 250, r: 48, type: 'pine' },
      { x: 2100, y: 350, r: 54, type: 'oak' },
      // Central flanks
      { x: 300, y: 700, r: 50, type: 'oak' },
      { x: 450, y: 850, r: 46, type: 'pine' },
      { x: 1950, y: 750, r: 52, type: 'oak' },
      { x: 2150, y: 900, r: 48, type: 'pine' },
      // South
      { x: 300, y: 1300, r: 46, type: 'oak' },
      { x: 1350, y: 1350, r: 54, type: 'apple' },
      { x: 1550, y: 1450, r: 50, type: 'apple' },
      { x: 1750, y: 1320, r: 52, type: 'apple' },
      { x: 1950, y: 1480, r: 48, type: 'oak' },
      { x: 1500, y: 1600, r: 55, type: 'apple' },
      { x: 1800, y: 1650, r: 50, type: 'oak' }
    ];
    WORLD.trees = treePositions;

    // Flower Patches
    WORLD.flowerPatches = [
      { x: 550, y: 450, r: 55, color: '#f43f5e' },
      { x: 750, y: 400, r: 60, color: '#fbbf24' },
      { x: 420, y: 550, r: 48, color: '#a855f7' },
      { x: 1650, y: 450, r: 65, color: '#fbbf24' },
      { x: 1850, y: 500, r: 50, color: '#f43f5e' },
      { x: 1100, y: 1400, r: 60, color: '#38bdf8' },
      { x: 1250, y: 1500, r: 55, color: '#ec4899' }
    ];
  }

  generateWorldDecorations();

  // ==========================================================================
  // 5. WILDLIFE ENTITY CLASS
  // ==========================================================================
  class WildlifeSpecimen {
    constructor(type, x, y, zone = 'default') {
      this.type = type;
      this.config = SPECIES_CONFIG[type];
      this.x = x;
      this.y = y;
      this.startX = x;
      this.startY = y;
      this.zone = zone;
      this.observed = false;
      this.observeAnimTimer = 0;

      // Movement & Animation physics
      this.vx = (Math.random() - 0.5) * this.config.speed;
      this.vy = (Math.random() - 0.5) * this.config.speed;
      this.facing = this.vx >= 0 ? 1 : -1;
      this.animFrame = Math.random() * 100;
      this.stateTimer = Math.random() * 120;
      this.isMoving = true;
      this.hopHeight = 0;

      // Radius for proximity interaction
      this.radius = 24;
    }

    update(dt) {
      this.animFrame += dt * 60;
      this.stateTimer -= dt * 60;

      if (this.observeAnimTimer > 0) {
        this.observeAnimTimer -= dt;
      }

      // Behavior state machine
      if (this.config.behavior === 'flutter_meadow') {
        // Butterflies flutter smoothly with sine waves
        this.x += Math.cos(this.animFrame * 0.05) * 1.5;
        this.y += Math.sin(this.animFrame * 0.08) * 1.2 + (Math.random() - 0.5) * 0.5;
        this.facing = Math.cos(this.animFrame * 0.05) >= 0 ? 1 : -1;
      } else if (this.config.behavior === 'hop_pause') {
        // Rabbits hop, then pause to nibble
        if (this.stateTimer <= 0) {
          this.isMoving = !this.isMoving;
          this.stateTimer = this.isMoving ? 40 + Math.random() * 40 : 60 + Math.random() * 80;
          if (this.isMoving) {
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * this.config.speed;
            this.vy = Math.sin(angle) * this.config.speed;
            this.facing = this.vx >= 0 ? 1 : -1;
          }
        }

        if (this.isMoving) {
          this.x += this.vx;
          this.y += this.vy;
          this.hopHeight = Math.abs(Math.sin(this.animFrame * 0.2)) * 12;
        } else {
          this.hopHeight = 0;
        }
      } else if (this.config.behavior === 'perch_fly') {
        // Birds perch, flutter wings, occasionally reposition
        if (this.stateTimer <= 0) {
          this.isMoving = !this.isMoving;
          this.stateTimer = this.isMoving ? 60 + Math.random() * 60 : 120 + Math.random() * 150;
          if (this.isMoving) {
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * this.config.speed;
            this.vy = Math.sin(angle) * this.config.speed;
            this.facing = this.vx >= 0 ? 1 : -1;
          }
        }

        if (this.isMoving) {
          this.x += this.vx;
          this.y += this.vy;
        }
      } else if (this.config.behavior === 'scurry_tree') {
        // Squirrels dart fast, stop to inspect nuts
        if (this.stateTimer <= 0) {
          this.isMoving = !this.isMoving;
          this.stateTimer = this.isMoving ? 35 + Math.random() * 35 : 50 + Math.random() * 70;
          if (this.isMoving) {
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * this.config.speed;
            this.vy = Math.sin(angle) * this.config.speed;
            this.facing = this.vx >= 0 ? 1 : -1;
          }
        }

        if (this.isMoving) {
          this.x += this.vx;
          this.y += this.vy;
        }
      }

      // Constrain inside world boundaries
      const margin = 80;
      if (this.x < margin) { this.x = margin; this.vx = Math.abs(this.vx); this.facing = 1; }
      if (this.x > WORLD.width - margin) { this.x = WORLD.width - margin; this.vx = -Math.abs(this.vx); this.facing = -1; }
      if (this.y < margin) { this.y = margin; this.vy = Math.abs(this.vy); }
      if (this.y > WORLD.height - margin) { this.y = WORLD.height - margin; this.vy = -Math.abs(this.vy); }

      // Keep from getting stuck inside Research Station
      const s = WORLD.station;
      if (this.x > s.x - s.width/2 - 20 && this.x < s.x + s.width/2 + 20 &&
          this.y > s.y - s.height/2 - 20 && this.y < s.y + s.height/2 + 20) {
        this.x += (this.x > s.x ? 2 : -2);
        this.y += (this.y > s.y ? 2 : -2);
      }
    }

    render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y - this.hopHeight);
      ctx.scale(this.facing, 1);

      // Shadow on ground
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, this.hopHeight + 14, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Specimen Body based on Category
      if (this.type === 'birds') {
        this.renderBird(ctx);
      } else if (this.type === 'butterflies') {
        this.renderButterfly(ctx);
      } else if (this.type === 'rabbits') {
        this.renderRabbit(ctx);
      } else if (this.type === 'squirrels') {
        this.renderSquirrel(ctx);
      }

      ctx.restore();

      // In-world Observation Indicator / Status Badge
      this.renderStatusBadge(ctx);
    }

    renderBird(ctx) {
      // Perched / Flying Blue Jay / Robin
      const wingFlap = this.isMoving ? Math.sin(this.animFrame * 0.3) * 10 : 0;

      // Body
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 11, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Breast (white/peach)
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(5, 4, 9, 7, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.arc(12, -7, 9, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(19, -8);
      ctx.lineTo(26, -5);
      ctx.lineTo(19, -3);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(15, -8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(16, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-2, -2 + wingFlap * 0.4, 12, 6, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Tail feather
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(-24, 4);
      ctx.lineTo(-20, -4);
      ctx.closePath();
      ctx.fill();
    }

    renderButterfly(ctx) {
      const wingBeat = Math.sin(this.animFrame * 0.25);
      const wingW = Math.abs(wingBeat) * 14 + 4;

      // Upper Wings
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(wingBeat > 0 ? 6 : -6, -8, wingW, 11, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Lower Wings
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(wingBeat > 0 ? 5 : -5, 4, wingW * 0.75, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Wing spots
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(wingBeat > 0 ? 8 : -8, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Body & Antennae
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.quadraticCurveTo(4, -16, 7, -15);
      ctx.moveTo(0, -9);
      ctx.quadraticCurveTo(-4, -16, -7, -15);
      ctx.stroke();
    }

    renderRabbit(ctx) {
      // Body
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(-2, 2, 14, 11, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-15, 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(10, -5, 9, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Long Ears
      const earWiggle = Math.sin(this.animFrame * 0.1) * 2;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(6, -18 + earWiggle, 4, 10, -0.2, 0, Math.PI * 2);
      ctx.ellipse(12, -18 - earWiggle, 4, 10, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Inner Pink Ear
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(6, -18 + earWiggle, 2, 7, -0.2, 0, Math.PI * 2);
      ctx.ellipse(12, -18 - earWiggle, 2, 7, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.arc(13, -6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(18, -4, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    renderSquirrel(ctx) {
      // Bushy Tail
      const tailSway = Math.sin(this.animFrame * 0.15) * 4;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(-6, 2);
      ctx.bezierCurveTo(-22 + tailSway, -10, -26 + tailSway, -24, -14, -22);
      ctx.bezierCurveTo(-6, -20, -12, -8, -4, 4);
      ctx.closePath();
      ctx.fill();

      // Body
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(2, 2, 13, 9, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Belly
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(4, 5, 8, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(12, -5, 7, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(10, -12, 3, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(14, -6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Acorn in hands if paused
      if (!this.isMoving) {
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(16, 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    renderStatusBadge(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y - this.hopHeight - 26);

      if (this.observed) {
        // Small checkmark badge indicating observed
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(-1, 3);
        ctx.lineTo(4, -3);
        ctx.stroke();
      } else {
        // Pulsing subtle discovery sparkle
        const pulse = (Math.sin(this.animFrame * 0.1) + 1) * 0.5;
        ctx.fillStyle = `rgba(250, 204, 21, ${0.4 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(0, 0, 4 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // If observation animation is playing, draw expanding lens ring
      if (this.observeAnimTimer > 0) {
        const t = 1 - this.observeAnimTimer / 0.6; // 0 to 1
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - t})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 10, 10 + t * 35, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle stars
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2 + t * 3;
          const dist = 15 + t * 25;
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * dist, 10 + Math.sin(ang) * dist, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. PLAYER CHARACTER CLASS ("DETECTIVE LEO")
  // ==========================================================================
  class DetectivePlayer {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.speed = 4.2;
      this.facing = 1;
      this.animFrame = 0;
      this.isWalking = false;
      this.radius = 20;

      // Target position for tap/click-to-move
      this.targetX = null;
      this.targetY = null;
    }

    update(dt, inputState) {
      let moveX = 0;
      let moveY = 0;

      // Keyboard Controls
      if (inputState.keys['KeyW'] || inputState.keys['ArrowUp']) moveY -= 1;
      if (inputState.keys['KeyS'] || inputState.keys['ArrowDown']) moveY += 1;
      if (inputState.keys['KeyA'] || inputState.keys['ArrowLeft']) moveX -= 1;
      if (inputState.keys['KeyD'] || inputState.keys['ArrowRight']) moveX += 1;

      // Joystick Controls
      if (inputState.joystick.active) {
        moveX = inputState.joystick.dx;
        moveY = inputState.joystick.dy;
        this.targetX = null; // override click-to-move
      }

      // Tap-to-move navigation
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

      // Apply movement
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

        // Footstep sound rhythm
        if (Math.floor(this.animFrame) % 4 === 0 && Math.random() < 0.15) {
          audio.playStep();
        }
      } else {
        this.vx *= 0.7;
        this.vy *= 0.7;
        this.isWalking = false;
      }

      // Move player with collision checks
      const nextX = this.x + this.vx;
      const nextY = this.y + this.vy;

      // Boundaries
      const margin = 40;
      this.x = Math.max(margin, Math.min(WORLD.width - margin, nextX));
      this.y = Math.max(margin, Math.min(WORLD.height - margin, nextY));

      // Station Collision (allow door interaction)
      const s = WORLD.station;
      const insideStation = (
        this.x > s.x - s.width/2 && this.x < s.x + s.width/2 &&
        this.y > s.y - s.height/2 && this.y < s.y + s.height/2 - 20
      );
      if (insideStation) {
        // Push outside building walls except door
        if (Math.abs(this.x - s.x) < 40 && this.y >= s.y + s.height/2 - 30) {
          // At door — allowed!
        } else {
          if (this.y < s.y) this.y = s.y - s.height/2 - 2;
          else this.y = s.y + s.height/2 + 2;
        }
      }
    }

    render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 18, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(this.facing, 1);

      const bob = this.isWalking ? Math.sin(this.animFrame) * 2.5 : Math.sin(Date.now() * 0.003) * 1;
      const legSwing = this.isWalking ? Math.sin(this.animFrame) * 8 : 0;

      // Legs
      ctx.fillStyle = '#475569'; // Khaki / Grey pants
      // Left Leg
      ctx.fillRect(-8 + legSwing * 0.6, 6, 6, 12);
      // Right Leg
      ctx.fillRect(2 - legSwing * 0.6, 6, 6, 12);

      // Shoes
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-10 + legSwing * 0.6, 16, 9, 5);
      ctx.fillRect(1 - legSwing * 0.6, 16, 9, 5);

      // Body (Field Vest)
      ctx.fillStyle = '#d97706'; // Tan/Amber Field Jacket
      ctx.beginPath();
      ctx.roundRect(-10, -10 + bob, 20, 18, 4);
      ctx.fill();

      // Pocket & Badge
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-7, -4 + bob, 5, 5);
      ctx.fillRect(2, -4 + bob, 5, 5);

      // Detective Head
      ctx.fillStyle = '#fed7aa'; // Skin tone
      ctx.beginPath();
      ctx.arc(0, -16 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful Eyes & Smile
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -17 + bob, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(3, -13 + bob, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Explorer Safari Hat
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(0, -22 + bob, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, -24 + bob, 9, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b'; // Hat ribbon band
      ctx.fillRect(-8, -24 + bob, 16, 3);

      // Magnifying Glass in hand
      ctx.save();
      ctx.translate(9, -2 + bob);
      ctx.rotate(0.3 + Math.sin(this.animFrame * 0.5) * 0.2);
      // Handle
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 3, 10);
      // Rim
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(1.5, -5, 6, 0, Math.PI * 2);
      ctx.stroke();
      // Glass Lens
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.beginPath();
      ctx.arc(1.5, -5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. MAIN GAME CONTROLLER & STATE
  // ==========================================================================
  class DataDetectiveGame {
    constructor() {
      // DOM Elements
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.radarCanvas = document.getElementById('radar-canvas');
      this.radarCtx = this.radarCanvas.getContext('2d');

      // Screens & Modals
      this.screenTitle = document.getElementById('screen-title');
      this.screenGameOver = document.getElementById('screen-game-over');
      this.modalInstructions = document.getElementById('modal-instructions');
      this.modalNotebook = document.getElementById('modal-notebook');
      this.modalStation = document.getElementById('modal-station');
      this.modalRoundComplete = document.getElementById('modal-round-complete');
      this.hud = document.getElementById('hud');
      this.radarWidget = document.getElementById('radar-widget');
      this.miniTallyBar = document.getElementById('mini-tally-bar');
      this.interactPrompt = document.getElementById('interact-prompt');
      this.promptText = document.getElementById('prompt-text');
      this.toastContainer = document.getElementById('toast-container');
      this.touchControls = document.getElementById('touch-controls');

      // HUD elements
      this.hudRound = document.getElementById('hud-round');
      this.hudScore = document.getElementById('hud-score');
      this.hudTime = document.getElementById('hud-time');
      this.hudTimeContainer = document.getElementById('hud-time-container');
      this.hudObs = document.getElementById('hud-obs');
      this.hudObjectiveText = document.getElementById('hud-objective-text');
      this.hudObjectiveProgress = document.getElementById('hud-objective-progress');
      this.notebookBadgeCount = document.getElementById('notebook-badge-count');

      // Game state variables
      this.currentRoundIdx = 0;
      this.score = 0;
      this.totalObservations = 0;
      this.gameStartTime = 0;
      this.roundStartTime = 0;
      this.roundTimeRemaining = 60;
      this.isGameRunning = false;
      this.isRoundActive = false;
      this.isPaused = false;

      // Entities
      this.player = new DetectivePlayer(1200, 1050);
      this.specimens = [];
      this.nearbySpecimen = null;
      this.isNearStation = false;

      // Tally & Records storage
      this.roundTallyData = {
        birds: 0,
        butterflies: 0,
        rabbits: 0,
        squirrels: 0
      };
      this.zonedTallyData = {
        north: { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 },
        south: { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 }
      };
      this.totalCategoryCounts = {
        birds: 0,
        butterflies: 0,
        rabbits: 0,
        squirrels: 0
      };

      // Input State
      this.inputState = {
        keys: {},
        joystick: { active: false, dx: 0, dy: 0, touchId: null, startX: 0, startY: 0 }
      };

      // Camera
      this.camera = { x: 1200, y: 1050, zoom: 1 };

      // Station puzzle states
      this.stationPuzzleState = {
        stampedSlots: {},
        chartValues: { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 }
      };

      // Lifecycle hooks for StuCent
      this.stucentConfig = null;

      // Initialize
      this.initEventListeners();
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // Start loop
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

      // Check if touch device
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch && this.isGameRunning) {
        this.touchControls.classList.remove('hidden');
      } else {
        this.touchControls.classList.add('hidden');
      }
    }

    initEventListeners() {
      // Keyboard input
      window.addEventListener('keydown', e => {
        this.inputState.keys[e.code] = true;

        if (e.code === 'Space' || e.code === 'KeyE') {
          if (this.isRoundActive && !this.isModalOpen()) {
            this.handleInteraction();
          }
        }

        if (e.code === 'KeyL' || e.code === 'Tab') {
          e.preventDefault();
          if (this.isGameRunning && !this.modalStation.classList.contains('hidden')) return;
          this.toggleNotebook();
        }

        if (e.code === 'Escape') {
          this.closeAllModals();
        }
      });

      window.addEventListener('keyup', e => {
        this.inputState.keys[e.code] = false;
      });

      // Mouse / Canvas Click to Move
      this.canvas.addEventListener('pointerdown', e => {
        if (!this.isRoundActive || this.isModalOpen()) return;

        // Convert screen coordinates to world coordinates
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const worldX = screenX - this.width / 2 + this.camera.x;
        const worldY = screenY - this.height / 2 + this.camera.y;

        // Check if clicked directly on an animal
        let clickedSpecimen = null;
        for (const spec of this.specimens) {
          const d = Math.hypot(worldX - spec.x, worldY - spec.y);
          if (d < 36) {
            clickedSpecimen = spec;
            break;
          }
        }

        if (clickedSpecimen) {
          // Walk toward and observe
          this.player.targetX = clickedSpecimen.x;
          this.player.targetY = clickedSpecimen.y;
          const distToPlayer = Math.hypot(this.player.x - clickedSpecimen.x, this.player.y - clickedSpecimen.y);
          if (distToPlayer < 90 && !clickedSpecimen.observed) {
            this.observeSpecimen(clickedSpecimen);
          }
        } else {
          // Set target to walk
          this.player.targetX = worldX;
          this.player.targetY = worldY;
        }
      });

      // HUD Buttons
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

      document.getElementById('btn-toggle-notebook').addEventListener('click', () => {
        audio.playClick();
        this.toggleNotebook();
      });

      document.getElementById('btn-close-notebook').addEventListener('click', () => {
        audio.playClick();
        this.modalNotebook.classList.add('hidden');
      });

      document.getElementById('btn-close-station').addEventListener('click', () => {
        audio.playClick();
        this.modalStation.classList.add('hidden');
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

      document.getElementById('btn-station-submit').addEventListener('click', () => {
        audio.playClick();
        this.handleStationSubmission();
      });

      // Touch On-Screen Buttons
      document.getElementById('btn-touch-observe').addEventListener('pointerdown', e => {
        e.preventDefault();
        this.handleInteraction();
      });

      document.getElementById('btn-touch-station').addEventListener('pointerdown', e => {
        e.preventDefault();
        if (this.isNearStation) {
          this.openResearchStation();
        } else {
          this.showToast('Walk to the Research Station in the center!', 'info');
        }
      });

      // Virtual Analog Joystick
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
        !this.modalNotebook.classList.contains('hidden') ||
        !this.modalStation.classList.contains('hidden') ||
        !this.modalRoundComplete.classList.contains('hidden') ||
        !this.modalInstructions.classList.contains('hidden') ||
        !this.screenTitle.classList.contains('hidden') ||
        !this.screenGameOver.classList.contains('hidden')
      );
    }

    closeAllModals() {
      this.modalNotebook.classList.add('hidden');
      this.modalStation.classList.add('hidden');
      this.modalInstructions.classList.add('hidden');
    }

    // ========================================================================
    // 8. GAMEPLAY & ROUND LIFECYCLE
    // ========================================================================
    startGame() {
      this.screenTitle.classList.add('hidden');
      this.screenGameOver.classList.add('hidden');
      this.hud.classList.remove('hidden');
      this.radarWidget.classList.remove('hidden');
      this.miniTallyBar.classList.remove('hidden');

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) this.touchControls.classList.remove('hidden');

      this.score = 0;
      this.totalObservations = 0;
      this.currentRoundIdx = 0;
      this.gameStartTime = Date.now();
      this.isGameRunning = true;
      this.hasReportedEnd = false;

      this.totalCategoryCounts = { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 };

      this.startRound(this.currentRoundIdx);
    }

    startRound(idx) {
      this.currentRoundIdx = idx;
      const roundConfig = ROUNDS_CONFIG[idx];
      this.isRoundActive = true;
      this.roundStartTime = Date.now();
      this.roundTimeRemaining = roundConfig.timeLimit;

      // Reset round tallies
      this.roundTallyData = { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 };
      this.zonedTallyData = {
        north: { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 },
        south: { birds: 0, butterflies: 0, rabbits: 0, squirrels: 0 }
      };

      // Position player near station entrance
      this.player.x = 1200;
      this.player.y = 1050;
      this.player.targetX = null;
      this.player.targetY = null;

      // Spawn specimens
      this.spawnSpecimensForRound(roundConfig);

      // Update HUD
      this.hudRound.textContent = `${roundConfig.roundNum}/10`;
      this.hudScore.textContent = this.score;
      this.hudTime.textContent = `${this.roundTimeRemaining}s`;
      this.hudTimeContainer.classList.remove('urgent');
      this.hudObs.textContent = '0';
      this.hudObjectiveText.textContent = roundConfig.taskDesc;
      this.updateHUDProgress();

      // Render initial mini tallies & notebook
      this.updateMiniTallyDisplay();
      this.renderNotebookContent();

      // Show welcome toast
      this.showToast(`🎯 Round ${roundConfig.roundNum}: ${roundConfig.title}`, 'bonus');
    }

    spawnSpecimensForRound(roundConfig) {
      this.specimens = [];

      roundConfig.spawns.forEach(spawnDef => {
        const type = spawnDef.type;
        const count = spawnDef.count;
        const zoneKey = spawnDef.zone;

        for (let i = 0; i < count; i++) {
          let pos = this.getRandomSpawnPositionInZone(zoneKey);
          let assignedZone = 'garden';
          if (pos.y < 800) assignedZone = 'north';
          else if (pos.y > 1000) assignedZone = 'south';

          const spec = new WildlifeSpecimen(type, pos.x, pos.y, assignedZone);
          this.specimens.push(spec);
        }
      });
    }

    getRandomSpawnPositionInZone(zoneKey) {
      let zoneRect = { x: 300, y: 300, width: 1800, height: 1200 };

      if (zoneKey === 'north') {
        zoneRect = WORLD.zones.north;
      } else if (zoneKey === 'south') {
        zoneRect = WORLD.zones.south;
      } else if (zoneKey === 'meadow') {
        zoneRect = WORLD.zones.meadow;
      } else if (zoneKey === 'grove') {
        zoneRect = WORLD.zones.grove;
      } else if (zoneKey === 'garden') {
        zoneRect = WORLD.zones.garden;
      } else if (zoneKey === 'pond') {
        zoneRect = WORLD.zones.pond;
      }

      // Pick point avoiding station building
      let pt = { x: 1200, y: 900 };
      let attempts = 0;
      while (attempts < 50) {
        attempts++;
        const rx = zoneRect.x + 40 + Math.random() * (zoneRect.width - 80);
        const ry = zoneRect.y + 40 + Math.random() * (zoneRect.height - 80);

        const s = WORLD.station;
        if (!(rx > s.x - s.width/2 - 50 && rx < s.x + s.width/2 + 50 &&
              ry > s.y - s.height/2 - 50 && ry < s.y + s.height/2 + 50)) {
          pt = { x: rx, y: ry };
          break;
        }
      }
      return pt;
    }

    // ========================================================================
    // 9. OBSERVATION & INTERACTION SYSTEM
    // ========================================================================
    handleInteraction() {
      // 1. If near research station
      if (this.isNearStation) {
        audio.playStationEnter();
        this.openResearchStation();
        return;
      }

      // 2. If near unobserved specimen
      if (this.nearbySpecimen && !this.nearbySpecimen.observed) {
        this.observeSpecimen(this.nearbySpecimen);
      }
    }

    observeSpecimen(specimen) {
      specimen.observed = true;
      specimen.observeAnimTimer = 0.6; // Trigger visual sparkle & lens expand

      // Audio feedback
      audio.playObserve();
      setTimeout(() => audio.playTallyStroke(), 120);

      // Increment round and total tallies
      this.roundTallyData[specimen.type]++;
      this.totalCategoryCounts[specimen.type]++;
      this.totalObservations++;

      // Zone specific tracking
      if (specimen.zone === 'north' || specimen.y < 900) {
        this.zonedTallyData.north[specimen.type]++;
      } else {
        this.zonedTallyData.south[specimen.type]++;
      }

      // Check if this created a bundle of 5!
      const currentCount = this.roundTallyData[specimen.type];
      if (currentCount % 5 === 0) {
        setTimeout(() => {
          audio.playBundleComplete();
          this.showToast(`✨ Group of 5 ${specimen.config.name} bundled! (||||/) +25 pts!`, 'bonus');
          this.addScore(25);
        }, 220);
      }

      // Add regular observation score
      this.addScore(10);

      // Feedback toast
      this.showToast(`🔍 ${specimen.config.singular} recorded in Field Log! (+10)`, 'info');

      // Update UI components
      this.hudObs.textContent = this.totalObservations;
      this.updateHUDProgress();
      this.updateMiniTallyDisplay();
      this.renderNotebookContent();

      // Check if all specimens for current round are observed
      this.checkRoundObjectiveStatus();
    }

    checkRoundObjectiveStatus() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      let isTaskComplete = false;

      if (roundConfig.targets.minTotal) {
        // Timed blitz minimum
        const currentTotal = Object.values(this.roundTallyData).reduce((a, b) => a + b, 0);
        isTaskComplete = currentTotal >= roundConfig.targets.minTotal;
      } else if (roundConfig.isZoned) {
        // Zoned checks
        let allZonedGood = true;
        for (const [zoneKey, targets] of Object.entries(roundConfig.targets)) {
          for (const [spType, targetCount] of Object.entries(targets)) {
            if (this.zonedTallyData[zoneKey][spType] < targetCount) {
              allZonedGood = false;
            }
          }
        }
        isTaskComplete = allZonedGood;
      } else {
        // Standard category checks
        let allGood = true;
        for (const [spType, targetCount] of Object.entries(roundConfig.targets)) {
          if (this.roundTallyData[spType] < targetCount) {
            allGood = false;
          }
        }
        isTaskComplete = allGood;
      }

      if (isTaskComplete) {
        this.showToast(`🔬 Field Survey Complete! Return to Research Station!`, 'bonus');
      }
    }

    updateHUDProgress() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      if (roundConfig.targets.minTotal) {
        const total = Object.values(this.roundTallyData).reduce((a, b) => a + b, 0);
        this.hudObjectiveProgress.textContent = `(${total}/${roundConfig.targets.minTotal})`;
      } else if (roundConfig.isZoned) {
        let totalObs = 0;
        let totalReq = 0;
        for (const [z, t] of Object.entries(roundConfig.targets)) {
          for (const [sp, req] of Object.entries(t)) {
            totalReq += req;
            totalObs += Math.min(req, this.zonedTallyData[z][sp] || 0);
          }
        }
        this.hudObjectiveProgress.textContent = `(${totalObs}/${totalReq})`;
      } else {
        let totalObs = 0;
        let totalReq = 0;
        for (const [sp, req] of Object.entries(roundConfig.targets)) {
          totalReq += req;
          totalObs += Math.min(req, this.roundTallyData[sp] || 0);
        }
        this.hudObjectiveProgress.textContent = `(${totalObs}/${totalReq})`;
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
    // 10. TALLY MARKS RENDERING ENGINE (AUTHENTIC ||||/ BUNDLES)
    // ========================================================================
    generateTallyHTML(count) {
      if (count <= 0) {
        return '<span class="tally-remainder" style="color: #94a3b8;">—</span>';
      }

      const bundles = Math.floor(count / 5);
      const remainder = count % 5;
      let html = '';

      // Draw bundles of 5 with authentic 4 lines + diagonal strike line
      for (let i = 0; i < bundles; i++) {
        html += `
          <div class="tally-bundle" title="Bundle of 5">
            <span class="tally-lines-4">||||</span>
            <span class="tally-strike-line"></span>
          </div>
        `;
      }

      // Remainder lines (1 to 4)
      if (remainder > 0) {
        const remainderBars = '|'.repeat(remainder);
        html += `<span class="tally-remainder">${remainderBars}</span>`;
      }

      return html;
    }

    updateMiniTallyDisplay() {
      const container = document.getElementById('mini-tally-list');
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      let html = '';

      const speciesToShow = roundConfig.targetSpecies;
      speciesToShow.forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const count = this.roundTallyData[spKey] || 0;
        html += `
          <div class="mini-tally-row">
            <div class="mini-tally-name">${spec.icon} ${spec.name}</div>
            <div class="mini-tally-marks">${this.generateTallyHTML(count)}</div>
          </div>
        `;
      });

      container.innerHTML = html;
      const totalRoundObs = Object.values(this.roundTallyData).reduce((a, b) => a + b, 0);
      this.notebookBadgeCount.textContent = totalRoundObs;
    }

    toggleNotebook() {
      if (this.modalNotebook.classList.contains('hidden')) {
        this.renderNotebookContent();
        this.modalNotebook.classList.remove('hidden');
      } else {
        this.modalNotebook.classList.add('hidden');
      }
    }

    renderNotebookContent() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      document.getElementById('notebook-round-info').textContent = `Round ${roundConfig.roundNum} • ${roundConfig.title}`;

      const container = document.getElementById('notebook-records-container');
      let html = '';

      if (roundConfig.isZoned) {
        // Show North & South Zone Separators
        ['north', 'south'].forEach(zoneKey => {
          const zoneTitle = zoneKey === 'north' ? '🌲 NORTH GROVE' : '🦆 SOUTH POND';
          html += `<div style="font-weight: 800; font-size: 0.88rem; color: #78350f; margin-top: 6px;">${zoneTitle}</div>`;

          roundConfig.targetSpecies.forEach(spKey => {
            const spec = SPECIES_CONFIG[spKey];
            const count = this.zonedTallyData[zoneKey][spKey] || 0;
            const targetReq = (roundConfig.targets[zoneKey] && roundConfig.targets[zoneKey][spKey]) || 0;

            html += `
              <div class="notebook-record-row">
                <div class="record-category-info">
                  <span class="record-category-icon">${spec.icon}</span>
                  <div>
                    <div class="record-category-name">${spec.name}</div>
                    <div class="record-category-target">Target: ${targetReq} specimens</div>
                  </div>
                </div>
                <div class="record-tally-display">
                  ${this.generateTallyHTML(count)}
                  <span class="record-count-badge">${count}</span>
                </div>
              </div>
            `;
          });
        });
      } else {
        roundConfig.targetSpecies.forEach(spKey => {
          const spec = SPECIES_CONFIG[spKey];
          const count = this.roundTallyData[spKey] || 0;
          const targetReq = roundConfig.targets[spKey] || (roundConfig.targets.minTotal ? 'Any' : 0);

          html += `
            <div class="notebook-record-row">
              <div class="record-category-info">
                <span class="record-category-icon">${spec.icon}</span>
                <div>
                  <div class="record-category-name">${spec.name}</div>
                  <div class="record-category-target">Target: ${targetReq} specimens</div>
                </div>
              </div>
              <div class="record-tally-display">
                ${this.generateTallyHTML(count)}
                <span class="record-count-badge">${count}</span>
              </div>
            </div>
          `;
        });
      }

      container.innerHTML = html;
      const totalObs = Object.values(this.roundTallyData).reduce((a, b) => a + b, 0);
      document.getElementById('notebook-total-count').textContent = totalObs;
    }

    // ========================================================================
    // 11. RESEARCH STATION LAB (TABLES, COMPARISON, STAMPING & BAR CHARTS)
    // ========================================================================
    openResearchStation() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      const body = document.getElementById('station-content-body');
      const title = document.getElementById('station-modal-title');
      const subtitle = document.getElementById('station-modal-subtitle');
      const statusMsg = document.getElementById('station-status-message');

      title.textContent = `RESEARCH STATION: ${roundConfig.title.toUpperCase()}`;
      subtitle.textContent = roundConfig.subtitle;

      // Render custom interface depending on stationType
      if (roundConfig.stationType === 'standard_table') {
        this.renderStationStandardTable(body, roundConfig);
        statusMsg.textContent = 'Field data synchronized with Research Station!';
      } else if (roundConfig.stationType === 'habitat_comparison') {
        this.renderStationHabitatComparison(body, roundConfig);
        statusMsg.textContent = 'North and South habitat data ready for comparison!';
      } else if (roundConfig.stationType === 'stamp_puzzle') {
        this.renderStationStampPuzzle(body, roundConfig);
        statusMsg.textContent = 'Click missing slots to stamp your collected field tallies!';
      } else if (roundConfig.stationType === 'chart_builder') {
        this.renderStationChartBuilder(body, roundConfig);
        statusMsg.textContent = 'Adjust chart bar heights to match your recorded field tallies!';
      } else if (roundConfig.stationType === 'grand_finale') {
        this.renderStationGrandFinale(body, roundConfig);
        statusMsg.textContent = 'Grand Expedition Complete! Ready to publish master research.';
      }

      this.modalStation.classList.remove('hidden');
    }

    renderStationStandardTable(container, roundConfig) {
      let rows = '';
      roundConfig.targetSpecies.forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const count = this.roundTallyData[spKey] || 0;
        rows += `
          <tr>
            <td>${spec.icon} <strong>${spec.name}</strong></td>
            <td class="station-tally-cell">${this.generateTallyHTML(count)}</td>
            <td class="station-count-cell">${count}</td>
          </tr>
        `;
      });

      container.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a; margin-bottom: 4px;">
          📊 FIELD OBSERVATION DATA TABLE
        </div>
        <table class="station-data-table">
          <thead>
            <tr>
              <th>CATEGORY</th>
              <th>TALLY RECORD (<s>||||</s>)</th>
              <th>RECORDED COUNT</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }

    renderStationHabitatComparison(container, roundConfig) {
      let northRows = '';
      let southRows = '';

      roundConfig.targetSpecies.forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const nCount = this.zonedTallyData.north[spKey] || 0;
        const sCount = this.zonedTallyData.south[spKey] || 0;

        if (roundConfig.targets.north[spKey] !== undefined) {
          northRows += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span>${spec.icon} ${spec.name}:</span>
              <div>${this.generateTallyHTML(nCount)} <strong>(${nCount})</strong></div>
            </div>
          `;
        }

        if (roundConfig.targets.south[spKey] !== undefined) {
          southRows += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span>${spec.icon} ${spec.name}:</span>
              <div>${this.generateTallyHTML(sCount)} <strong>(${sCount})</strong></div>
            </div>
          `;
        }
      });

      container.innerHTML = `
        <div class="comparison-grid">
          <div class="habitat-card north">
            <div class="habitat-title">🌲 NORTH GROVE DATA</div>
            ${northRows}
          </div>
          <div class="habitat-card south">
            <div class="habitat-title">🦆 SOUTH POND DATA</div>
            ${southRows}
          </div>
        </div>
      `;
    }

    renderStationStampPuzzle(container, roundConfig) {
      // Physical puzzle: player clicks missing slots to stamp their observed tallies & count
      this.stationPuzzleState.stampedSlots = {};

      let rows = '';
      roundConfig.targetSpecies.forEach((spKey, idx) => {
        const spec = SPECIES_CONFIG[spKey];
        const count = this.roundTallyData[spKey] || 0;
        const isMissing = idx === 1; // Middle one missing

        if (isMissing) {
          rows += `
            <tr>
              <td>${spec.icon} <strong>${spec.name}</strong></td>
              <td class="station-tally-cell">
                <button class="stamp-slot" id="stamp-tally-${spKey}" data-species="${spKey}" data-type="tally">
                  [ STAMP TALLY ]
                </button>
              </td>
              <td class="station-count-cell">
                <button class="stamp-slot" id="stamp-count-${spKey}" data-species="${spKey}" data-type="count">
                  [ ? ]
                </button>
              </td>
            </tr>
          `;
        } else {
          rows += `
            <tr>
              <td>${spec.icon} <strong>${spec.name}</strong></td>
              <td class="station-tally-cell">${this.generateTallyHTML(count)}</td>
              <td class="station-count-cell">${count}</td>
            </tr>
          `;
        }
      });

      container.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a; margin-bottom: 4px;">
          🛠️ RECONSTRUCT RESEARCH LOG DATABASE
        </div>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 10px;">
          Click the highlighted stamp boxes below to verify and insert your field observations into the database!
        </p>
        <table class="station-data-table">
          <thead>
            <tr>
              <th>CATEGORY</th>
              <th>TALLY RECORD</th>
              <th>RECORDED COUNT</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;

      // Attach stamping event listeners
      container.querySelectorAll('.stamp-slot').forEach(btn => {
        btn.addEventListener('click', e => {
          const spKey = e.currentTarget.dataset.species;
          const stampType = e.currentTarget.dataset.type;
          const count = this.roundTallyData[spKey] || 0;

          audio.playClick();
          audio.playObserve();

          if (stampType === 'tally') {
            e.currentTarget.innerHTML = this.generateTallyHTML(count);
            e.currentTarget.classList.add('stamped');
            this.stationPuzzleState.stampedSlots[`${spKey}_tally`] = true;
          } else {
            e.currentTarget.innerHTML = `<strong>${count}</strong>`;
            e.currentTarget.classList.add('stamped');
            this.stationPuzzleState.stampedSlots[`${spKey}_count`] = true;
          }
        });
      });
    }

    renderStationChartBuilder(container, roundConfig) {
      // Interactive Bar Chart Builder where bars are adjusted with + / - step buttons
      this.stationPuzzleState.chartValues = {};
      roundConfig.targetSpecies.forEach(sp => {
        this.stationPuzzleState.chartValues[sp] = 0; // Starts at 0, player builds it
      });

      let columnsHtml = '';
      roundConfig.targetSpecies.forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const observedCount = this.roundTallyData[spKey] || 0;

        columnsHtml += `
          <div class="chart-bar-column ${spKey}">
            <div class="chart-bar-visual" id="chart-bar-${spKey}" style="height: 10px;">
              <span id="chart-bar-val-${spKey}">0</span>
            </div>
            <div class="chart-bar-controls">
              <button class="btn-chart-step btn-minus" data-species="${spKey}">-</button>
              <button class="btn-chart-step btn-plus" data-species="${spKey}">+</button>
            </div>
            <div class="chart-bar-label">${spec.icon} ${spec.name}</div>
            <div style="font-size: 0.7rem; color: #78350f; font-weight: 800;">Log: ${observedCount}</div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="chart-builder-container">
          <div class="chart-builder-header">
            <span>📈 INTERACTIVE BAR CHART BUILDER</span>
            <span style="font-size: 0.8rem; color: #64748b;">Click + / - to match your observed tally count!</span>
          </div>
          <div class="chart-columns-wrap">
            <div class="chart-y-axis-ticks">
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            ${columnsHtml}
          </div>
        </div>
      `;

      // Attach Chart Adjustment Handlers
      const maxHeightPx = 140;
      const maxDataVal = 6;

      const updateBarVisual = spKey => {
        const val = this.stationPuzzleState.chartValues[spKey];
        const barElem = document.getElementById(`chart-bar-${spKey}`);
        const valElem = document.getElementById(`chart-bar-val-${spKey}`);
        const height = Math.max(10, (val / maxDataVal) * maxHeightPx);

        barElem.style.height = `${height}px`;
        valElem.textContent = val;

        // Visual feedback if matching observed tallies
        const observedCount = this.roundTallyData[spKey] || 0;
        if (val === observedCount) {
          barElem.style.boxShadow = '0 0 14px rgba(34, 197, 94, 0.8)';
        } else {
          barElem.style.boxShadow = 'none';
        }
      };

      container.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', e => {
          const spKey = e.currentTarget.dataset.species;
          if (this.stationPuzzleState.chartValues[spKey] < maxDataVal) {
            this.stationPuzzleState.chartValues[spKey]++;
            audio.playClick();
            updateBarVisual(spKey);
          }
        });
      });

      container.querySelectorAll('.btn-minus').forEach(btn => {
        btn.addEventListener('click', e => {
          const spKey = e.currentTarget.dataset.species;
          if (this.stationPuzzleState.chartValues[spKey] > 0) {
            this.stationPuzzleState.chartValues[spKey]--;
            audio.playClick();
            updateBarVisual(spKey);
          }
        });
      });
    }

    renderStationGrandFinale(container, roundConfig) {
      // Grand expedition summary
      let totalObs = 0;
      let rows = '';

      ['north', 'south'].forEach(zone => {
        const zName = zone === 'north' ? '🌲 NORTH GROVE' : '🦆 SOUTH POND';
        rows += `<tr><th colspan="3" style="background: #1e293b; color: #86efac;">${zName}</th></tr>`;
        roundConfig.targetSpecies.forEach(spKey => {
          const spec = SPECIES_CONFIG[spKey];
          const count = this.zonedTallyData[zone][spKey] || 0;
          if (roundConfig.targets[zone][spKey] !== undefined) {
            totalObs += count;
            rows += `
              <tr>
                <td>${spec.icon} ${spec.name}</td>
                <td class="station-tally-cell">${this.generateTallyHTML(count)}</td>
                <td class="station-count-cell">${count}</td>
              </tr>
            `;
          }
        });
      });

      container.innerHTML = `
        <div style="font-weight: 900; font-size: 1.05rem; color: #0f172a; margin-bottom: 6px;">
          🏆 MASTER EXPEDITION DATASET
        </div>
        <table class="station-data-table">
          <thead>
            <tr>
              <th>ZONE / SPECIES</th>
              <th>TALLY RECORD</th>
              <th>COUNT</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }

    handleStationSubmission() {
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];

      // Verification of puzzle conditions if applicable
      if (roundConfig.stationType === 'stamp_puzzle') {
        const keys = Object.keys(this.stationPuzzleState.stampedSlots);
        if (keys.length < 2) {
          this.showToast('Please stamp all missing records first!', 'info');
          audio.playClick();
          return;
        }
      }

      if (roundConfig.stationType === 'chart_builder') {
        let allMatched = true;
        for (const spKey of roundConfig.targetSpecies) {
          const chartVal = this.stationPuzzleState.chartValues[spKey];
          const actualVal = this.roundTallyData[spKey] || 0;
          if (chartVal !== actualVal) {
            allMatched = false;
            break;
          }
        }
        if (!allMatched) {
          this.showToast('Adjust the chart bars so they match your field tallies!', 'info');
          audio.playClick();
          return;
        }
      }

      // Successful round submission!
      this.modalStation.classList.add('hidden');
      this.completeRound();
    }

    completeRound() {
      this.isRoundActive = false;
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      const timeTaken = Math.max(1, Math.round((Date.now() - this.roundStartTime) / 1000));

      // Calculate Round Score
      let roundBonus = 100;
      if (timeTaken < roundConfig.timeLimit * 0.6) roundBonus += 50; // Speed bonus
      if (this.currentRoundIdx === 9) roundBonus += 250; // Final Grand expedition bonus

      this.addScore(roundBonus);

      // Play victory audio
      audio.playRoundComplete();

      // If finished Round 10 -> Game Complete!
      if (this.currentRoundIdx >= ROUNDS_CONFIG.length - 1) {
        setTimeout(() => this.showFinalGameComplete(), 600);
        return;
      }

      // Populate Round Complete Modal
      document.getElementById('round-complete-title').textContent = `${roundConfig.title} Complete!`;
      document.getElementById('round-complete-desc').textContent = `All ${roundConfig.title} field records accurately collected and verified in the database.`;
      document.getElementById('round-stat-obs').textContent = Object.values(this.roundTallyData).reduce((a, b) => a + b, 0);
      document.getElementById('round-stat-score').textContent = `+${roundBonus}`;
      document.getElementById('round-stat-time').textContent = `${timeTaken}s`;
      document.getElementById('round-stat-acc').textContent = '100%';

      // Summary of tallies
      let tallySummaryHtml = '<div style="font-weight: 800; margin-bottom: 6px;">DATA COLLECTED THIS ROUND:</div>';
      roundConfig.targetSpecies.forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const count = this.roundTallyData[spKey] || 0;
        tallySummaryHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span>${spec.icon} ${spec.name}:</span>
            <span>${this.generateTallyHTML(count)} (${count})</span>
          </div>
        `;
      });
      document.getElementById('round-tally-summary').innerHTML = tallySummaryHtml;

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

      // Find top observed category
      let bestSpecies = 'birds';
      let maxCount = -1;
      for (const [sp, c] of Object.entries(this.totalCategoryCounts)) {
        if (c > maxCount) {
          maxCount = c;
          bestSpecies = sp;
        }
      }
      const bestSpecConfig = SPECIES_CONFIG[bestSpecies];

      // Populate Game Over screen
      document.getElementById('final-score').textContent = this.score.toLocaleString();
      document.getElementById('final-observations').textContent = this.totalObservations;
      document.getElementById('final-best-category').textContent = `${bestSpecConfig.icon} ${bestSpecConfig.name} (${maxCount})`;
      document.getElementById('final-time').textContent = formattedTime;
      document.getElementById('final-accuracy').textContent = '100%';
      document.getElementById('final-rank').textContent = 'CHIEF DATA SCIENTIST';

      // Final Grand Chart Showcase
      const chartContainer = document.getElementById('final-chart-bars');
      let chartHtml = '';
      const maxObs = Math.max(1, ...Object.values(this.totalCategoryCounts));

      Object.keys(SPECIES_CONFIG).forEach(spKey => {
        const spec = SPECIES_CONFIG[spKey];
        const count = this.totalCategoryCounts[spKey] || 0;
        const pct = Math.round((count / maxObs) * 100);

        chartHtml += `
          <div class="final-chart-row">
            <div class="final-chart-name">${spec.icon} ${spec.name}</div>
            <div class="final-chart-track">
              <div class="final-chart-fill" style="width: ${pct}%; background: ${spec.color};"></div>
            </div>
            <div class="final-chart-val">${count}</div>
          </div>
        `;
      });
      chartContainer.innerHTML = chartHtml;

      this.screenGameOver.classList.remove('hidden');

      // StuCent End Hook
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

    // ========================================================================
    // 12. MAIN GAME LOOP & RENDERING PIPELINE
    // ========================================================================
    mainLoop(timestamp) {
      const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
      this.lastTime = timestamp;

      this.update(dt);
      this.render();

      requestAnimationFrame(time => this.mainLoop(time));
    }

    update(dt) {
      if (!this.isGameRunning || !this.isRoundActive || this.isPaused) return;

      // Update timer
      const roundConfig = ROUNDS_CONFIG[this.currentRoundIdx];
      const elapsed = (Date.now() - this.roundStartTime) / 1000;
      this.roundTimeRemaining = Math.max(0, Math.ceil(roundConfig.timeLimit - elapsed));
      this.hudTime.textContent = `${this.roundTimeRemaining}s`;

      if (this.roundTimeRemaining <= 10) {
        this.hudTimeContainer.classList.add('urgent');
      }

      // Update Player
      this.player.update(dt, this.inputState);

      // Update Camera (smooth lerp tracking player)
      this.camera.x += (this.player.x - this.camera.x) * 0.1;
      this.camera.y += (this.player.y - this.camera.y) * 0.1;

      // Update Specimen entities
      this.specimens.forEach(spec => spec.update(dt));

      // Proximity checks for observation
      let closestSpec = null;
      let minDist = 85;

      this.specimens.forEach(spec => {
        if (!spec.observed) {
          const d = Math.hypot(this.player.x - spec.x, this.player.y - spec.y);
          if (d < minDist) {
            minDist = d;
            closestSpec = spec;
          }
        }
      });

      this.nearbySpecimen = closestSpec;

      // Check proximity to Research Station
      const distToStation = Math.hypot(this.player.x - WORLD.station.doorX, this.player.y - WORLD.station.doorY);
      this.isNearStation = distToStation < 95;

      // Update in-world Prompt
      this.updateInteractionPrompt();
    }

    updateInteractionPrompt() {
      if (this.nearbySpecimen && !this.nearbySpecimen.observed) {
        // Position above specimen
        const screenX = this.nearbySpecimen.x - this.camera.x + this.width / 2;
        const screenY = this.nearbySpecimen.y - this.camera.y + this.height / 2 - 35;

        this.interactPrompt.style.left = `${screenX}px`;
        this.interactPrompt.style.top = `${screenY}px`;
        this.promptText.textContent = `OBSERVE ${this.nearbySpecimen.config.singular.toUpperCase()}`;
        this.interactPrompt.classList.remove('hidden');
      } else if (this.isNearStation) {
        const screenX = WORLD.station.doorX - this.camera.x + this.width / 2;
        const screenY = WORLD.station.doorY - this.camera.y + this.height / 2 - 40;

        this.interactPrompt.style.left = `${screenX}px`;
        this.interactPrompt.style.top = `${screenY}px`;
        this.promptText.textContent = 'ENTER RESEARCH STATION';
        this.interactPrompt.classList.remove('hidden');
      } else {
        this.interactPrompt.classList.add('hidden');
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      ctx.save();
      // Apply Camera translation
      ctx.translate(Math.round(this.width / 2 - this.camera.x), Math.round(this.height / 2 - this.camera.y));

      // 1. Render World Park Ground & Biomes
      this.renderParkGround(ctx);

      // 2. Render Paths, Flowerbeds, Ponds
      this.renderWorldEnvironment(ctx);

      // 3. Render Research Station Building
      this.renderResearchStationBuilding(ctx);

      // 4. Render Specimens
      this.specimens.forEach(spec => spec.render(ctx));

      // 5. Render Player
      this.player.render(ctx);

      // 6. Render Overlapping Trees & Shadows
      this.renderTreeCanopies(ctx);

      ctx.restore();

      // 7. Render Mini Radar Scanner
      this.renderRadarScanner();
    }

    renderParkGround(ctx) {
      // Base grass gradient
      const grad = ctx.createLinearGradient(0, 0, 0, WORLD.height);
      grad.addColorStop(0, '#15803d');
      grad.addColorStop(0.5, '#16a34a');
      grad.addColorStop(1, '#15803d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);

      // Grass Texture accents (subtle blades)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 60; x < WORLD.width; x += 120) {
        for (let y = 60; y < WORLD.height; y += 120) {
          ctx.beginPath();
          ctx.arc(x, y, 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Zone Divider Paths (Cobblestone)
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;

      // Central North-South Main Path
      ctx.beginPath();
      ctx.roundRect(1140, 0, 120, WORLD.height, 8);
      ctx.fill();
      ctx.stroke();

      // East-West Connecting Plaza Path
      ctx.beginPath();
      ctx.roundRect(0, 840, WORLD.width, 120, 8);
      ctx.fill();
      ctx.stroke();

      // Cobblestone stones pattern
      ctx.fillStyle = 'rgba(100, 116, 139, 0.25)';
      for (let y = 30; y < WORLD.height; y += 40) {
        ctx.beginPath();
        ctx.ellipse(1180, y, 16, 8, 0.2, 0, Math.PI * 2);
        ctx.ellipse(1220, y + 15, 14, 7, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    renderWorldEnvironment(ctx) {
      // 1. Flower Patches
      WORLD.flowerPatches.forEach(fp => {
        ctx.fillStyle = fp.color;
        for (let i = 0; i < 7; i++) {
          const ang = (i * Math.PI * 2) / 7;
          const fx = fp.x + Math.cos(ang) * (fp.r * 0.6);
          const fy = fp.y + Math.sin(ang) * (fp.r * 0.6);

          ctx.beginPath();
          ctx.arc(fx, fy, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Lily Pond
      WORLD.ponds.forEach(pond => {
        // Water base
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(pond.x, pond.y, pond.rx, pond.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Water ripples
        const time = Date.now() * 0.002;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(pond.x + Math.sin(time) * 20, pond.y + Math.cos(time) * 15, pond.rx * 0.6, pond.ry * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Lily Pads
        pond.lilypads.forEach(lp => {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(lp.x, lp.y, lp.r, 0.4, Math.PI * 2 - 0.4);
          ctx.lineTo(lp.x, lp.y);
          ctx.closePath();
          ctx.fill();
          // Pink lily flower
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(lp.x + 4, lp.y - 4, lp.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // 3. Park Benches
      WORLD.benches.forEach(b => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(b.x - b.w/2, b.y - b.h/2 + 6, b.w, 4);
      });

      // 4. Signposts
      WORLD.signposts.forEach(sp => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(sp.x - 4, sp.y - 10, 8, 30);
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sp.x - 70, sp.y - 30, 140, 24, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sp.text, sp.x, sp.y - 14);
      });
    }

    renderResearchStationBuilding(ctx) {
      const s = WORLD.station;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(s.x - s.width/2 - 10, s.y - s.height/2 + 10, s.width + 20, s.height + 10, 16);
      ctx.fill();

      // Main Building Body (High-tech Eco Research Lab)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(s.x - s.width/2, s.y - s.height/2, s.width, s.height, 14);
      ctx.fill();
      ctx.stroke();

      // Roof (Solar Blue Panel)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(s.x - s.width/2 + 10, s.y - s.height/2 + 8, s.width - 20, 44, 8);
      ctx.fill();

      // Solar Panel Grid Lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      for (let sx = s.x - s.width/2 + 25; sx < s.x + s.width/2 - 10; sx += 24) {
        ctx.beginPath();
        ctx.moveTo(sx, s.y - s.height/2 + 8);
        ctx.lineTo(sx, s.y - s.height/2 + 52);
        ctx.stroke();
      }

      // Station Observatory Dome
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.beginPath();
      ctx.arc(s.x, s.y - s.height/2 - 10, 32, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Satellite Dish Antenna
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(s.x + 60, s.y - s.height/2 - 14, 18, 9, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x + 60, s.y - s.height/2 - 14);
      ctx.lineTo(s.x + 50, s.y - s.height/2 + 8);
      ctx.stroke();

      // Front Research Station Sign
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(s.x - 70, s.y - 12, 140, 22, 6);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔬 RESEARCH LAB', s.x, s.y + 4);

      // Glass Sliding Doors
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(s.x - 28, s.y + 24, 56, 50);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.strokeRect(s.x - 28, s.y + 24, 56, 50);

      // Entrance Glow Mat
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.ellipse(s.doorX, s.doorY, 40, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    renderTreeCanopies(ctx) {
      // Render Lush swaying trees
      const sway = Math.sin(Date.now() * 0.002) * 4;

      WORLD.trees.forEach(t => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(t.x, t.y + 20, t.r * 0.85, t.r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Trunk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x - 10, t.y - 10, 20, 32);

        // Canopy
        if (t.type === 'pine') {
          // Tiered Pine Tree
          ctx.fillStyle = '#14532d';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(t.x + sway * (i + 1) * 0.3, t.y - 70 - i * 25);
            ctx.lineTo(t.x + t.r - i * 8, t.y - 20 - i * 25);
            ctx.lineTo(t.x - t.r + i * 8, t.y - 20 - i * 25);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Lush Oak / Apple Tree
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(t.x + sway, t.y - 45, t.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(t.x - 14 + sway, t.y - 55, t.r * 0.65, 0, Math.PI * 2);
          ctx.arc(t.x + 14 + sway, t.y - 55, t.r * 0.65, 0, Math.PI * 2);
          ctx.fill();

          // Red apples if apple tree
          if (t.type === 'apple') {
            ctx.fillStyle = '#ef4444';
            [-16, 0, 18, -8, 12].forEach((ox, i) => {
              ctx.beginPath();
              ctx.arc(t.x + ox + sway, t.y - 40 - (i % 3) * 12, 5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
      });
    }

    renderRadarScanner() {
      const rctx = this.radarCtx;
      rctx.clearRect(0, 0, 100, 100);

      const scale = 100 / WORLD.width;

      // Draw Station Icon on Radar
      const stX = WORLD.station.x * scale;
      const stY = WORLD.station.y * scale;
      rctx.fillStyle = '#38bdf8';
      rctx.fillRect(stX - 3, stY - 3, 6, 6);

      // Draw Specimens
      this.specimens.forEach(spec => {
        const sx = spec.x * scale;
        const sy = spec.y * scale;

        if (spec.observed) {
          rctx.fillStyle = '#15803d';
          rctx.fillRect(sx - 1, sy - 1, 2, 2);
        } else {
          rctx.fillStyle = spec.config.color;
          rctx.beginPath();
          rctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          rctx.fill();
        }
      });

      // Draw Player blip
      const px = this.player.x * scale;
      const py = this.player.y * scale;
      rctx.fillStyle = '#facc15';
      rctx.beginPath();
      rctx.arc(px, py, 3.5, 0, Math.PI * 2);
      rctx.fill();

      // Radar Sweep Effect
      const sweepAng = (Date.now() * 0.003) % (Math.PI * 2);
      rctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      rctx.lineWidth = 1.5;
      rctx.beginPath();
      rctx.moveTo(50, 50);
      rctx.lineTo(50 + Math.cos(sweepAng) * 50, 50 + Math.sin(sweepAng) * 50);
      rctx.stroke();
    }
  }

  // ==========================================================================
  // 13. STUCENT INTEGRATION EXPORTS & BOOTSTRAP
  // ==========================================================================
  window.game = window.game || {};

  window.game.init = function(config) {
    window.game.config = config || {};
    console.log('[Data Detective] Initialized with config:', config);
  };

  if (!window.game.end) {
    window.game.end = function(result) {
      console.log('[Data Detective] Game finished with result:', result);
    };
  }

  // Launch on DOM ready
  let gameInstance = null;
  const initGame = () => {
    if (!gameInstance) {
      gameInstance = new DataDetectiveGame();
      window.dataDetectiveInstance = gameInstance;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
