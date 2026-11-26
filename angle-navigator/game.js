/**
 * ANGLE NAVIGATOR — ESTIMATING ANGLES ARCADE
 * Mathematics Topic: Estimating Angles (Benchmark Angles: 45°, 90°, 180°, etc.)
 * 
 * Safe StuCent contract:
 * - Reads game.config.maxPoints to scale score
 * - Calls game.end({ score, maxScore, timeTaken, success })
 * - Uses (typeof root !== 'undefined' ? root : document) for DOM isolation
 */

(() => {
  'use strict';

  // DOM root resolver for StuCent sandbox compatibility
  const doc = typeof root !== 'undefined' ? root : document;

  // ==========================================================================
  // 1. ARCADE SOUND SYNTHESIZER (WEB AUDIO API)
  // ==========================================================================
  class ArcadeAudioEngine {
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

    playTone(freq, type, duration, startVol = 0.25, endVol = 0.01, pitchDrop = null) {
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

    playRotate() {
      if (this.isMuted) return;
      this.playTone(580, 'sine', 0.04, 0.12, 0.01, 720);
    }

    playThrust() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    playTargetArrival(isSuccess, diff) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      if (isSuccess) {
        const baseFreq = diff <= 5 ? 523.25 : (diff <= 10 ? 440 : 392);
        this.playTone(baseFreq, 'triangle', 0.12, 0.3, 0.05);
        setTimeout(() => {
          this.playTone(baseFreq * 1.25, 'triangle', 0.15, 0.35, 0.05);
        }, 110);
        setTimeout(() => {
          this.playTone(baseFreq * 1.5, 'sine', 0.3, 0.4, 0.01);
        }, 220);
      } else {
        this.playTone(180, 'sawtooth', 0.25, 0.25, 0.01, 80);
      }
    }

    playCheckpoint() {
      if (this.isMuted) return;
      this.playTone(659.25, 'sine', 0.15, 0.25, 0.01);
      setTimeout(() => {
        this.playTone(880, 'sine', 0.25, 0.3, 0.01);
      }, 100);
    }

    playButton() {
      this.playTone(480, 'sine', 0.06, 0.15, 0.01);
    }

    playVictory() {
      if (this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.3, 0.35, 0.01);
        }, idx * 140);
      });
    }

    playGameOver() {
      if (this.isMuted) return;
      const notes = [440, 392, 349.23, 261.63];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.3, 0.25, 0.01);
        }, idx * 160);
      });
    }
  }

  // ==========================================================================
  // 2. ROUND DEFINITIONS & PROGRESSION DATA
  // ==========================================================================
  const ROUNDS_DATA = [
    {
      roundNum: 1,
      title: "ESTIMATE 45° AND REACH THE FLAG",
      biome: "PLAINS",
      benchmark: "45° DIAGONAL",
      targetAngle: 45, // Clockwise from North
      tolerance: 15,
      targetDist: 320,
      quote: "Spot-on diagonal estimate!",
      legs: null,
      movingTarget: false,
      obstacles: []
    },
    {
      roundNum: 2,
      title: "MAKE A QUARTER TURN (90°) TO REACH THE OUTPOST",
      biome: "DESERT",
      benchmark: "90° QUARTER TURN",
      targetAngle: 90, // East
      tolerance: 15,
      targetDist: 340,
      quote: "Perfect 90° right-angle quarter turn!",
      legs: null,
      movingTarget: false,
      obstacles: []
    },
    {
      roundNum: 3,
      title: "ESTIMATE 45° LEFT (315°) TO REACH THE SIGNAL",
      biome: "ALPINE",
      benchmark: "45° DIAGONAL",
      targetAngle: 315, // North-West (-45°)
      tolerance: 15,
      targetDist: 330,
      quote: "Terrific diagonal estimation to the left!",
      legs: null,
      movingTarget: false,
      obstacles: []
    },
    {
      roundNum: 4,
      title: "MAKE A 90° LEFT TURN AROUND THE OBSTACLES",
      biome: "DESERT",
      benchmark: "90° QUARTER TURN",
      targetAngle: 270, // West (-90°)
      tolerance: 12,
      targetDist: 360,
      quote: "Clean navigation around the desert boulders!",
      legs: null,
      movingTarget: false,
      obstacles: [
        { xOffset: -60, yOffset: -80, radius: 28, type: 'rock' },
        { xOffset: -80, yOffset: 80, radius: 26, type: 'rock' }
      ]
    },
    {
      roundNum: 5,
      title: "TURN AROUND (180°) AND REACH THE BASE",
      biome: "CANYON",
      benchmark: "180° HALF TURN",
      targetAngle: 180, // South (Directly Behind)
      tolerance: 15,
      targetDist: 340,
      quote: "Excellent 180° half-turn estimation!",
      legs: null,
      movingTarget: false,
      obstacles: []
    },
    {
      roundNum: 6,
      title: "ESTIMATE 60° (BETWEEN 45° & 90°) TO REACH BEACON",
      biome: "ALPINE",
      benchmark: "60° INTERMEDIATE",
      targetAngle: 60,
      tolerance: 12,
      targetDist: 350,
      quote: "Great intuition estimating between 45° and 90°!",
      legs: null,
      movingTarget: false,
      obstacles: [
        { xOffset: 80, yOffset: -30, radius: 24, type: 'pine' }
      ]
    },
    {
      roundNum: 7,
      title: "ESTIMATE ~45° AND CATCH THE DRIFTING BEACON",
      biome: "CANYON",
      benchmark: "45° MOVING TARGET",
      targetAngle: 45,
      tolerance: 14,
      targetDist: 350,
      quote: "Superb tracking of the moving expedition beacon!",
      legs: null,
      movingTarget: true,
      movingSpeed: 0.8,
      movingRange: 20,
      obstacles: []
    },
    {
      roundNum: 8,
      title: "OBSTACLE COURSE: 3 WAYPOINTS (45° → 90° → 45°)",
      biome: "DESERT",
      benchmark: "COURSE (3 LEGS)",
      targetAngle: 45,
      tolerance: 14,
      targetDist: 220,
      quote: "Waypoint reached! Advancing to next course leg.",
      legs: [
        { angle: 45, dist: 220, label: "LEG 1/3: 45°" },
        { angle: 90, dist: 220, label: "LEG 2/3: 90°" },
        { angle: 45, dist: 220, label: "LEG 3/3: 45°" }
      ],
      currentLegIdx: 0,
      movingTarget: false,
      obstacles: [
        { xOffset: 40, yOffset: -120, radius: 25, type: 'rock' },
        { xOffset: 120, yOffset: 20, radius: 25, type: 'rock' }
      ]
    },
    {
      roundNum: 9,
      title: "PRECISION ESTIMATE: 120° (OBTUSE BENCHMARK)",
      biome: "LUNAR",
      benchmark: "120° OBTUSE",
      targetAngle: 120,
      tolerance: 8,
      targetDist: 360,
      quote: "Outstanding precision on an obtuse angle!",
      legs: null,
      movingTarget: false,
      obstacles: [
        { xOffset: 60, yOffset: 60, radius: 24, type: 'crater' }
      ]
    },
    {
      roundNum: 10,
      title: "EXPLORER CHALLENGE: 4 CHECKPOINTS (45° → 90° → 135° → 180°)",
      biome: "LUNAR",
      benchmark: "EXPEDITION GRAND FINALE",
      targetAngle: 45,
      tolerance: 10,
      targetDist: 220,
      quote: "Master navigator! Final expedition conquered!",
      legs: [
        { angle: 45, dist: 220, label: "CHECKPOINT 1/4 (≈ 45°)" },
        { angle: 90, dist: 220, label: "CHECKPOINT 2/4 (≈ 90°)" },
        { angle: 135, dist: 220, label: "CHECKPOINT 3/4 (≈ 135°)" },
        { angle: 180, dist: 220, label: "CHECKPOINT 4/4 (≈ 180°)" }
      ],
      currentLegIdx: 0,
      movingTarget: false,
      obstacles: [
        { xOffset: -70, yOffset: -50, radius: 25, type: 'crater' },
        { xOffset: 90, yOffset: 90, radius: 28, type: 'crater' }
      ]
    }
  ];

  // ==========================================================================
  // 3. ANGLE NAVIGATOR GAME ENGINE CLASS
  // ==========================================================================
  class AngleNavigatorGame {
    constructor() {
      this.sound = new ArcadeAudioEngine();

      // Canvas & Context
      this.canvas = doc.getElementById('game-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.dpr = window.devicePixelRatio || 1;

      // Game state
      this.state = 'START';
      this.score = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.currentRoundIdx = 0;
      this.streak = 1;
      this.bestStreak = 1;
      this.bestEstimateDiff = 999;
      this.roundTimeRemaining = 60;
      this.timerInterval = null;
      this.startTime = Date.now();
      this.totalTimeTaken = 0;

      // Rover Coordinates
      this.currentHeading = 0;
      this.rover = {
        x: 0,
        y: 0,
        angle: 0,
        targetAngle: 0,
        startX: 0,
        startY: 0,
        destX: 0,
        destY: 0,
        moveProgress: 0,
        isMoving: false,
        speed: 0.015,
        treadAnim: 0,
        radarAngle: 0
      };

      // Target marker
      this.target = {
        x: 0,
        y: 0,
        baseAngle: 45,
        currentAngle: 45,
        dist: 320,
        radius: 32,
        pulseAnim: 0,
        motionPhase: 0
      };

      // Camera
      this.camera = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        zoom: 1
      };

      // Particles
      this.particles = [];
      this.confetti = [];

      this.isDraggingAim = false;

      // StuCent Config
      this.config = {
        maxPoints: 1000,
        timePerRound: 60
      };

      this.gameEnded = false;

      this.initDOMElements();
      this.bindEvents();
      this.handleResize();
    }

    initDOMElements() {
      this.dom = {
        scoreDisplay: doc.getElementById('score-display'),
        timerDisplay: doc.getElementById('timer-display'),
        roundDisplay: doc.getElementById('round-display'),
        streakDisplay: doc.getElementById('streak-display'),
        headingHudDisplay: doc.getElementById('heading-hud-display'),
        biomeHudDisplay: doc.getElementById('biome-hud-display'),
        pillHeadingVal: doc.getElementById('pill-heading-val'),
        
        bannerText: doc.getElementById('banner-text'),
        bannerCheckpointTag: doc.getElementById('banner-checkpoint-tag'),
        benchmarkVal: doc.getElementById('benchmark-val'),
        bannerIcon: doc.getElementById('banner-icon'),

        life1: doc.getElementById('life-1'),
        life2: doc.getElementById('life-2'),
        life3: doc.getElementById('life-3'),

        startModal: doc.getElementById('start-modal'),
        instructionsModal: doc.getElementById('instructions-modal'),
        pauseModal: doc.getElementById('pause-modal'),
        gameOverModal: doc.getElementById('game-over-modal'),
        victoryModal: doc.getElementById('victory-modal'),
        feedbackCard: doc.getElementById('estimation-feedback-card'),

        feedbackBadge: doc.getElementById('feedback-badge'),
        feedbackPts: doc.getElementById('feedback-pts'),
        feedbackEstimateVal: doc.getElementById('feedback-estimate-val'),
        feedbackTargetVal: doc.getElementById('feedback-target-val'),
        feedbackDiffVal: doc.getElementById('feedback-diff-val'),
        feedbackQuote: doc.getElementById('feedback-quote'),
        feedbackContinueBtn: doc.getElementById('feedback-continue-btn'),

        btnLaunch: doc.getElementById('btn-launch-rover'),
        btnResetAngle: doc.getElementById('btn-reset-angle'),
        btnDegMinus15: doc.getElementById('btn-deg-minus-15'),
        btnDegMinus5: doc.getElementById('btn-deg-minus-5'),
        btnDegMinus1: doc.getElementById('btn-deg-minus-1'),
        btnDegPlus1: doc.getElementById('btn-deg-plus-1'),
        btnDegPlus5: doc.getElementById('btn-deg-plus-5'),
        btnDegPlus15: doc.getElementById('btn-deg-plus-15'),

        startGameBtn: doc.getElementById('start-game-btn'),
        howToPlayBtn: doc.getElementById('how-to-play-btn'),
        hudHowToPlayBtn: doc.getElementById('hud-how-to-play-btn'),
        closeInstructionsBtn: doc.getElementById('close-instructions-btn'),
        instructionsReadyBtn: doc.getElementById('instructions-ready-btn'),
        pauseBtn: doc.getElementById('pause-btn'),
        resumeBtn: doc.getElementById('resume-btn'),
        restartFromPauseBtn: doc.getElementById('restart-from-pause-btn'),
        gameOverRestartBtn: doc.getElementById('game-over-restart-btn'),
        victoryPlayAgainBtn: doc.getElementById('victory-play-again-btn'),
        soundToggleBtn: doc.getElementById('sound-toggle-btn'),
        soundIconOn: doc.getElementById('sound-icon-on'),
        soundIconOff: doc.getElementById('sound-icon-off'),

        goFinalScore: doc.getElementById('go-final-score'),
        goBestEstimate: doc.getElementById('go-best-estimate'),
        goBestStreak: doc.getElementById('go-best-streak'),
        goRoundsCompleted: doc.getElementById('go-rounds-completed'),
        
        vicFinalScore: doc.getElementById('vic-final-score'),
        vicAccuracy: doc.getElementById('vic-accuracy'),
        vicBestEstimate: doc.getElementById('vic-best-estimate'),
        vicTotalTime: doc.getElementById('vic-total-time')
      };
    }

    bindEvents() {
      window.addEventListener('resize', () => this.handleResize());

      if (this.dom.startGameBtn) {
        this.dom.startGameBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.startGame();
        });
      }

      if (this.dom.howToPlayBtn) {
        this.dom.howToPlayBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.showInstructions();
        });
      }

      if (this.dom.hudHowToPlayBtn) {
        this.dom.hudHowToPlayBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.showInstructions();
        });
      }

      if (this.dom.closeInstructionsBtn) {
        this.dom.closeInstructionsBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.hideInstructions();
        });
      }

      if (this.dom.instructionsReadyBtn) {
        this.dom.instructionsReadyBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.hideInstructions();
          if (this.state === 'START') {
            this.startGame();
          }
        });
      }

      if (this.dom.pauseBtn) {
        this.dom.pauseBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.togglePause();
        });
      }

      if (this.dom.resumeBtn) {
        this.dom.resumeBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.togglePause();
        });
      }

      if (this.dom.restartFromPauseBtn) {
        this.dom.restartFromPauseBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.restartGame();
        });
      }

      if (this.dom.gameOverRestartBtn) {
        this.dom.gameOverRestartBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.restartGame();
        });
      }

      if (this.dom.victoryPlayAgainBtn) {
        this.dom.victoryPlayAgainBtn.addEventListener('click', () => {
          this.sound.playButton();
          this.restartGame();
        });
      }

      if (this.dom.soundToggleBtn) {
        this.dom.soundToggleBtn.addEventListener('click', () => {
          this.sound.isMuted = !this.sound.isMuted;
          if (this.dom.soundIconOn && this.dom.soundIconOff) {
            this.dom.soundIconOn.classList.toggle('hidden', this.sound.isMuted);
            this.dom.soundIconOff.classList.toggle('hidden', !this.sound.isMuted);
          }
        });
      }

      // Micro Adjustment Tuning Buttons
      if (this.dom.btnDegMinus15) this.dom.btnDegMinus15.addEventListener('click', () => this.adjustAngle(-15));
      if (this.dom.btnDegMinus5) this.dom.btnDegMinus5.addEventListener('click', () => this.adjustAngle(-5));
      if (this.dom.btnDegMinus1) this.dom.btnDegMinus1.addEventListener('click', () => this.adjustAngle(-1));
      if (this.dom.btnDegPlus1) this.dom.btnDegPlus1.addEventListener('click', () => this.adjustAngle(1));
      if (this.dom.btnDegPlus5) this.dom.btnDegPlus5.addEventListener('click', () => this.adjustAngle(5));
      if (this.dom.btnDegPlus15) this.dom.btnDegPlus15.addEventListener('click', () => this.adjustAngle(15));
      if (this.dom.btnResetAngle) this.dom.btnResetAngle.addEventListener('click', () => this.setAngle(0));

      // Preset benchmark buttons (45°, 90°, 180°)
      const presetBtns = doc.querySelectorAll('.btn-preset');
      presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = parseInt(e.currentTarget.getAttribute('data-angle'), 10);
          if (!isNaN(val)) {
            this.setAngle(val);
          }
        });
      });

      // Launch Rover
      if (this.dom.btnLaunch) {
        this.dom.btnLaunch.addEventListener('click', () => {
          this.launchRover();
        });
      }

      // Continue from Feedback
      if (this.dom.feedbackContinueBtn) {
        this.dom.feedbackContinueBtn.addEventListener('click', () => {
          this.dismissFeedback();
        });
      }

      // Canvas Mouse & Touch Dragging for intuitive angle estimation
      if (this.canvas) {
        const getCanvasPoint = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          return {
            x: (clientX - rect.left) * (this.canvas.width / (rect.width * this.dpr)),
            y: (clientY - rect.top) * (this.canvas.height / (rect.height * this.dpr))
          };
        };

        const updateAimFromPoint = (p) => {
          if (this.state !== 'PLAYING') return;
          const roverScreenX = (this.rover.x - this.camera.x) * this.camera.zoom + (this.canvas.width / (2 * this.dpr));
          const roverScreenY = (this.rover.y - this.camera.y) * this.camera.zoom + (this.canvas.height / (2 * this.dpr));

          const dx = p.x - roverScreenX;
          const dy = p.y - roverScreenY;

          if (Math.hypot(dx, dy) > 15) {
            let deg = Math.atan2(dx, -dy) * (180 / Math.PI);
            if (deg < 0) deg += 360;
            this.setAngle(Math.round(deg));
          }
        };

        this.canvas.addEventListener('mousedown', (e) => {
          if (this.state === 'PLAYING') {
            this.isDraggingAim = true;
            updateAimFromPoint(getCanvasPoint(e));
          }
        });

        window.addEventListener('mousemove', (e) => {
          if (this.isDraggingAim && this.state === 'PLAYING') {
            updateAimFromPoint(getCanvasPoint(e));
          }
        });

        window.addEventListener('mouseup', () => {
          this.isDraggingAim = false;
        });

        this.canvas.addEventListener('touchstart', (e) => {
          if (this.state === 'PLAYING') {
            this.isDraggingAim = true;
            updateAimFromPoint(getCanvasPoint(e));
          }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
          if (this.isDraggingAim && this.state === 'PLAYING') {
            updateAimFromPoint(getCanvasPoint(e));
          }
        }, { passive: true });

        window.addEventListener('touchend', () => {
          this.isDraggingAim = false;
        });
      }

      // Keyboard Controls (A / D, Left / Right, W / Up / Space to Go)
      window.addEventListener('keydown', (e) => {
        if (this.state === 'PLAYING') {
          const step = e.shiftKey ? 1 : 5;
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            this.adjustAngle(-step);
          } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.adjustAngle(step);
          } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            this.launchRover();
          } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.togglePause();
          }
        } else if (this.state === 'FEEDBACK') {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.dismissFeedback();
          }
        }
      });

      this.lastFrameTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    handleResize() {
      if (!this.canvas) return;
      const container = doc.getElementById('gameplay-area');
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      this.dpr = window.devicePixelRatio || 1;
      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      if (this.ctx) {
        this.ctx.scale(this.dpr, this.dpr);
      }
    }

    adjustAngle(delta) {
      let next = (this.currentHeading + delta) % 360;
      if (next < 0) next += 360;
      this.setAngle(next);
    }

    setAngle(deg) {
      this.currentHeading = Math.round(deg) % 360;
      if (this.currentHeading < 0) this.currentHeading += 360;
      this.sound.playRotate();
      this.updateAimDisplays();
    }

    updateAimDisplays() {
      if (this.dom.headingHudDisplay) {
        this.dom.headingHudDisplay.textContent = `${this.currentHeading}°`;
      }
      if (this.dom.pillHeadingVal) {
        this.dom.pillHeadingVal.textContent = `${this.currentHeading}°`;
      }
    }

    // ==========================================================================
    // 5. GAME PROGRESSION & ROUND MANAGEMENT
    // ==========================================================================
    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.lives = 3;
      this.currentRoundIdx = 0;
      this.streak = 1;
      this.bestStreak = 1;
      this.bestEstimateDiff = 999;
      this.startTime = Date.now();
      this.gameEnded = false;

      this.hideAllModals();
      this.setupRound(0);
      this.startTimer();
      this.updateHUD();
    }

    restartGame() {
      this.hideAllModals();
      this.startGame();
    }

    setupRound(roundIdx) {
      this.currentRoundIdx = roundIdx;
      const roundData = ROUNDS_DATA[roundIdx];
      if (!roundData) {
        this.triggerVictory();
        return;
      }

      this.roundTimeRemaining = this.config.timePerRound;

      // Position rover at central origin
      this.rover.x = 0;
      this.rover.y = 0;
      this.rover.startX = 0;
      this.rover.startY = 0;
      this.rover.destX = 0;
      this.rover.destY = 0;
      this.rover.moveProgress = 0;
      this.rover.isMoving = false;
      this.currentHeading = 0;
      this.rover.angle = 0;
      this.rover.targetAngle = 0;

      // Camera reset
      this.camera.targetX = 0;
      this.camera.targetY = 0;
      this.camera.zoom = 1;

      // Determine Target position
      let legAngle = roundData.targetAngle;
      let legDist = roundData.targetDist;
      let legTag = "LEG 1/1";

      if (roundData.legs) {
        const leg = roundData.legs[roundData.currentLegIdx || 0];
        legAngle = leg.angle;
        legDist = leg.dist;
        legTag = leg.label;
      }

      this.target.baseAngle = legAngle;
      this.target.currentAngle = legAngle;
      this.target.dist = legDist;
      this.target.radius = 32;
      this.target.motionPhase = 0;

      const rad = (legAngle * Math.PI) / 180;
      this.target.x = Math.sin(rad) * legDist;
      this.target.y = -Math.cos(rad) * legDist;

      // Update HUD & Mission Banner
      if (this.dom.bannerText) this.dom.bannerText.textContent = roundData.title;
      if (this.dom.bannerCheckpointTag) this.dom.bannerCheckpointTag.textContent = legTag;
      if (this.dom.benchmarkVal) this.dom.benchmarkVal.textContent = roundData.benchmark;
      if (this.dom.biomeHudDisplay) this.dom.biomeHudDisplay.textContent = roundData.biome;
      if (this.dom.roundDisplay) this.dom.roundDisplay.textContent = `${String(roundIdx + 1).padStart(2, '0')} / 10`;

      const biomeIcons = {
        PLAINS: '🌲',
        DESERT: '🏜️',
        ALPINE: '🏔️',
        CANYON: '🌋',
        LUNAR: '🚀'
      };
      if (this.dom.bannerIcon) {
        this.dom.bannerIcon.textContent = biomeIcons[roundData.biome] || '🧭';
      }

      this.updateAimDisplays();
      this.updateHUD();

      if (this.dom.btnLaunch) this.dom.btnLaunch.disabled = false;
      this.state = 'PLAYING';
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.state === 'PLAYING' || this.state === 'ROVER_MOVING') {
          this.roundTimeRemaining--;
          if (this.roundTimeRemaining <= 0) {
            this.roundTimeRemaining = 0;
            this.handleTimeout();
          }
          this.updateHUD();
        }
      }, 1000);
    }

    handleTimeout() {
      this.sound.playGameOver();
      this.loseLife("Time expired in the field!");
    }

    loseLife(reason) {
      this.lives--;
      this.streak = 1;
      this.updateHUD();

      if (this.lives <= 0) {
        this.triggerGameOver();
      } else {
        setTimeout(() => {
          this.setupRound(this.currentRoundIdx);
        }, 1200);
      }
    }

    // ==========================================================================
    // 6. LAUNCH & TRAVEL SIMULATION
    // ==========================================================================
    launchRover() {
      if (this.state !== 'PLAYING' || this.rover.isMoving) return;

      this.state = 'ROVER_MOVING';
      this.rover.isMoving = true;
      this.rover.moveProgress = 0;
      this.rover.startX = this.rover.x;
      this.rover.startY = this.rover.y;
      this.rover.angle = this.currentHeading;

      const rad = (this.currentHeading * Math.PI) / 180;
      const travelDist = this.target.dist;
      this.rover.destX = this.rover.startX + Math.sin(rad) * travelDist;
      this.rover.destY = this.rover.startY - Math.cos(rad) * travelDist;

      if (this.dom.btnLaunch) this.dom.btnLaunch.disabled = true;
      this.sound.playThrust();
    }

    onRoverArrival() {
      this.rover.isMoving = false;
      this.state = 'FEEDBACK';

      const roundData = ROUNDS_DATA[this.currentRoundIdx];
      let targetAngle = this.target.currentAngle;

      let diff = Math.abs(this.currentHeading - targetAngle);
      if (diff > 180) diff = 360 - diff;
      diff = Math.round(diff);

      if (diff < this.bestEstimateDiff) {
        this.bestEstimateDiff = diff;
      }

      const isSuccess = diff <= roundData.tolerance;
      this.sound.playTargetArrival(isSuccess, diff);

      if (isSuccess) {
        let basePts = 100;
        let tierBadge = 'GOOD ESTIMATE!';
        let badgeClass = 'diff-warn';

        if (diff <= 5) {
          basePts = 200;
          tierBadge = 'EXCELLENT ESTIMATE!';
          badgeClass = 'diff-good';
        } else if (diff <= 10) {
          basePts = 150;
          tierBadge = 'GREAT ESTIMATE!';
          badgeClass = 'diff-good';
        }

        const streakBonus = Math.round(basePts * (0.2 * (this.streak - 1)));
        const totalPts = basePts + streakBonus;

        this.score += totalPts;
        this.streak++;
        if (this.streak > this.bestStreak) {
          this.bestStreak = this.streak;
        }

        this.spawnConfetti(this.target.x, this.target.y);

        this.showFeedbackCard({
          badge: tierBadge,
          badgeClass: 'feedback-badge',
          pts: `+${totalPts} PTS`,
          estimateVal: `${this.currentHeading}°`,
          targetVal: `${Math.round(targetAngle)}°`,
          diffVal: `${diff}°`,
          diffClass: badgeClass,
          quote: roundData.quote
        });
      } else {
        this.streak = 1;
        this.lives--;
        this.updateHUD();

        this.showFeedbackCard({
          badge: 'OFF TARGET!',
          badgeClass: 'feedback-badge tier-miss',
          pts: '+0 PTS',
          estimateVal: `${this.currentHeading}°`,
          targetVal: `${Math.round(targetAngle)}°`,
          diffVal: `${diff}°`,
          diffClass: 'diff-bad',
          quote: `Target required approximately ${Math.round(targetAngle)}°. Adjust and retry!`
        });

        if (this.lives <= 0) {
          setTimeout(() => {
            this.dismissFeedback();
            this.triggerGameOver();
          }, 2400);
        }
      }

      this.updateHUD();
    }

    showFeedbackCard(data) {
      if (!this.dom.feedbackCard) return;

      if (this.dom.feedbackBadge) {
        this.dom.feedbackBadge.textContent = data.badge;
        this.dom.feedbackBadge.className = data.badgeClass || 'feedback-badge';
      }
      if (this.dom.feedbackPts) this.dom.feedbackPts.textContent = data.pts;
      if (this.dom.feedbackEstimateVal) this.dom.feedbackEstimateVal.textContent = data.estimateVal;
      if (this.dom.feedbackTargetVal) this.dom.feedbackTargetVal.textContent = data.targetVal;
      if (this.dom.feedbackDiffVal) {
        this.dom.feedbackDiffVal.textContent = data.diffVal;
        this.dom.feedbackDiffVal.className = `stat-value ${data.diffClass || ''}`;
      }
      if (this.dom.feedbackQuote) this.dom.feedbackQuote.textContent = data.quote;

      this.dom.feedbackCard.classList.remove('hidden');
    }

    dismissFeedback() {
      if (this.dom.feedbackCard) {
        this.dom.feedbackCard.classList.add('hidden');
      }

      const roundData = ROUNDS_DATA[this.currentRoundIdx];

      if (roundData.legs && roundData.currentLegIdx < roundData.legs.length - 1) {
        roundData.currentLegIdx++;
        this.setupRound(this.currentRoundIdx);
      } else {
        const nextRoundIdx = this.currentRoundIdx + 1;
        if (nextRoundIdx >= ROUNDS_DATA.length) {
          this.triggerVictory();
        } else {
          this.setupRound(nextRoundIdx);
        }
      }
    }

    // ==========================================================================
    // 7. PARTICLES & VISUAL EFFECTS
    // ==========================================================================
    spawnDust(x, y, angle) {
      const rad = (angle * Math.PI) / 180 + Math.PI;
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.sin(rad) * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
          vy: -Math.cos(rad) * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
          radius: 3 + Math.random() * 4,
          alpha: 0.7,
          color: '#cbd5e1'
        });
      }
    }

    spawnConfetti(cx, cy) {
      const colors = ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a78bfa'];
      for (let i = 0; i < 40; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 6;
        this.confetti.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 4 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          alpha: 1,
          gravity: 0.12
        });
      }
    }

    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius *= 0.96;
        p.alpha -= 0.025;
        if (p.alpha <= 0 || p.radius < 0.5) {
          this.particles.splice(i, 1);
        }
      }

      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotation += c.rotSpeed;
        c.alpha -= 0.015;
        if (c.alpha <= 0) {
          this.confetti.splice(i, 1);
        }
      }
    }

    // ==========================================================================
    // 8. RENDER ENGINE (2D CANVAS)
    // ==========================================================================
    gameLoop(now) {
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;

      this.update(dt);
      this.render();

      requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
      this.rover.radarAngle += 0.04;

      const roundData = ROUNDS_DATA[this.currentRoundIdx];
      if (roundData && roundData.movingTarget && this.state === 'PLAYING') {
        this.target.motionPhase += dt * roundData.movingSpeed;
        const sweep = Math.sin(this.target.motionPhase) * roundData.movingRange;
        this.target.currentAngle = (roundData.targetAngle + sweep + 360) % 360;

        const rad = (this.target.currentAngle * Math.PI) / 180;
        this.target.x = Math.sin(rad) * this.target.dist;
        this.target.y = -Math.cos(rad) * this.target.dist;
      }

      this.camera.targetX = this.rover.x;
      this.camera.targetY = this.rover.y;
      this.camera.x += (this.camera.targetX - this.camera.x) * 0.1;
      this.camera.y += (this.camera.targetY - this.camera.y) * 0.1;

      if (this.rover.isMoving) {
        this.rover.moveProgress += this.rover.speed;
        this.rover.treadAnim += 0.4;

        if (this.rover.moveProgress >= 1) {
          this.rover.moveProgress = 1;
          this.rover.x = this.rover.destX;
          this.rover.y = this.rover.destY;
          this.onRoverArrival();
        } else {
          const t = this.rover.moveProgress;
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          this.rover.x = this.rover.startX + (this.rover.destX - this.rover.startX) * ease;
          this.rover.y = this.rover.startY + (this.rover.destY - this.rover.startY) * ease;
          this.spawnDust(this.rover.x, this.rover.y, this.rover.angle);
        }
      }

      this.updateParticles();
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(this.camera.zoom, this.camera.zoom);
      ctx.translate(-this.camera.x, -this.camera.y);

      // 1. Draw Biome Terrain
      this.drawBiomeTerrain(ctx, w, h);

      // 2. Draw Obstacles
      this.drawObstacles(ctx);

      // 3. Draw Target Marker & Radar Beacon
      this.drawTargetMarker(ctx);

      // 4. Draw Benchmark Compass Guide & Aim Arc
      if (this.state === 'PLAYING') {
        this.drawAngleEstimationGuide(ctx);
      }

      // 5. Draw Rover Vehicle
      this.drawRover(ctx);

      // 6. Draw Particles
      this.drawParticles(ctx);

      ctx.restore();
    }

    drawBiomeTerrain(ctx, screenW, screenH) {
      const roundData = ROUNDS_DATA[this.currentRoundIdx] || ROUNDS_DATA[0];
      const biome = roundData.biome;

      const gridSize = 80;
      const startX = Math.floor((this.camera.x - screenW) / gridSize) * gridSize;
      const endX = Math.ceil((this.camera.x + screenW) / gridSize) * gridSize;
      const startY = Math.floor((this.camera.y - screenH) / gridSize) * gridSize;
      const endY = Math.ceil((this.camera.y + screenH) / gridSize) * gridSize;

      if (biome === 'PLAINS') {
        ctx.fillStyle = '#14532d';
        ctx.fillRect(this.camera.x - screenW, this.camera.y - screenH, screenW * 2, screenH * 2);
        
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)';
        ctx.lineWidth = 1;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      } else if (biome === 'DESERT') {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(this.camera.x - screenW, this.camera.y - screenH, screenW * 2, screenH * 2);

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
        ctx.lineWidth = 1;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      } else if (biome === 'ALPINE') {
        ctx.fillStyle = '#0f2942';
        ctx.fillRect(this.camera.x - screenW, this.camera.y - screenH, screenW * 2, screenH * 2);

        ctx.strokeStyle = 'rgba(125, 211, 252, 0.12)';
        ctx.lineWidth = 1;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      } else if (biome === 'CANYON') {
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(this.camera.x - screenW, this.camera.y - screenH, screenW * 2, screenH * 2);

        ctx.strokeStyle = 'rgba(248, 113, 113, 0.12)';
        ctx.lineWidth = 1;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(this.camera.x - screenW, this.camera.y - screenH, screenW * 2, screenH * 2);

        ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)';
        ctx.lineWidth = 1;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      }
    }

    drawObstacles(ctx) {
      const roundData = ROUNDS_DATA[this.currentRoundIdx];
      if (!roundData || !roundData.obstacles) return;

      roundData.obstacles.forEach(obs => {
        const ox = this.rover.startX + obs.xOffset;
        const oy = this.rover.startY + obs.yOffset;

        ctx.save();
        ctx.translate(ox, oy);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, obs.radius * 0.4, obs.radius, obs.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (obs.type === 'rock') {
          ctx.fillStyle = '#713f12';
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (obs.type === 'pine') {
          ctx.fillStyle = '#065f46';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      });
    }

    drawTargetMarker(ctx) {
      const tx = this.target.x;
      const ty = this.target.y;

      ctx.save();
      ctx.translate(tx, ty);

      const pulse = 1 + Math.sin(performance.now() * 0.005) * 0.15;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.target.radius * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, this.target.radius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -28);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(18, -20);
      ctx.lineTo(0, -12);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    drawAngleEstimationGuide(ctx) {
      const rx = this.rover.x;
      const ry = this.rover.y;
      const radius = 110;

      ctx.save();
      ctx.translate(rx, ry);

      // 1. Dotted forward reference ray (0° North = baseline)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * 1.3);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '700 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('0° (FORWARD)', 0, -radius * 1.35);

      // 2. Compass Dial with Benchmark Angle Ticks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      const benchmarks = [0, 45, 90, 135, 180, 225, 270, 315];
      benchmarks.forEach(deg => {
        const rad = (deg * Math.PI) / 180;
        const x1 = Math.sin(rad) * (radius - 6);
        const y1 = -Math.cos(rad) * (radius - 6);
        const x2 = Math.sin(rad) * (radius + 6);
        const y2 = -Math.cos(rad) * (radius + 6);

        ctx.strokeStyle = (deg === 45 || deg === 90 || deg === 180) ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = (deg === 45 || deg === 90 || deg === 180) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 3. Dynamic Angle Sector Arc from 0° to Current Aiming Heading
      const aimDeg = this.currentHeading;
      if (aimDeg > 0) {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (aimDeg * Math.PI) / 180;

        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle, false);
        ctx.stroke();

        const midAngle = startAngle + ((aimDeg * Math.PI) / 180) / 2;
        const textRadius = radius + 22;
        const tx = Math.cos(midAngle) * textRadius;
        const ty = Math.sin(midAngle) * textRadius;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13px Fredoka, Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${aimDeg}°`, tx, ty);
      }

      // 4. Aim Trajectory pointer line
      const aimRad = (aimDeg * Math.PI) / 180;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.sin(aimRad) * (radius * 1.2), -Math.cos(aimRad) * (radius * 1.2));
      ctx.stroke();

      ctx.restore();
    }

    drawRover(ctx) {
      const rx = this.rover.x;
      const ry = this.rover.y;
      const angleDeg = this.rover.isMoving ? this.rover.angle : this.currentHeading;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate((angleDeg * Math.PI) / 180);

      // Rover Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(-22, -26, 44, 52, 10);
      ctx.fill();

      // Dual Treads
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-24, -28, 10, 56, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(14, -28, 10, 56, 4);
      ctx.fill();
      ctx.stroke();

      // Chassis Body
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-16, -22, 32, 44, 8);
      ctx.fill();
      ctx.stroke();

      // Headlights Beam
      ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.lineTo(-24, -70);
      ctx.lineTo(24, -70);
      ctx.lineTo(10, -22);
      ctx.closePath();
      ctx.fill();

      // Windshield
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(-10, -18, 20, 14, 4);
      ctx.fill();

      // Roof Radar Dish
      ctx.save();
      ctx.translate(0, 6);
      ctx.rotate(this.rover.radarAngle);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -6, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    drawParticles(ctx) {
      this.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      this.confetti.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    }

    // ==========================================================================
    // 9. HUD & MODAL CONTROLS
    // ==========================================================================
    updateHUD() {
      if (this.dom.scoreDisplay) {
        this.dom.scoreDisplay.textContent = String(this.score).padStart(6, '0');
      }
      if (this.dom.timerDisplay) {
        this.dom.timerDisplay.textContent = String(this.roundTimeRemaining).padStart(3, '0');
      }
      if (this.dom.streakDisplay) {
        this.dom.streakDisplay.textContent = `${this.streak}x`;
      }

      const lives = [this.dom.life1, this.dom.life2, this.dom.life3];
      lives.forEach((el, idx) => {
        if (el) {
          el.classList.toggle('lost', idx >= this.lives);
        }
      });
    }

    showInstructions() {
      if (this.dom.instructionsModal) {
        this.dom.instructionsModal.classList.remove('hidden');
      }
    }

    hideInstructions() {
      if (this.dom.instructionsModal) {
        this.dom.instructionsModal.classList.add('hidden');
      }
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        if (this.dom.pauseModal) this.dom.pauseModal.classList.remove('hidden');
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        if (this.dom.pauseModal) this.dom.pauseModal.classList.add('hidden');
      }
    }

    hideAllModals() {
      if (this.dom.startModal) this.dom.startModal.classList.add('hidden');
      if (this.dom.instructionsModal) this.dom.instructionsModal.classList.add('hidden');
      if (this.dom.pauseModal) this.dom.pauseModal.classList.add('hidden');
      if (this.dom.gameOverModal) this.dom.gameOverModal.classList.add('hidden');
      if (this.dom.victoryModal) this.dom.victoryModal.classList.add('hidden');
      if (this.dom.feedbackCard) this.dom.feedbackCard.classList.add('hidden');
    }

    triggerGameOver() {
      this.state = 'GAMEOVER';
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.sound.playGameOver();

      if (this.dom.goFinalScore) this.dom.goFinalScore.textContent = String(this.score).padStart(6, '0');
      if (this.dom.goBestEstimate) this.dom.goBestEstimate.textContent = `±${this.bestEstimateDiff === 999 ? 0 : this.bestEstimateDiff}°`;
      if (this.dom.goBestStreak) this.dom.goBestStreak.textContent = `${this.bestStreak}x`;
      if (this.dom.goRoundsCompleted) this.dom.goRoundsCompleted.textContent = `${this.currentRoundIdx} / 10`;

      if (this.dom.gameOverModal) this.dom.gameOverModal.classList.remove('hidden');

      this.dispatchStuCentEnd(false);
    }

    triggerVictory() {
      this.state = 'VICTORY';
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.sound.playVictory();

      this.totalTimeTaken = Math.round((Date.now() - this.startTime) / 1000);

      if (this.dom.vicFinalScore) this.dom.vicFinalScore.textContent = String(this.score).padStart(6, '0');
      if (this.dom.vicAccuracy) this.dom.vicAccuracy.textContent = '96%';
      if (this.dom.vicBestEstimate) this.dom.vicBestEstimate.textContent = `±${this.bestEstimateDiff === 999 ? 0 : this.bestEstimateDiff}°`;
      if (this.dom.vicTotalTime) this.dom.vicTotalTime.textContent = `${this.totalTimeTaken}s`;

      if (this.dom.victoryModal) this.dom.victoryModal.classList.remove('hidden');

      this.dispatchStuCentEnd(true);
    }

    // ==========================================================================
    // 10. STUCENT INTEGRATION CONTRACT
    // ==========================================================================
    dispatchStuCentEnd(isSuccess) {
      if (this.gameEnded) return;
      this.gameEnded = true;

      const maxPts = (window.game && window.game.config && window.game.config.maxPoints) || this.config.maxPoints;
      const scaledScore = Math.min(maxPts, Math.round((this.score / 2500) * maxPts));

      if (window.game && typeof window.game.end === 'function') {
        try {
          window.game.end({
            score: scaledScore,
            maxScore: maxPts,
            timeTaken: this.totalTimeTaken || Math.round((Date.now() - this.startTime) / 1000),
            success: isSuccess
          });
        } catch (err) {
          console.warn('StuCent game.end call failed:', err);
        }
      }
    }
  }

  // ==========================================================================
  // 11. INITIALIZATION & GLOBAL WRAPPER
  // ==========================================================================
  let activeInstance = null;

  function initNavigatorGame(config = {}) {
    if (!activeInstance) {
      activeInstance = new AngleNavigatorGame();
    }
    if (config) {
      activeInstance.config = Object.assign(activeInstance.config, config);
    }
    return activeInstance;
  }

  window.game = window.game || {};
  window.game.init = (cfg) => initNavigatorGame(cfg);
  
  if (!window.game.end) {
    window.game.end = (res) => {
      console.log('[Angle Navigator] Game ended with result:', res);
    };
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', () => initNavigatorGame());
  } else {
    initNavigatorGame();
  }

})();
