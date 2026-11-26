/**
 * FRACTION FACTORY — FRACTIONS AS OPERATORS ARCADE
 * Mathematics Topic: Fractions as Operators (Year 4 Cambridge Standard)
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
  class FactoryAudioEngine {
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

    playSwitch() {
      if (this.isMuted) return;
      this.playTone(320, 'triangle', 0.08, 0.3, 0.01, 160);
      setTimeout(() => {
        this.playTone(580, 'sine', 0.06, 0.25, 0.01);
      }, 50);
    }

    playItemSorted(toTruck) {
      if (this.isMuted) return;
      if (toTruck) {
        this.playTone(523.25, 'sine', 0.08, 0.2, 0.01);
      } else {
        this.playTone(349.23, 'triangle', 0.08, 0.15, 0.01);
      }
    }

    playDeliverySuccess() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      // Happy truck horn arpeggio (F4 - A4 - C5 - F5)
      const notes = [349.23, 440.00, 523.25, 698.46];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.18, 0.35, 0.01);
        }, idx * 90);
      });
    }

    playError() {
      if (this.isMuted) return;
      this.playTone(180, 'sawtooth', 0.25, 0.3, 0.01, 90);
    }

    playButton() {
      this.playTone(440, 'sine', 0.05, 0.15, 0.01);
    }

    playVictory() {
      if (this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.3, 0.35, 0.01);
        }, idx * 130);
      });
    }

    playGameOver() {
      if (this.isMuted) return;
      const notes = [440, 392, 349.23, 261.63];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.3, 0.25, 0.01);
        }, idx * 150);
      });
    }
  }

  // ==========================================================================
  // 2. ROUND DEFINITIONS & PROGRESSION DATA
  // ==========================================================================
  const ROUNDS_DATA = [
    {
      roundNum: 1,
      title: "SEND 1/2 OF 10 BOXES TO TRUCK A",
      numerator: 1,
      denominator: 2,
      totalCount: 10,
      cargoType: "BOXES",
      conveyorSpeed: 1.0,
      lanes: 1,
      quote: "Terrific! 1/2 of 10 = 5 boxes delivered to Truck A.",
      subOrders: null
    },
    {
      roundNum: 2,
      title: "SEND 1/2 OF 12 BOTTLES TO TRUCK A",
      numerator: 1,
      denominator: 2,
      totalCount: 12,
      cargoType: "BOTTLES",
      conveyorSpeed: 1.1,
      lanes: 1,
      quote: "Smooth sorting! 1/2 of 12 = 6 cooling bottles loaded.",
      subOrders: null
    },
    {
      roundNum: 3,
      title: "SEND 1/4 OF 12 BATTERIES TO TRUCK A",
      numerator: 1,
      denominator: 4,
      totalCount: 12,
      cargoType: "BATTERIES",
      conveyorSpeed: 1.2,
      lanes: 1,
      quote: "Spot on! 1/4 of 12 = 3 power batteries to Truck A.",
      subOrders: null
    },
    {
      roundNum: 4,
      title: "SEND 3/4 OF 12 CRATES TO TRUCK A",
      numerator: 3,
      denominator: 4,
      totalCount: 12,
      cargoType: "CRATES",
      conveyorSpeed: 1.2,
      lanes: 1,
      quote: "Great fraction multiplication! 3/4 of 12 = 9 crates.",
      subOrders: null
    },
    {
      roundNum: 5,
      title: "SEND 1/3 OF 15 ENERGY CELLS TO TRUCK A",
      numerator: 1,
      denominator: 3,
      totalCount: 15,
      cargoType: "ENERGY CELLS",
      conveyorSpeed: 1.3,
      lanes: 1,
      quote: "Clean routing! 1/3 of 15 = 5 energy cells dispatched.",
      subOrders: null
    },
    {
      roundNum: 6,
      title: "SEND 2/3 OF 15 PACKAGES TO TRUCK A",
      numerator: 2,
      denominator: 3,
      totalCount: 15,
      cargoType: "PACKAGES",
      conveyorSpeed: 1.35,
      lanes: 1,
      quote: "Excellent fraction division! 2/3 of 15 = 10 packages.",
      subOrders: null
    },
    {
      roundNum: 7,
      title: "SEND 2/5 OF 20 BATTERIES TO TRUCK A",
      numerator: 2,
      denominator: 5,
      totalCount: 20,
      cargoType: "BATTERIES",
      conveyorSpeed: 1.5,
      lanes: 1,
      quote: "Fast reflexes! 2/5 of 20 = 8 batteries routed cleanly.",
      subOrders: null
    },
    {
      roundNum: 8,
      title: "SEND 3/5 OF 20 BOXES TO TRUCK A (DUAL STREAM)",
      numerator: 3,
      denominator: 5,
      totalCount: 20,
      cargoType: "BOXES",
      conveyorSpeed: 1.5,
      lanes: 2,
      quote: "Masterful dual stream management! 3/5 of 20 = 12 boxes.",
      subOrders: null
    },
    {
      roundNum: 9,
      title: "SEND 3/4 OF 20 ENERGY CELLS TO TRUCK A",
      numerator: 3,
      denominator: 4,
      totalCount: 20,
      cargoType: "ENERGY CELLS",
      conveyorSpeed: 1.65,
      lanes: 2,
      quote: "High-volume precision! 3/4 of 20 = 15 energy cells.",
      subOrders: null
    },
    {
      roundNum: 10,
      title: "FACTORY MASTER: 3 ORDERS (1/2 of 12, 3/4 of 16, 2/3 of 18)",
      numerator: 1,
      denominator: 2,
      totalCount: 12,
      cargoType: "BOXES",
      conveyorSpeed: 1.6,
      lanes: 2,
      quote: "Shift completed! All 3 master orders executed with perfection!",
      subOrders: [
        { num: 1, den: 2, count: 12, cargo: "BOXES", label: "ORDER 1/3: 1/2 of 12" },
        { num: 3, den: 4, count: 16, cargo: "ENERGY CELLS", label: "ORDER 2/3: 3/4 of 16" },
        { num: 2, den: 3, count: 18, cargo: "PACKAGES", label: "ORDER 3/3: 2/3 of 18" }
      ],
      currentSubIdx: 0
    }
  ];

  // ==========================================================================
  // 3. FRACTION FACTORY GAME ENGINE CLASS
  // ==========================================================================
  class FractionFactoryGame {
    constructor() {
      this.sound = new FactoryAudioEngine();

      this.canvas = doc.getElementById('game-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.dpr = window.devicePixelRatio || 1;

      this.state = 'START';
      this.score = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.currentRoundIdx = 0;
      this.streak = 1;
      this.bestStreak = 1;
      this.roundTimeRemaining = 60;
      this.timerInterval = null;
      this.startTime = Date.now();
      this.totalTimeTaken = 0;

      // Factory Conveyor State
      this.conveyorBeltOffset = 0;
      this.conveyorPaused = false;
      this.conveyorSpeedMultiplier = 1.0;
      this.activeGateRoute = 'TRUCK_A'; // 'TRUCK_A' or 'STORAGE'

      // Cargo batch items
      this.items = [];
      this.truckLoadedCount = 0;
      this.storageLoadedCount = 0;
      this.requiredTruckCount = 0;

      // Animated Factory Worker
      this.worker = {
        x: 360,
        y: 280,
        targetX: 360,
        targetY: 280,
        vx: 0,
        vy: 0,
        animFrame: 0,
        isCheering: false
      };

      // Particle Systems
      this.particles = [];
      this.confetti = [];

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
        fractionHudDisplay: doc.getElementById('fraction-hud-display'),
        cargoHudDisplay: doc.getElementById('cargo-hud-display'),
        
        orderText: doc.getElementById('order-text'),
        orderBadgeIcon: doc.getElementById('order-badge-icon'),
        orderStatusTag: doc.getElementById('order-status-tag'),
        fractionTargetCalc: doc.getElementById('fraction-target-calc'),
        fractionBlocksStrip: doc.getElementById('fraction-blocks-strip'),
        truckTallyVal: doc.getElementById('truck-tally-val'),

        life1: doc.getElementById('life-1'),
        life2: doc.getElementById('life-2'),
        life3: doc.getElementById('life-3'),

        startModal: doc.getElementById('start-modal'),
        instructionsModal: doc.getElementById('instructions-modal'),
        pauseModal: doc.getElementById('pause-modal'),
        gameOverModal: doc.getElementById('game-over-modal'),
        victoryModal: doc.getElementById('victory-modal'),
        feedbackCard: doc.getElementById('delivery-feedback-card'),

        feedbackBadge: doc.getElementById('feedback-badge'),
        feedbackPts: doc.getElementById('feedback-pts'),
        feedbackFractionVal: doc.getElementById('feedback-fraction-val'),
        feedbackDeliveredVal: doc.getElementById('feedback-delivered-val'),
        feedbackStorageVal: doc.getElementById('feedback-storage-val'),
        feedbackQuote: doc.getElementById('feedback-quote'),
        feedbackContinueBtn: doc.getElementById('feedback-continue-btn'),

        btnRouteTruck: doc.getElementById('btn-route-truck'),
        btnRouteStorage: doc.getElementById('btn-route-storage'),
        btnToggleSwitch: doc.getElementById('btn-toggle-switch'),
        leverArm: doc.getElementById('lever-arm'),
        btnConveyorSpeed: doc.getElementById('btn-conveyor-speed'),
        speedIcon: doc.getElementById('speed-icon'),
        speedText: doc.getElementById('speed-text'),
        btnRecallBatch: doc.getElementById('btn-recall-batch'),
        btnDispatchOrder: doc.getElementById('btn-dispatch-order'),

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
        goOrdersCompleted: doc.getElementById('go-orders-completed'),
        goBestStreak: doc.getElementById('go-best-streak'),
        goAccuracy: doc.getElementById('go-accuracy'),
        
        vicFinalScore: doc.getElementById('vic-final-score'),
        vicOrdersCompleted: doc.getElementById('vic-orders-completed'),
        vicBestStreak: doc.getElementById('vic-best-streak'),
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

      // Gate Diverter Controls
      if (this.dom.btnRouteTruck) {
        this.dom.btnRouteTruck.addEventListener('click', () => {
          this.setGateRoute('TRUCK_A');
        });
      }

      if (this.dom.btnRouteStorage) {
        this.dom.btnRouteStorage.addEventListener('click', () => {
          this.setGateRoute('STORAGE');
        });
      }

      if (this.dom.btnToggleSwitch) {
        this.dom.btnToggleSwitch.addEventListener('click', () => {
          this.toggleGateRoute();
        });
      }

      // Conveyor Speed Toggle
      if (this.dom.btnConveyorSpeed) {
        this.dom.btnConveyorSpeed.addEventListener('click', () => {
          this.toggleConveyorSpeed();
        });
      }

      // Reset / Recall Batch
      if (this.dom.btnRecallBatch) {
        this.dom.btnRecallBatch.addEventListener('click', () => {
          this.sound.playButton();
          this.resetBatch();
        });
      }

      // Dispatch Order Button
      if (this.dom.btnDispatchOrder) {
        this.dom.btnDispatchOrder.addEventListener('click', () => {
          this.dispatchTruckOrder();
        });
      }

      // Feedback Continue
      if (this.dom.feedbackContinueBtn) {
        this.dom.feedbackContinueBtn.addEventListener('click', () => {
          this.dismissFeedback();
        });
      }

      // Canvas Interactive Click & Tap on items and gate
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

        const handleCanvasTap = (p) => {
          if (this.state !== 'PLAYING') return;

          // Check if tapped on the central diverter gate (x: 400, y: 260, r: 40)
          const gateDx = p.x - 400;
          const gateDy = p.y - 260;
          if (Math.hypot(gateDx, gateDy) < 50) {
            this.toggleGateRoute();
            return;
          }

          // Check if tapped on any moving cargo item to directly toggle its lane route
          for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.status === 'ON_CONVEYOR') {
              const dx = p.x - item.x;
              const dy = p.y - item.y;
              if (Math.hypot(dx, dy) < 26) {
                item.routeTag = item.routeTag === 'TRUCK' ? 'STORAGE' : 'TRUCK';
                this.sound.playSwitch();
                this.spawnSparkle(item.x, item.y, item.routeTag === 'TRUCK' ? '#38bdf8' : '#f59e0b');
                return;
              }
            }
          }

          // Move worker character to tapped point
          this.worker.targetX = p.x;
          this.worker.targetY = p.y;
        };

        this.canvas.addEventListener('click', (e) => handleCanvasTap(getCanvasPoint(e)));
        this.canvas.addEventListener('touchstart', (e) => {
          if (e.touches.length > 0) {
            handleCanvasTap(getCanvasPoint(e));
          }
        }, { passive: true });
      }

      // Keyboard Controls (WASD / Arrows to move worker, Space / S to flip gate, Enter to dispatch)
      window.addEventListener('keydown', (e) => {
        if (this.state === 'PLAYING') {
          if (e.key === ' ' || e.key === 's' || e.key === 'S' || e.key === 'Tab') {
            e.preventDefault();
            this.toggleGateRoute();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            this.dispatchTruckOrder();
          } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.resetBatch();
          } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.worker.x -= 20;
          } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.worker.x += 20;
          } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            this.worker.y -= 20;
          } else if (e.key === 'ArrowDown') {
            this.worker.y += 20;
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

    setGateRoute(route) {
      this.activeGateRoute = route;
      this.sound.playSwitch();
      this.updateGateButtons();
    }

    toggleGateRoute() {
      this.activeGateRoute = this.activeGateRoute === 'TRUCK_A' ? 'STORAGE' : 'TRUCK_A';
      this.sound.playSwitch();
      this.updateGateButtons();
    }

    updateGateButtons() {
      if (this.dom.btnRouteTruck) {
        this.dom.btnRouteTruck.classList.toggle('active', this.activeGateRoute === 'TRUCK_A');
      }
      if (this.dom.btnRouteStorage) {
        this.dom.btnRouteStorage.classList.toggle('active', this.activeGateRoute === 'STORAGE');
      }
    }

    toggleConveyorSpeed() {
      if (this.conveyorSpeedMultiplier === 1.0) {
        this.conveyorSpeedMultiplier = 2.0;
        if (this.dom.speedText) this.dom.speedText.textContent = "SPEED: 2x";
      } else if (this.conveyorSpeedMultiplier === 2.0) {
        this.conveyorSpeedMultiplier = 0.5;
        if (this.dom.speedText) this.dom.speedText.textContent = "SPEED: 0.5x";
      } else {
        this.conveyorSpeedMultiplier = 1.0;
        if (this.dom.speedText) this.dom.speedText.textContent = "SPEED: 1x";
      }
      this.sound.playButton();
    }

    // ==========================================================================
    // 4. GAME PROGRESSION & ORDER MANAGEMENT
    // ==========================================================================
    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.lives = 3;
      this.currentRoundIdx = 0;
      this.streak = 1;
      this.bestStreak = 1;
      this.startTime = Date.now();
      this.gameEnded = false;

      this.hideAllModals();
      this.setupOrder(0);
      this.startTimer();
      this.updateHUD();
    }

    restartGame() {
      this.hideAllModals();
      this.startGame();
    }

    setupOrder(orderIdx) {
      this.currentRoundIdx = orderIdx;
      const roundData = ROUNDS_DATA[orderIdx];
      if (!roundData) {
        this.triggerVictory();
        return;
      }

      this.roundTimeRemaining = this.config.timePerRound;

      let num = roundData.numerator;
      let den = roundData.denominator;
      let total = roundData.totalCount;
      let cargo = roundData.cargoType;
      let label = roundData.title;

      if (roundData.subOrders) {
        const sub = roundData.subOrders[roundData.currentSubIdx || 0];
        num = sub.num;
        den = sub.den;
        total = sub.count;
        cargo = sub.cargo;
        label = `SEND ${num}/${den} OF ${total} ${cargo} TO TRUCK A`;
      }

      this.requiredTruckCount = Math.round((num / den) * total);
      this.truckLoadedCount = 0;
      this.storageLoadedCount = 0;

      // Spawn cargo batch items on the inflow feeder conveyor
      this.spawnCargoBatch(total, cargo, roundData.conveyorSpeed, roundData.lanes);

      // Update Order Banner & Bar Model
      if (this.dom.orderText) this.dom.orderText.textContent = label;
      if (this.dom.fractionHudDisplay) this.dom.fractionHudDisplay.textContent = `${num}/${den} of ${total}`;
      if (this.dom.cargoHudDisplay) this.dom.cargoHudDisplay.textContent = cargo;
      if (this.dom.roundDisplay) this.dom.roundDisplay.textContent = `${String(orderIdx + 1).padStart(2, '0')} / 10`;
      if (this.dom.fractionTargetCalc) {
        this.dom.fractionTargetCalc.textContent = `${num}/${den} of ${total} = ${this.requiredTruckCount}`;
      }

      // Render Fraction Bar Model Blocks (e.g. 4 parts, 3 active)
      if (this.dom.fractionBlocksStrip) {
        this.dom.fractionBlocksStrip.innerHTML = '';
        for (let i = 0; i < den; i++) {
          const blk = doc.createElement('span');
          blk.className = `f-block ${i < num ? 'active' : ''}`;
          blk.title = `Part ${i + 1}/${den} (${Math.round(total / den)} items)`;
          this.dom.fractionBlocksStrip.appendChild(blk);
        }
      }

      // Icon for cargo
      const cargoIcons = {
        BOXES: '📦',
        BOTTLES: '🧃',
        BATTERIES: '🔋',
        CRATES: '🪵',
        'ENERGY CELLS': '⚡',
        PACKAGES: '⚙️'
      };
      if (this.dom.orderBadgeIcon) {
        this.dom.orderBadgeIcon.textContent = cargoIcons[cargo] || '📦';
      }

      this.updateTallyDisplay();
      this.updateHUD();
      this.state = 'PLAYING';
    }

    spawnCargoBatch(count, cargoType, speed, lanes = 1) {
      this.items = [];
      const startX = 80;
      const startY = 120;
      const spacing = 48;

      for (let i = 0; i < count; i++) {
        const laneIdx = i % lanes;
        const laneOffsetY = laneIdx * 24;

        this.items.push({
          id: i,
          cargoType: cargoType,
          x: startX - (i * spacing),
          y: startY + laneOffsetY,
          progress: -(i * 0.08), // Staggered entry onto conveyor
          speed: 0.0035 * speed,
          status: 'ON_CONVEYOR', // 'ON_CONVEYOR', 'LOADED_TRUCK', 'IN_STORAGE'
          routeTag: 'AUTO', // 'AUTO' uses current gate, or 'TRUCK' / 'STORAGE'
          rotation: 0
        });
      }
    }

    resetBatch() {
      const roundData = ROUNDS_DATA[this.currentRoundIdx];
      let total = roundData.totalCount;
      let cargo = roundData.cargoType;
      if (roundData.subOrders) {
        const sub = roundData.subOrders[roundData.currentSubIdx || 0];
        total = sub.count;
        cargo = sub.cargo;
      }

      this.truckLoadedCount = 0;
      this.storageLoadedCount = 0;
      this.spawnCargoBatch(total, cargo, roundData.conveyorSpeed, roundData.lanes);
      this.updateTallyDisplay();
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.state === 'PLAYING') {
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
      this.loseLife("Time expired in the factory shift!");
    }

    loseLife(reason) {
      this.lives--;
      this.streak = 1;
      this.updateHUD();

      if (this.lives <= 0) {
        this.triggerGameOver();
      } else {
        setTimeout(() => {
          this.setupOrder(this.currentRoundIdx);
        }, 1200);
      }
    }

    updateTallyDisplay() {
      if (this.dom.truckTallyVal) {
        this.dom.truckTallyVal.textContent = `${this.truckLoadedCount} / ${this.requiredTruckCount}`;
        this.dom.truckTallyVal.classList.toggle('exact', this.truckLoadedCount === this.requiredTruckCount);
        this.dom.truckTallyVal.classList.toggle('over', this.truckLoadedCount > this.requiredTruckCount);
      }
    }

    // ==========================================================================
    // 5. CONVEYOR & ROUTING ENGINE
    // ==========================================================================
    dispatchTruckOrder() {
      if (this.state !== 'PLAYING') return;

      const roundData = ROUNDS_DATA[this.currentRoundIdx];
      const isSuccess = this.truckLoadedCount === this.requiredTruckCount;

      if (isSuccess) {
        this.state = 'FEEDBACK';
        this.sound.playDeliverySuccess();

        const basePts = 100;
        const timeBonus = Math.round(this.roundTimeRemaining * 1.5);
        const streakBonus = Math.round(basePts * (0.25 * (this.streak - 1)));
        const totalPts = basePts + timeBonus + streakBonus;

        this.score += totalPts;
        this.streak++;
        if (this.streak > this.bestStreak) {
          this.bestStreak = this.streak;
        }

        // Celebrate with confetti at truck
        this.spawnConfetti(720, 160);
        this.worker.isCheering = true;

        let num = roundData.numerator;
        let den = roundData.denominator;
        let total = roundData.totalCount;
        let cargo = roundData.cargoType;
        if (roundData.subOrders) {
          const sub = roundData.subOrders[roundData.currentSubIdx || 0];
          num = sub.num;
          den = sub.den;
          total = sub.count;
          cargo = sub.cargo;
        }

        this.showFeedbackCard({
          badge: 'DELIVERY COMPLETE!',
          badgeClass: 'feedback-badge',
          pts: `+${totalPts} PTS`,
          fractionVal: `${num}/${den} of ${total}`,
          deliveredVal: `${this.truckLoadedCount} ${cargo}`,
          storageVal: `${this.storageLoadedCount} ${cargo}`,
          quote: roundData.quote
        });
      } else {
        // Not exact quantity
        this.sound.playError();
        const diff = this.truckLoadedCount - this.requiredTruckCount;
        let msg = "";
        if (diff < 0) {
          msg = `Need ${Math.abs(diff)} more items in Truck A! (Currently ${this.truckLoadedCount}/${this.requiredTruckCount})`;
        } else {
          msg = `Too many items in Truck A! (${this.truckLoadedCount}/${this.requiredTruckCount}) - Click Reset Batch to retry!`;
        }

        if (this.dom.orderStatusTag) {
          this.dom.orderStatusTag.textContent = msg;
          this.dom.orderStatusTag.style.background = 'rgba(244, 63, 94, 0.3)';
          this.dom.orderStatusTag.style.color = '#fecdd3';
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
      if (this.dom.feedbackFractionVal) this.dom.feedbackFractionVal.textContent = data.fractionVal;
      if (this.dom.feedbackDeliveredVal) this.dom.feedbackDeliveredVal.textContent = data.deliveredVal;
      if (this.dom.feedbackStorageVal) this.dom.feedbackStorageVal.textContent = data.storageVal;
      if (this.dom.feedbackQuote) this.dom.feedbackQuote.textContent = data.quote;

      this.dom.feedbackCard.classList.remove('hidden');
    }

    dismissFeedback() {
      if (this.dom.feedbackCard) {
        this.dom.feedbackCard.classList.add('hidden');
      }

      this.worker.isCheering = false;
      const roundData = ROUNDS_DATA[this.currentRoundIdx];

      if (roundData.subOrders && roundData.currentSubIdx < roundData.subOrders.length - 1) {
        roundData.currentSubIdx++;
        this.setupOrder(this.currentRoundIdx);
      } else {
        const nextIdx = this.currentRoundIdx + 1;
        if (nextIdx >= ROUNDS_DATA.length) {
          this.triggerVictory();
        } else {
          this.setupOrder(nextIdx);
        }
      }
    }

    // ==========================================================================
    // 6. PARTICLES & VISUAL EFFECTS
    // ==========================================================================
    spawnSparkle(x, y, color = '#38bdf8') {
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3;
        this.particles.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          color
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
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
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
    // 7. RENDER ENGINE (2D CANVAS)
    // ==========================================================================
    gameLoop(now) {
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;

      this.update(dt);
      this.render();

      requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
      if (this.state === 'PLAYING') {
        this.conveyorBeltOffset = (this.conveyorBeltOffset + 2 * this.conveyorSpeedMultiplier) % 20;

        // Move Worker towards target
        this.worker.x += (this.worker.targetX - this.worker.x) * 0.1;
        this.worker.y += (this.worker.targetY - this.worker.y) * 0.1;

        // Advance cargo items along conveyor belts
        this.items.forEach(item => {
          if (item.status === 'ON_CONVEYOR') {
            item.progress += item.speed * this.conveyorSpeedMultiplier;

            if (item.progress > 0) {
              // Path 1: Feeder conveyor from (80, 140) to Diverter (400, 260)
              if (item.progress <= 0.5) {
                const t = item.progress / 0.5;
                item.x = 80 + (400 - 80) * t;
                item.y = 140 + (260 - 140) * t;
              } else {
                // Path 2: Past diverter gate
                const chosenRoute = item.routeTag === 'AUTO' ? this.activeGateRoute : (item.routeTag === 'TRUCK' ? 'TRUCK_A' : 'STORAGE');
                const t = (item.progress - 0.5) / 0.5;

                if (chosenRoute === 'TRUCK_A') {
                  // Upper branch to Truck (720, 160)
                  item.x = 400 + (720 - 400) * t;
                  item.y = 260 + (160 - 260) * t;

                  if (item.progress >= 1.0) {
                    item.status = 'LOADED_TRUCK';
                    this.truckLoadedCount++;
                    this.sound.playItemSorted(true);
                    this.spawnSparkle(720, 160, '#10b981');
                    this.updateTallyDisplay();
                  }
                } else {
                  // Lower branch to Storage (720, 380)
                  item.x = 400 + (720 - 400) * t;
                  item.y = 260 + (380 - 260) * t;

                  if (item.progress >= 1.0) {
                    item.status = 'IN_STORAGE';
                    this.storageLoadedCount++;
                    this.sound.playItemSorted(false);
                    this.spawnSparkle(720, 380, '#f59e0b');
                    this.updateTallyDisplay();
                  }
                }
              }
            }
          }
        });
      }

      this.updateParticles();
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;

      ctx.clearRect(0, 0, w, h);

      // Factory Industrial Floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Yellow Warning Hatch Lines on Floor
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 12;
      for (let i = -w; i < w + h; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }

      // 1. Draw Conveyor Belts
      this.drawConveyorBelts(ctx);

      // 2. Draw Diverter Switch Gate
      this.drawDiverterGate(ctx);

      // 3. Draw Delivery Truck (Lane A)
      this.drawDeliveryTruck(ctx);

      // 4. Draw Storage Depot (Lane B)
      this.drawStorageDepot(ctx);

      // 5. Draw Inflow Feeder Hopper
      this.drawInflowHopper(ctx);

      // 6. Draw Moving Cargo Items
      this.drawCargoItems(ctx);

      // 7. Draw Worker Character
      this.drawWorker(ctx);

      // 8. Draw Particles & Confetti
      this.drawParticles(ctx);
    }

    drawConveyorBelts(ctx) {
      // Helper to draw a textured metallic conveyor belt segment
      const drawBeltSegment = (x1, y1, x2, y2, width = 36) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang);

        // Belt Base & Shadow
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.fillRect(0, -width / 2, len, width);
        ctx.strokeRect(0, -width / 2, len, width);

        // Animated Tread Lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        const offset = this.conveyorBeltOffset;
        for (let x = -offset; x < len; x += 16) {
          if (x >= 0 && x <= len) {
            ctx.beginPath();
            ctx.moveTo(x, -width / 2 + 2);
            ctx.lineTo(x, width / 2 - 2);
            ctx.stroke();
          }
        }

        // Side Rollers
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 + 2, 0, Math.PI * 2);
        ctx.arc(len, 0, width / 2 + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // 1. Feeder Main Belt: (80, 140) -> (400, 260)
      drawBeltSegment(80, 140, 400, 260);

      // 2. Upper Branch Belt to Truck: (400, 260) -> (720, 160)
      drawBeltSegment(400, 260, 720, 160);

      // 3. Lower Branch Belt to Storage: (400, 260) -> (720, 380)
      drawBeltSegment(400, 260, 720, 380);
    }

    drawDiverterGate(ctx) {
      const gx = 400;
      const gy = 260;

      ctx.save();
      ctx.translate(gx, gy);

      // Base Junction Platform
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Directional Flipper Arm
      const flipperAngle = this.activeGateRoute === 'TRUCK_A' ? -Math.PI / 4 : Math.PI / 4;
      ctx.rotate(flipperAngle);

      // Mechanical Arm
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-8, -4, 40, 8, 4);
      ctx.fill();
      ctx.stroke();

      // Warning Arrow on Flipper
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(28, 0);
      ctx.lineTo(20, -6);
      ctx.lineTo(20, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    drawDeliveryTruck(ctx) {
      const tx = 720;
      const ty = 160;

      ctx.save();
      ctx.translate(tx, ty);

      // Loading Dock Platform
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.fillRect(-20, -40, 120, 80);
      ctx.strokeRect(-20, -40, 120, 80);

      // Truck Bed Cargo Bay
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(10, -32, 70, 64, 6);
      ctx.fill();
      ctx.stroke();

      // Truck Cabin Front
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(80, -28, 30, 56);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(86, -22, 18, 20); // windshield

      // Truck Wheels
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(35, 36, 12, 0, Math.PI * 2);
      ctx.arc(95, 36, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // LED Cargo Counter Board
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = this.truckLoadedCount === this.requiredTruckCount ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.fillRect(16, -26, 58, 22);
      ctx.strokeRect(16, -26, 58, 22);

      ctx.fillStyle = this.truckLoadedCount === this.requiredTruckCount ? '#34d399' : '#fbbf24';
      ctx.font = '900 12px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.truckLoadedCount}/${this.requiredTruckCount}`, 45, -11);

      // Top Siren Beacon Light
      const sirenPulse = Math.sin(performance.now() * 0.01);
      ctx.fillStyle = this.truckLoadedCount === this.requiredTruckCount ? '#10b981' : (sirenPulse > 0 ? '#f59e0b' : '#78350f');
      ctx.beginPath();
      ctx.arc(95, -34, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 11px Fredoka, sans-serif';
      ctx.fillText('TRUCK A', 45, 20);

      ctx.restore();
    }

    drawStorageDepot(ctx) {
      const sx = 720;
      const sy = 380;

      ctx.save();
      ctx.translate(sx, sy);

      // Storage Steel Depot Silo
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(0, -36, 90, 72, 8);
      ctx.fill();
      ctx.stroke();

      // Storage Hatch Chute
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, -26, 70, 52);

      // Counter Display
      ctx.fillStyle = '#090d16';
      ctx.fillRect(20, -18, 50, 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '900 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.storageLoadedCount} STORED`, 45, -5);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '800 11px Fredoka, sans-serif';
      ctx.fillText('STORAGE', 45, 18);

      ctx.restore();
    }

    drawInflowHopper(ctx) {
      const hx = 60;
      const hy = 130;

      ctx.save();
      ctx.translate(hx, hy);

      // Industrial Hopper Funnel
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-30, -50);
      ctx.lineTo(30, -50);
      ctx.lineTo(16, 0);
      ctx.lineTo(-16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cargo batch icon
      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INFLOW', 0, -25);

      ctx.restore();
    }

    drawCargoItems(ctx) {
      this.items.forEach(item => {
        if (item.status === 'ON_CONVEYOR' && item.progress > 0) {
          ctx.save();
          ctx.translate(item.x, item.y);

          // Drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.arc(2, 4, 12, 0, Math.PI * 2);
          ctx.fill();

          // Render distinct cargo based on type
          if (item.cargoType === 'BOXES') {
            // Cardboard Box 📦
            ctx.fillStyle = '#d97706';
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = 2;
            ctx.fillRect(-12, -12, 24, 24);
            ctx.strokeRect(-12, -12, 24, 24);

            // Packing tape
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(-12, -3, 24, 6);
          } else if (item.cargoType === 'BOTTLES') {
            // Glowing Bottle 🧃
            ctx.fillStyle = '#06b6d4';
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-9, -14, 18, 28, 4);
            ctx.fill();
            ctx.stroke();
            // Cap
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-5, -17, 10, 4);
          } else if (item.cargoType === 'BATTERIES') {
            // Power Battery 🔋
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-10, -14, 20, 28, 4);
            ctx.fill();
            ctx.stroke();
            // Green charge bars
            ctx.fillStyle = '#34d399';
            ctx.fillRect(-6, -8, 12, 6);
            ctx.fillRect(-6, 0, 12, 6);
          } else if (item.cargoType === 'CRATES') {
            // Heavy Wooden Crate 🪵
            ctx.fillStyle = '#78350f';
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2;
            ctx.fillRect(-13, -13, 26, 26);
            ctx.strokeRect(-13, -13, 26, 26);
            // Cross brace
            ctx.strokeStyle = '#b45309';
            ctx.beginPath();
            ctx.moveTo(-11, -11);
            ctx.lineTo(11, 11);
            ctx.moveTo(11, -11);
            ctx.lineTo(-11, 11);
            ctx.stroke();
          } else if (item.cargoType === 'ENERGY CELLS') {
            // Glowing Hexagonal Energy Cell ⚡
            ctx.fillStyle = '#8b5cf6';
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Industrial Gear Package ⚙️
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.fillRect(-11, -11, 22, 22);
            ctx.strokeRect(-11, -11, 22, 22);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Route Tag Badge (Truck vs Storage)
          if (item.routeTag !== 'AUTO') {
            ctx.fillStyle = item.routeTag === 'TRUCK' ? '#10b981' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(10, -10, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });
    }

    drawWorker(ctx) {
      const wx = this.worker.x;
      const wy = this.worker.y;

      ctx.save();
      ctx.translate(wx, wy);

      // Worker Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs / Tread base
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, 10, 6, 10);
      ctx.fillRect(2, 10, 6, 10);

      // Torso / Overalls
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-10, -6, 20, 18, 4);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, -14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hardhat
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-12, -24, 24, 7);
      ctx.beginPath();
      ctx.arc(0, -22, 9, Math.PI, 0);
      ctx.fill();

      // Goggles
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-6, -17, 12, 5);

      // Cheering arms
      if (this.worker.isCheering) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, -2);
        ctx.lineTo(-18, -16);
        ctx.moveTo(10, -2);
        ctx.lineTo(18, -16);
        ctx.stroke();
      }

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
    // 8. HUD & MODAL CONTROLS
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
      if (this.dom.goOrdersCompleted) this.dom.goOrdersCompleted.textContent = `${this.currentRoundIdx} / 10`;
      if (this.dom.goBestStreak) this.dom.goBestStreak.textContent = `${this.bestStreak}x`;
      if (this.dom.goAccuracy) this.dom.goAccuracy.textContent = '78%';

      if (this.dom.gameOverModal) this.dom.gameOverModal.classList.remove('hidden');

      this.dispatchStuCentEnd(false);
    }

    triggerVictory() {
      this.state = 'VICTORY';
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.sound.playVictory();

      this.totalTimeTaken = Math.round((Date.now() - this.startTime) / 1000);

      if (this.dom.vicFinalScore) this.dom.vicFinalScore.textContent = String(this.score).padStart(6, '0');
      if (this.dom.vicOrdersCompleted) this.dom.vicOrdersCompleted.textContent = '10 / 10';
      if (this.dom.vicBestStreak) this.dom.vicBestStreak.textContent = `${this.bestStreak}x`;
      if (this.dom.vicTotalTime) this.dom.vicTotalTime.textContent = `${this.totalTimeTaken}s`;

      if (this.dom.victoryModal) this.dom.victoryModal.classList.remove('hidden');

      this.dispatchStuCentEnd(true);
    }

    // ==========================================================================
    // 9. STUCENT INTEGRATION CONTRACT
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
  // 10. INITIALIZATION & GLOBAL WRAPPER
  // ==========================================================================
  let activeInstance = null;

  function initFactoryGame(config = {}) {
    if (!activeInstance) {
      activeInstance = new FractionFactoryGame();
    }
    if (config) {
      activeInstance.config = Object.assign(activeInstance.config, config);
    }
    return activeInstance;
  }

  window.game = window.game || {};
  window.game.init = (cfg) => initFactoryGame(cfg);
  
  if (!window.game.end) {
    window.game.end = (res) => {
      console.log('[Fraction Factory] Game ended with result:', res);
    };
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', () => initFactoryGame());
  } else {
    initFactoryGame();
  }

})();
