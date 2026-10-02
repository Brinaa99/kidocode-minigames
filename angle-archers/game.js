/**
 * ANGLE ARCHERS — COMPARING ANGLES ARCADE
 * Mathematics Topic: Comparing Angles (Year 4 Cambridge Standard)
 * Full responsive canvas without black borders, clean archer visualization,
 * Bow Aim in Top HUD, target angle placards, ballistic physics & StuCent hooks.
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER)
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

    playBowDraw() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(280, now + 0.16);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    }

    playArrowRelease() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }

    playTargetHit(isCorrect) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      if (isCorrect) {
        this.playTone(190, 'triangle', 0.08, 0.4, 0.01, 70);
        setTimeout(() => {
          this.playTone(523.25, 'sine', 0.22, 0.3, 0.01);
          setTimeout(() => this.playTone(659.25, 'sine', 0.22, 0.3, 0.01), 60);
          setTimeout(() => this.playTone(783.99, 'sine', 0.35, 0.35, 0.01), 120);
        }, 40);
      } else {
        this.playTone(120, 'sawtooth', 0.22, 0.35, 0.01, 50);
        setTimeout(() => this.playTone(85, 'sawtooth', 0.3, 0.3, 0.01, 40), 60);
      }
    }

    playStreakSound(streakLevel) {
      if (this.isMuted) return;
      const baseFreq = 440 + Math.min(streakLevel * 50, 450);
      this.playTone(baseFreq, 'sine', 0.18, 0.25, 0.01);
      setTimeout(() => this.playTone(baseFreq * 1.25, 'sine', 0.25, 0.3, 0.01), 60);
    }

    playVictory() {
      if (this.isMuted) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.35, 0.3, 0.01);
        }, idx * 110);
      });
    }

    playGameOver() {
      if (this.isMuted) return;
      const notes = [440, 415.3, 392, 349.23];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.35, 0.25, 0.01, freq * 0.8);
        }, idx * 140);
      });
    }

    playClick() {
      this.playTone(600, 'sine', 0.04, 0.15, 0.01);
    }
  }

  const audio = new ArcadeAudioEngine();

  // ==========================================================================
  // 2. ROUND CONFIGURATIONS (10 PROGRESSIVE ARCHERY ROUNDS)
  // ==========================================================================
  const ROUND_DEFINITIONS = [
    {
      roundNum: 1,
      missionText: "SHOOT THE LARGER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 30, label: "A" },
        { angleDeg: 70, label: "B" }
      ],
      rule: "larger",
      movement: "none",
      hasWind: false
    },
    {
      roundNum: 2,
      missionText: "SHOOT THE SMALLER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 40, label: "A" },
        { angleDeg: 90, label: "B" }
      ],
      rule: "smaller",
      movement: "none",
      hasWind: false
    },
    {
      roundNum: 3,
      missionText: "SHOOT THE LARGER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 45, label: "A" },
        { angleDeg: 75, label: "B" }
      ],
      rule: "larger",
      movement: "none",
      hasWind: false
    },
    {
      roundNum: 4,
      missionText: "SHOOT THE SMALLER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 65, label: "A" },
        { angleDeg: 55, label: "B" }
      ],
      rule: "smaller",
      movement: "gentle_sway",
      hasWind: false
    },
    {
      roundNum: 5,
      missionText: "SHOOT AN EQUAL ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 70, label: "A" },
        { angleDeg: 70, label: "B" }
      ],
      rule: "equal",
      movement: "gentle_sway",
      hasWind: false
    },
    {
      roundNum: 6,
      missionText: "SHOOT THE LARGEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 35, label: "A" },
        { angleDeg: 60, label: "B" },
        { angleDeg: 90, label: "C" }
      ],
      rule: "largest",
      movement: "none",
      hasWind: false
    },
    {
      roundNum: 7,
      missionText: "SHOOT THE SMALLEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 75, label: "A" },
        { angleDeg: 40, label: "B" },
        { angleDeg: 55, label: "C" }
      ],
      rule: "smallest",
      movement: "moderate_sway",
      hasWind: false
    },
    {
      roundNum: 8,
      missionText: "SHOOT THE LARGEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 55, label: "A" },
        { angleDeg: 65, label: "B" },
        { angleDeg: 60, label: "C" }
      ],
      rule: "largest",
      movement: "moderate_sway",
      hasWind: false
    },
    {
      roundNum: 9,
      missionText: "SHOOT THE SMALLEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 58, label: "A" },
        { angleDeg: 62, label: "B" },
        { angleDeg: 60, label: "C" }
      ],
      rule: "smallest",
      movement: "active_sway",
      hasWind: true,
      windSpeed: 1.5
    },
    {
      roundNum: 10,
      missionText: "FINAL CHAMPIONSHIP: SHOOT THE LARGEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 78, label: "A" },
        { angleDeg: 85, label: "B" },
        { angleDeg: 80, label: "C" }
      ],
      rule: "largest",
      movement: "active_sway",
      hasWind: true,
      windSpeed: -2.0
    }
  ];

  // ==========================================================================
  // 3. GAME STATE & RESPONSIVE DIMENSIONS
  // ==========================================================================
  let viewWidth = 1000;
  let viewHeight = 600;

  const gameState = {
    screen: 'START', // 'START', 'INSTRUCTIONS', 'PLAYING', 'PAUSED', 'GAME_OVER', 'VICTORY'
    score: 0,
    lives: 3,
    maxLives: 3,
    arrowsRemainingInRound: 2,
    maxArrowsPerRound: 2,
    roundIndex: 0,
    streak: 1,
    maxStreak: 1,
    shotsFired: 0,
    shotsHit: 0,
    timeRemaining: 60,
    totalTimeTaken: 0,
    timerInterval: null,
    isShooting: false,
    screenShake: 0,
    currentRoundData: null,
    targetPositions: [],
    particles: [],
    floatingTexts: [],
    ambientClouds: [],
    ambientLeaves: [],
    roundStartTime: 0,
    windValue: 0,
    isPointerAiming: false,
    gameTime: 0
  };

  // Archer character state
  const archer = {
    x: 160,
    y: 480,
    baseScale: 1.2,
    aimAngle: 45, // Aim angle in degrees
    targetAimAngle: 45,
    minAim: 10,
    maxAim: 80,
    recoil: 0,
    idleTimer: 0
  };

  let arrow = null;
  const dom = {};
  let canvas = null;
  let ctx = null;

  // ==========================================================================
  // 4. INITIALIZATION & FULLSCREEN RESPONSIVENESS
  // ==========================================================================
  function initDOM() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    dom.canvas = canvas;
    dom.ctx = ctx;

    dom.scoreDisplay = document.getElementById('score-display');
    dom.timerDisplay = document.getElementById('timer-display');
    dom.roundDisplay = document.getElementById('round-display');
    dom.streakDisplay = document.getElementById('streak-display');
    dom.aimDisplay = document.getElementById('aim-display');
    dom.bannerText = document.getElementById('banner-text');

    dom.heart1 = document.getElementById('heart-1');
    dom.heart2 = document.getElementById('heart-2');
    dom.heart3 = document.getElementById('heart-3');

    dom.arrowSlot1 = document.getElementById('arrow-slot-1');
    dom.arrowSlot2 = document.getElementById('arrow-slot-2');

    dom.windBadgeBox = document.getElementById('wind-badge-box');
    dom.windDisplay = document.getElementById('wind-display');

    dom.feedbackPopup = document.getElementById('feedback-popup');
    dom.feedbackIcon = document.getElementById('feedback-icon');
    dom.feedbackTitle = document.getElementById('feedback-title');
    dom.feedbackSubtitle = document.getElementById('feedback-subtitle');

    dom.startScreen = document.getElementById('start-screen');
    dom.instructionsModal = document.getElementById('instructions-modal');
    dom.pauseModal = document.getElementById('pause-modal');
    dom.gameOverModal = document.getElementById('game-over-modal');
    dom.victoryModal = document.getElementById('victory-modal');

    dom.startGameBtn = document.getElementById('start-game-btn');
    dom.howToPlayBtn = document.getElementById('how-to-play-btn');
    dom.hudHowToPlayBtn = document.getElementById('hud-how-to-play-btn');
    dom.pauseBtn = document.getElementById('pause-btn');
    dom.resumeBtn = document.getElementById('resume-btn');
    dom.restartFromPauseBtn = document.getElementById('restart-from-pause-btn');
    dom.closeInstructionsBtn = document.getElementById('close-instructions-btn');
    dom.startFromInstructionsBtn = document.getElementById('start-from-instructions-btn');
    dom.gameOverRetryBtn = document.getElementById('game-over-retry-btn');
    dom.victoryPlayAgainBtn = document.getElementById('victory-play-again-btn');
    dom.soundToggleBtn = document.getElementById('sound-toggle-btn');
    dom.soundIconOn = document.getElementById('sound-icon-on');
    dom.soundIconOff = document.getElementById('sound-icon-off');

    dom.btnAimLeft = document.getElementById('btn-aim-left');
    dom.btnAimRight = document.getElementById('btn-aim-right');
    dom.btnShoot = document.getElementById('btn-shoot');

    setupEventHandlers();
    setupAmbientScenery();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    const container = document.getElementById('gameplay-area');
    if (!container || !canvas) return;

    viewWidth = container.clientWidth;
    viewHeight = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = viewWidth * dpr;
    canvas.height = viewHeight * dpr;
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;

    // Reposition archer fluidly to match new dimensions
    archer.x = Math.max(100, Math.min(220, viewWidth * 0.16));
    archer.y = viewHeight - (viewHeight < 550 ? 80 : 120);
    archer.baseScale = Math.max(0.9, Math.min(1.35, viewHeight / 520));

    // Reposition targets if a round is currently active
    if (gameState.currentRoundData) {
      updateTargetPositionsForResize(gameState.currentRoundData);
    }
  }

  function setupAmbientScenery() {
    gameState.ambientClouds = [
      { x: 100, y: 50, speed: 0.25, scale: 1.1 },
      { x: 480, y: 90, speed: 0.18, scale: 0.85 },
      { x: 880, y: 40, speed: 0.3, scale: 1.2 }
    ];

    gameState.ambientLeaves = [];
    for (let i = 0; i < 16; i++) {
      gameState.ambientLeaves.push({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        vx: 0.6 + Math.random() * 0.8,
        vy: 0.3 + Math.random() * 0.5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        size: 3.5 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
      });
    }
  }

  function setupEventHandlers() {
    dom.startGameBtn.addEventListener('click', () => {
      audio.playClick();
      startGame();
    });

    dom.howToPlayBtn.addEventListener('click', () => {
      audio.playClick();
      showInstructions();
    });

    dom.hudHowToPlayBtn.addEventListener('click', () => {
      audio.playClick();
      showInstructions();
    });

    dom.closeInstructionsBtn.addEventListener('click', () => {
      audio.playClick();
      hideInstructions();
    });

    dom.startFromInstructionsBtn.addEventListener('click', () => {
      audio.playClick();
      hideInstructions();
      if (gameState.screen === 'START') startGame();
    });

    dom.pauseBtn.addEventListener('click', togglePause);
    dom.resumeBtn.addEventListener('click', togglePause);
    dom.restartFromPauseBtn.addEventListener('click', () => {
      dom.pauseModal.classList.add('hidden');
      startGame();
    });

    dom.gameOverRetryBtn.addEventListener('click', () => {
      audio.playClick();
      startGame();
    });

    dom.victoryPlayAgainBtn.addEventListener('click', () => {
      audio.playClick();
      startGame();
    });

    // Sound toggle
    dom.soundToggleBtn.addEventListener('click', () => {
      audio.isMuted = !audio.isMuted;
      if (audio.isMuted) {
        dom.soundIconOn.classList.add('hidden');
        dom.soundIconOff.classList.remove('hidden');
      } else {
        dom.soundIconOn.classList.remove('hidden');
        dom.soundIconOff.classList.add('hidden');
        audio.playClick();
      }
    });

    // Touch Aim & Shoot Buttons
    let aimInterval = null;
    const startAimAdjust = (delta) => {
      audio.playBowDraw();
      adjustAim(delta);
      aimInterval = setInterval(() => adjustAim(delta), 70);
    };
    const stopAimAdjust = () => {
      if (aimInterval) clearInterval(aimInterval);
    };

    dom.btnAimLeft.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startAimAdjust(2.5);
    });
    dom.btnAimLeft.addEventListener('pointerup', stopAimAdjust);
    dom.btnAimLeft.addEventListener('pointercancel', stopAimAdjust);

    dom.btnAimRight.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startAimAdjust(-2.5);
    });
    dom.btnAimRight.addEventListener('pointerup', stopAimAdjust);
    dom.btnAimRight.addEventListener('pointercancel', stopAimAdjust);

    dom.btnShoot.addEventListener('click', (e) => {
      e.preventDefault();
      shootArrow();
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (gameState.screen === 'PLAYING' || gameState.screen === 'PAUSED') {
          togglePause();
          return;
        }
      }

      if (gameState.screen !== 'PLAYING') return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        adjustAim(2.5);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        adjustAim(-2.5);
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        shootArrow();
      }
    });

    // Mouse / Touch Aiming
    function getCanvasPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (gameState.screen !== 'PLAYING') return;
      gameState.isPointerAiming = true;
      const pos = getCanvasPointerPos(e);
      aimTowardPoint(pos.x, pos.y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (gameState.screen !== 'PLAYING' || gameState.isShooting) return;
      const pos = getCanvasPointerPos(e);
      aimTowardPoint(pos.x, pos.y);
    });

    canvas.addEventListener('pointerup', (e) => {
      if (gameState.screen !== 'PLAYING' || gameState.isShooting) return;
      if (gameState.isPointerAiming) {
        gameState.isPointerAiming = false;
        const pos = getCanvasPointerPos(e);
        aimTowardPoint(pos.x, pos.y);
        shootArrow();
      }
    });

    canvas.addEventListener('pointercancel', () => {
      gameState.isPointerAiming = false;
    });
  }

  function aimTowardPoint(px, py) {
    const dx = px - archer.x;
    const dy = archer.y - py; // Math coordinate system (up is positive)
    if (dx > 25) {
      let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      angleDeg = Math.max(archer.minAim, Math.min(archer.maxAim, angleDeg));
      archer.targetAimAngle = angleDeg;
      updateAimUI();
    }
  }

  function adjustAim(delta) {
    archer.targetAimAngle = Math.max(archer.minAim, Math.min(archer.maxAim, archer.targetAimAngle + delta));
    updateAimUI();
  }

  function updateAimUI() {
    dom.aimDisplay.textContent = `${Math.round(archer.targetAimAngle)}°`;
  }

  function togglePause() {
    if (gameState.screen === 'PLAYING') {
      gameState.screen = 'PAUSED';
      dom.pauseModal.classList.remove('hidden');
    } else if (gameState.screen === 'PAUSED') {
      gameState.screen = 'PLAYING';
      dom.pauseModal.classList.add('hidden');
    }
  }

  function showInstructions() {
    dom.instructionsModal.classList.remove('hidden');
  }

  function hideInstructions() {
    dom.instructionsModal.classList.add('hidden');
  }

  // ==========================================================================
  // 5. GAMEPLAY LOGIC & PROGRESSION
  // ==========================================================================
  function startGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.roundIndex = 0;
    gameState.streak = 1;
    gameState.maxStreak = 1;
    gameState.shotsFired = 0;
    gameState.shotsHit = 0;
    gameState.timeRemaining = 60;
    gameState.totalTimeTaken = 0;
    gameState.screen = 'PLAYING';
    gameState.isShooting = false;
    gameState.arrowsRemainingInRound = 2;
    arrow = null;

    dom.startScreen.classList.add('hidden');
    dom.instructionsModal.classList.add('hidden');
    dom.pauseModal.classList.add('hidden');
    dom.gameOverModal.classList.add('hidden');
    dom.victoryModal.classList.add('hidden');

    updateHUD();
    loadRound(0);
    startTimer();
  }

  function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
      if (gameState.screen === 'PLAYING') {
        gameState.timeRemaining--;
        gameState.totalTimeTaken++;
        dom.timerDisplay.textContent = String(Math.max(0, gameState.timeRemaining)).padStart(3, '0');

        if (gameState.timeRemaining <= 0) {
          triggerGameOver();
        }
      }
    }, 1000);
  }

  function loadRound(index) {
    if (index >= ROUND_DEFINITIONS.length) {
      triggerVictory();
      return;
    }

    gameState.roundIndex = index;
    gameState.roundStartTime = Date.now();
    gameState.arrowsRemainingInRound = gameState.maxArrowsPerRound;
    const roundConfig = ROUND_DEFINITIONS[index];
    gameState.currentRoundData = roundConfig;
    gameState.isShooting = false;
    arrow = null;

    if (roundConfig.hasWind) {
      gameState.windValue = roundConfig.windSpeed || (Math.random() > 0.5 ? 1.5 : -1.5);
      dom.windBadgeBox.classList.remove('hidden');
      const dirText = gameState.windValue > 0 ? `⮞ ${Math.abs(gameState.windValue).toFixed(1)}` : `⮜ ${Math.abs(gameState.windValue).toFixed(1)}`;
      dom.windDisplay.textContent = dirText;
    } else {
      gameState.windValue = 0;
      dom.windBadgeBox.classList.add('hidden');
    }

    dom.bannerText.textContent = roundConfig.missionText;
    dom.roundDisplay.textContent = `${String(index + 1).padStart(2, '0')} / 10`;

    setupTargetPositions(roundConfig);
    updateHUD();

    // Aim toward first target initially
    if (gameState.targetPositions.length > 0) {
      const firstTarget = gameState.targetPositions[0];
      const dx = firstTarget.baseX - archer.x;
      const dy = archer.y - firstTarget.baseY;
      archer.targetAimAngle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI));
      updateAimUI();
    }
  }

  function setupTargetPositions(roundConfig) {
    gameState.targetPositions = [];
    const count = roundConfig.targetCount;
    const targetY = Math.max(140, Math.min(240, viewHeight * 0.36));

    const angles = roundConfig.targets.map(t => t.angleDeg);
    const maxAngle = Math.max(...angles);
    const minAngle = Math.min(...angles);

    let xPositions = [];
    const usableW = viewWidth - archer.x;
    if (count === 2) {
      xPositions = [
        archer.x + usableW * 0.38,
        archer.x + usableW * 0.78
      ];
    } else {
      xPositions = [
        archer.x + usableW * 0.28,
        archer.x + usableW * 0.58,
        archer.x + usableW * 0.86
      ];
    }

    roundConfig.targets.forEach((t, i) => {
      let isCorrect = false;
      if (roundConfig.rule === 'larger' || roundConfig.rule === 'largest') {
        isCorrect = t.angleDeg === maxAngle;
      } else if (roundConfig.rule === 'smaller' || roundConfig.rule === 'smallest') {
        isCorrect = t.angleDeg === minAngle;
      } else if (roundConfig.rule === 'equal') {
        isCorrect = true;
      }

      gameState.targetPositions.push({
        id: i,
        label: t.label,
        angleDeg: t.angleDeg,
        isCorrect: isCorrect,
        baseX: xPositions[i],
        baseY: targetY,
        x: xPositions[i],
        y: targetY,
        radius: Math.max(42, Math.min(54, viewHeight * 0.085)),
        hitReaction: 0,
        swayOffset: i * 1.5,
        movement: roundConfig.movement,
        stuckArrows: []
      });
    });
  }

  function updateTargetPositionsForResize(roundConfig) {
    const count = roundConfig.targetCount;
    const targetY = Math.max(140, Math.min(240, viewHeight * 0.36));
    const usableW = viewWidth - archer.x;

    let xPositions = [];
    if (count === 2) {
      xPositions = [
        archer.x + usableW * 0.38,
        archer.x + usableW * 0.78
      ];
    } else {
      xPositions = [
        archer.x + usableW * 0.28,
        archer.x + usableW * 0.58,
        archer.x + usableW * 0.86
      ];
    }

    gameState.targetPositions.forEach((target, i) => {
      if (xPositions[i]) {
        target.baseX = xPositions[i];
        target.baseY = targetY;
        target.radius = Math.max(42, Math.min(54, viewHeight * 0.085));
      }
    });
  }

  function shootArrow() {
    if (gameState.screen !== 'PLAYING' || gameState.isShooting || arrow) return;
    if (gameState.arrowsRemainingInRound <= 0) return;

    gameState.isShooting = true;
    gameState.shotsFired++;
    gameState.arrowsRemainingInRound--;
    archer.recoil = 16;
    audio.playArrowRelease();
    updateHUD();

    const rad = archer.aimAngle * (Math.PI / 180);
    const launchSpeed = Math.max(22, Math.min(28, viewWidth * 0.024));
    const vx = Math.cos(rad) * launchSpeed;
    const vy = -Math.sin(rad) * launchSpeed;

    arrow = {
      x: archer.x + Math.cos(rad) * 55,
      y: archer.y - Math.sin(rad) * 55,
      vx: vx,
      vy: vy,
      gravity: 0.34,
      rotation: -rad,
      trail: [],
      active: true
    };
  }

  function updateArrow() {
    if (!arrow || !arrow.active) return;

    arrow.trail.push({ x: arrow.x, y: arrow.y, alpha: 0.9 });
    if (arrow.trail.length > 12) arrow.trail.shift();

    arrow.x += arrow.vx;
    arrow.y += arrow.vy;
    arrow.vx += gameState.windValue * 0.035;
    arrow.vy += arrow.gravity;
    arrow.rotation = Math.atan2(arrow.vy, arrow.vx);

    if (Math.random() < 0.6) {
      gameState.particles.push({
        x: arrow.x,
        y: arrow.y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 1.0,
        decay: 0.09,
        size: 3,
        color: '#fde047'
      });
    }

    // Check target hit
    let collidedTarget = null;
    for (const target of gameState.targetPositions) {
      const dx = arrow.x - target.x;
      const dy = arrow.y - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < target.radius + 18) {
        collidedTarget = target;
        break;
      }
    }

    if (collidedTarget) {
      handleTargetCollision(collidedTarget);
      return;
    }

    // Missed
    if (arrow.y > viewHeight - 20 || arrow.x > viewWidth + 40) {
      handleArrowMiss();
    }
  }

  function handleTargetCollision(target) {
    arrow.active = false;
    target.hitReaction = 16;
    target.stuckArrows.push({
      relX: arrow.x - target.x,
      relY: arrow.y - target.y,
      rotation: arrow.rotation
    });

    if (target.isCorrect) {
      gameState.shotsHit++;
      audio.playTargetHit(true);

      const elapsed = (Date.now() - gameState.roundStartTime) / 1000;
      const speedBonus = elapsed < 4 ? 50 : (elapsed < 8 ? 25 : 0);
      const pointsEarned = (100 + speedBonus) * gameState.streak;

      gameState.score += pointsEarned;
      gameState.streak = Math.min(10, gameState.streak + 1);
      if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
      }

      if (gameState.streak > 1) {
        audio.playStreakSound(gameState.streak);
      }

      spawnHitSparks(target.x, target.y, true);
      showFeedback(true, `TARGET HIT! +${pointsEarned}`, `STREAK ${gameState.streak}x`);
      spawnFloatingText(`+${pointsEarned}`, target.x, target.y - 45, '#fbbf24');

      updateHUD();

      setTimeout(() => {
        loadRound(gameState.roundIndex + 1);
      }, 1000);
    } else {
      audio.playTargetHit(false);
      gameState.lives--;
      gameState.streak = 1;
      gameState.screenShake = 12;

      spawnHitSparks(target.x, target.y, false);
      showFeedback(false, "WRONG ANGLE!", "-1 LIFE");
      spawnFloatingText("-1 LIFE", target.x, target.y - 45, '#ef4444');

      updateHUD();

      if (gameState.lives <= 0) {
        setTimeout(triggerGameOver, 700);
      } else {
        setTimeout(() => {
          gameState.isShooting = false;
          arrow = null;
          gameState.arrowsRemainingInRound = gameState.maxArrowsPerRound;
          updateHUD();
        }, 800);
      }
    }
  }

  function handleArrowMiss() {
    arrow = null;
    gameState.isShooting = false;
    audio.playTone(90, 'triangle', 0.15, 0.25, 0.01);
    spawnFloatingText("MISSED!", archer.x + 100, archer.y - 100, '#94a3b8');

    if (gameState.arrowsRemainingInRound > 0) {
      showFeedback(false, "MISSED SHOT!", `${gameState.arrowsRemainingInRound} ARROW LEFT — TRY AGAIN!`);
    } else {
      gameState.lives--;
      gameState.streak = 1;
      gameState.screenShake = 10;
      updateHUD();

      if (gameState.lives <= 0) {
        setTimeout(triggerGameOver, 700);
      } else {
        showFeedback(false, "OUT OF ARROWS!", "-1 LIFE");
        setTimeout(() => {
          gameState.arrowsRemainingInRound = gameState.maxArrowsPerRound;
          updateHUD();
        }, 800);
      }
    }
  }

  function spawnHitSparks(x, y, isCorrect) {
    const count = isCorrect ? 24 : 12;
    const colors = isCorrect 
      ? ['#fbbf24', '#f59e0b', '#34d399', '#38bdf8', '#ffffff'] 
      : ['#ef4444', '#b91c1c', '#78716c'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      gameState.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.03,
        size: 3.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function spawnFloatingText(text, x, y, color) {
    gameState.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.3,
      alpha: 1.0,
      color: color
    });
  }

  function showFeedback(isCorrect, title, subtitle) {
    dom.feedbackPopup.className = `feedback-popup ${isCorrect ? 'popup-correct' : 'popup-wrong'}`;
    dom.feedbackIcon.textContent = isCorrect ? '✓' : '✗';
    dom.feedbackTitle.textContent = title;
    dom.feedbackSubtitle.textContent = subtitle;

    dom.feedbackPopup.classList.remove('hidden');
    setTimeout(() => {
      dom.feedbackPopup.classList.add('hidden');
    }, 950);
  }

  function updateHUD() {
    dom.scoreDisplay.textContent = String(gameState.score).padStart(6, '0');
    dom.streakDisplay.textContent = `${gameState.streak}x`;
    dom.aimDisplay.textContent = `${Math.round(archer.aimAngle)}°`;

    dom.heart1.className = `arcade-heart ${gameState.lives >= 1 ? 'heart-full' : 'heart-lost'}`;
    dom.heart2.className = `arcade-heart ${gameState.lives >= 2 ? 'heart-full' : 'heart-lost'}`;
    dom.heart3.className = `arcade-heart ${gameState.lives >= 3 ? 'heart-full' : 'heart-lost'}`;

    dom.arrowSlot1.className = `quiver-arrow ${gameState.arrowsRemainingInRound >= 1 ? '' : 'arrow-spent'}`;
    dom.arrowSlot2.className = `quiver-arrow ${gameState.arrowsRemainingInRound >= 2 ? '' : 'arrow-spent'}`;
  }

  function triggerGameOver() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.screen = 'GAME_OVER';
    audio.playGameOver();

    const accuracy = gameState.shotsFired > 0 
      ? Math.round((gameState.shotsHit / gameState.shotsFired) * 100) 
      : 0;

    document.getElementById('game-over-score').textContent = String(gameState.score).padStart(6, '0');
    document.getElementById('game-over-rounds').textContent = `${gameState.roundIndex} / 10`;
    document.getElementById('game-over-streak').textContent = `${gameState.maxStreak}x`;
    document.getElementById('game-over-accuracy').textContent = `${accuracy}%`;

    dom.gameOverModal.classList.remove('hidden');

    if (window.game && typeof window.game.end === 'function') {
      window.game.end({
        score: gameState.score,
        maxScore: 3500,
        timeTaken: gameState.totalTimeTaken,
        success: false
      });
    }
  }

  function triggerVictory() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.screen = 'VICTORY';
    audio.playVictory();

    const accuracy = gameState.shotsFired > 0 
      ? Math.round((gameState.shotsHit / gameState.shotsFired) * 100) 
      : 100;

    document.getElementById('victory-score').textContent = String(gameState.score).padStart(6, '0');
    document.getElementById('victory-time').textContent = `${String(gameState.totalTimeTaken).padStart(3, '0')}s`;
    document.getElementById('victory-streak').textContent = `${gameState.maxStreak}x`;
    document.getElementById('victory-accuracy').textContent = `${accuracy}%`;

    const starCount = gameState.score >= 2500 ? 3 : (gameState.score >= 1500 ? 2 : 1);
    for (let i = 1; i <= 3; i++) {
      const starEl = document.getElementById(`v-star-${i}`);
      if (starEl) starEl.className = `star-item ${i <= starCount ? 'star-earned' : ''}`;
    }

    dom.victoryModal.classList.remove('hidden');

    for (let i = 0; i < 80; i++) {
      spawnHitSparks(viewWidth * Math.random(), viewHeight * 0.4, true);
    }

    if (window.game && typeof window.game.end === 'function') {
      window.game.end({
        score: gameState.score,
        maxScore: 3500,
        timeTaken: gameState.totalTimeTaken,
        success: true
      });
    }
  }

  // ==========================================================================
  // 6. RENDERING ENGINE (FULLSCREEN RESPONSIVE ARCHERY ARENA)
  // ==========================================================================
  function render() {
    if (!ctx) return;
    gameState.gameTime += 0.02;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    // Screen Shake effect on miss
    if (gameState.screenShake > 0) {
      const sx = (Math.random() - 0.5) * gameState.screenShake;
      const sy = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(sx, sy);
      gameState.screenShake *= 0.85;
      if (gameState.screenShake < 0.5) gameState.screenShake = 0;
    }

    // 1. Draw Fullscreen Outdoor Arena Environment
    drawEnvironment(ctx, viewWidth, viewHeight);

    // 2. Draw Floating Scenery (Clouds & Ambient Leaves)
    drawAmbientScenery(ctx, viewWidth, viewHeight);

    // 3. Draw Archery Targets & Angle Measurement Stands
    drawTargets(ctx);

    // 4. Draw Trajectory Guide Line (Clean, without floating badge)
    if (gameState.screen === 'PLAYING' && !gameState.isShooting) {
      drawTrajectoryGuide(ctx);
    }

    // 5. Draw Clean Animated Archer Character & Bow
    drawArcher(ctx);

    // 6. Draw Arrow & Flight Trail
    drawArrow(ctx);

    // 7. Draw Active Particle Bursts
    drawParticles(ctx);

    // 8. Draw Floating Impact / Score Texts
    drawFloatingTexts(ctx);

    ctx.restore();
  }

  function drawEnvironment(ctx, W, H) {
    // Sky gradient across full viewport
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.5, '#38bdf8');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.6);

    // Sun flare
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.beginPath();
    ctx.arc(W * 0.1, 70, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.8)';
    ctx.beginPath();
    ctx.arc(W * 0.1, 70, 30, 0, Math.PI * 2);
    ctx.fill();

    // Distant Castle Hills
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.ellipse(W * 0.25, H * 0.55, W * 0.4, H * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.ellipse(W * 0.8, H * 0.52, W * 0.45, H * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Distant Castles
    drawCastle(ctx, Math.max(80, W * 0.18), H * 0.26);
    drawCastle(ctx, Math.min(W - 80, W * 0.88), H * 0.28);

    // Grass lawn occupying lower field
    const grassGrad = ctx.createLinearGradient(0, H * 0.48, 0, H);
    grassGrad.addColorStop(0, '#15803d');
    grassGrad.addColorStop(0.3, '#16a34a');
    grassGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, H * 0.48, W, H * 0.52);

    // Tournament distance stripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([12, 10]);
    for (let y = H * 0.6; y < H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Wooden Perimeter Arena Fence
    ctx.fillStyle = '#78350f';
    for (let x = 10; x < W; x += 40) {
      ctx.fillRect(x, H * 0.46, 7, 22);
    }
    ctx.fillRect(0, H * 0.47, W, 4);

    // Tournament Flags at boundaries
    drawBannerFlag(ctx, 40, H * 0.42, '#ef4444');
    drawBannerFlag(ctx, W - 40, H * 0.42, '#3b82f6');
  }

  function drawCastle(ctx, x, y) {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 25, y, 50, 60);
    ctx.fillRect(x - 28, y - 10, 12, 10);
    ctx.fillRect(x - 6, y - 10, 12, 10);
    ctx.fillRect(x + 16, y - 10, 12, 10);

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 10);
    ctx.lineTo(x, y - 35);
    ctx.lineTo(x + 20, y - 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 35);
    ctx.lineTo(x, y - 50);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + 16, y - 44);
    ctx.lineTo(x, y - 38);
    ctx.closePath();
    ctx.fill();
  }

  function drawBannerFlag(ctx, x, y, color) {
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 45);
    ctx.lineTo(x, y - 20);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 25, y - 10);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawAmbientScenery(ctx, W, H) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    gameState.ambientClouds.forEach(c => {
      c.x += c.speed;
      if (c.x > W + 80) c.x = -100;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.arc(20, -9, 18, 0, Math.PI * 2);
      ctx.arc(40, 0, 20, 0, Math.PI * 2);
      ctx.arc(20, 9, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    gameState.ambientLeaves.forEach(leaf => {
      leaf.x += leaf.vx + (gameState.windValue * 0.35);
      leaf.y += leaf.vy;
      leaf.rot += leaf.rotSpeed;

      if (leaf.x > W + 20) leaf.x = -20;
      if (leaf.x < -20) leaf.x = W + 20;
      if (leaf.y > H + 20) leaf.y = 100;

      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rot);
      ctx.fillStyle = leaf.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.size * 1.5, leaf.size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawTargets(ctx) {
    gameState.targetPositions.forEach(target => {
      if (target.movement === 'gentle_sway') {
        target.x = target.baseX + Math.sin(gameState.gameTime * 1.6 + target.swayOffset) * 20;
      } else if (target.movement === 'moderate_sway') {
        target.x = target.baseX + Math.sin(gameState.gameTime * 2.2 + target.swayOffset) * 38;
      } else if (target.movement === 'active_sway') {
        target.x = target.baseX + Math.sin(gameState.gameTime * 2.8 + target.swayOffset) * 55;
        target.y = target.baseY + Math.cos(gameState.gameTime * 1.5 + target.swayOffset) * 10;
      }

      ctx.save();
      ctx.translate(target.x, target.y);

      if (target.hitReaction > 0) {
        const shake = Math.sin(target.hitReaction * 2) * (target.hitReaction * 0.55);
        ctx.translate(shake, 0);
        target.hitReaction--;
      }

      // Shadow on grass
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 95, target.radius * 0.85, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden Easel Stand
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-24, 15, 8, 85);
      ctx.fillRect(16, 15, 8, 85);
      ctx.fillRect(-30, 60, 60, 7);

      // Circular Archery Target Disc
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Target Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 15px var(--font-display)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(target.label, 0, 0);

      // Embedded stuck arrows
      target.stuckArrows.forEach(stuck => {
        ctx.save();
        ctx.translate(stuck.relX, stuck.relY);
        ctx.rotate(stuck.rotation);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-24, 0);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-24, -3, 6, 6);
        ctx.restore();
      });

      // Target's Angle Display Placard Mounted Directly Above Target
      drawAngleDisplaySign(ctx, 0, -90, target.angleDeg);

      ctx.restore();
    });
  }

  function drawAngleDisplaySign(ctx, x, y, angleDeg) {
    ctx.save();
    ctx.translate(x, y);

    const signW = 108;
    const signH = 82;

    // Wooden mount rod
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-4, 30, 8, 20);

    // Placard background
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-signW / 2, -signH / 2, signW, signH, 10);
    ctx.fill();
    ctx.stroke();

    // Degree Header Pill
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-signW / 2 + 6, -signH / 2 + 5, signW - 12, 19, 5);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.font = `900 14px var(--font-display)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${angleDeg}°`, 0, -signH / 2 + 15);

    // --- ACCURATE GEOMETRIC ANGLE VISUALIZATION ---
    const vx = -22;
    const vy = 22;
    const rayLength = 42;
    const arcRadius = 19;

    // Baseline Ray (Horizontal)
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + rayLength, vy);
    ctx.stroke();

    // Angled Ray (Rotated accurately by angleDeg)
    const rad = angleDeg * (Math.PI / 180);
    const r2x = vx + Math.cos(rad) * rayLength;
    const r2y = vy - Math.sin(rad) * rayLength;

    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(r2x, r2y);
    ctx.stroke();

    // Angle Arc Sector
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.arc(vx, vy, arcRadius, 0, -rad, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vertex Marker Dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawTrajectoryGuide(ctx) {
    ctx.save();
    ctx.translate(archer.x, archer.y);

    const rad = archer.aimAngle * (Math.PI / 180);
    const launchSpeed = Math.max(22, Math.min(28, viewWidth * 0.024));
    let simX = Math.cos(rad) * 55;
    let simY = -Math.sin(rad) * 55;
    let simVx = Math.cos(rad) * launchSpeed;
    let simVy = -Math.sin(rad) * launchSpeed;
    const gravity = 0.34;

    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';

    // Subtle dotted trajectory guide (clean, without floating badge)
    for (let step = 0; step < 24; step++) {
      simX += simVx;
      simY += simVy;
      simVx += gameState.windValue * 0.035;
      simVy += gravity;

      if (step % 2 === 0) {
        ctx.beginPath();
        ctx.arc(simX, simY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawArcher(ctx) {
    // Smooth angle interpolation
    archer.aimAngle += (archer.targetAimAngle - archer.aimAngle) * 0.22;
    archer.idleTimer += 0.05;
    if (archer.recoil > 0) archer.recoil *= 0.8;

    // Live update HUD with aim angle
    updateAimUI();

    const bobY = Math.sin(archer.idleTimer) * 2.5;

    ctx.save();
    ctx.translate(archer.x, archer.y + bobY);
    ctx.scale(archer.baseScale, archer.baseScale);

    // 1. Quiver with wooden arrows on back
    ctx.fillStyle = '#78350f';
    ctx.save();
    ctx.rotate(-0.35);
    ctx.fillRect(-24, -40, 13, 36);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-26, -48, 4, 9);
    ctx.fillRect(-18, -50, 4, 11);
    ctx.restore();

    // 2. Archer Body (Tunic & Belt)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-18, -36, 36, 44, 7);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.fillRect(-18, -13, 36, 6);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-6, -14, 12, 8);

    // 3. Archer Head & Feathered Cap
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -50, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(7, -52, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(6, -46, 4.5, 0, Math.PI * 0.8);
    ctx.stroke();

    // Robin Hood Cap
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(-18, -58);
    ctx.lineTo(16, -58);
    ctx.lineTo(21, -67);
    ctx.lineTo(-9, -71);
    ctx.closePath();
    ctx.fill();

    // Red Feather
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-7, -69);
    ctx.lineTo(-16, -87);
    ctx.lineTo(-3, -78);
    ctx.closePath();
    ctx.fill();

    // 4. Dynamic Rotating Bow & Arm
    const rad = archer.aimAngle * (Math.PI / 180);
    ctx.save();
    ctx.translate(7 - archer.recoil, -26);
    ctx.rotate(-rad);

    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, -4.5, 28, 9);

    // Wooden Bow curve
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(30, 0, 36, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Bowstring
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const topY = -Math.sin(Math.PI * 0.45) * 36;
    const botY = Math.sin(Math.PI * 0.45) * 36;
    const topX = 30 + Math.cos(Math.PI * 0.45) * 36;
    const botX = 30 + Math.cos(Math.PI * 0.45) * 36;

    const pullX = gameState.isShooting ? topX : (topX - 16);
    ctx.moveTo(topX, topY);
    ctx.lineTo(pullX, 0);
    ctx.lineTo(botX, botY);
    ctx.stroke();

    // Nocked Arrow
    if (!gameState.isShooting && gameState.arrowsRemainingInRound > 0) {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pullX, 0);
      ctx.lineTo(topX + 20, 0);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(topX + 20, -4.5);
      ctx.lineTo(topX + 29, 0);
      ctx.lineTo(topX + 20, 4.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(pullX, -3.5, 7, 7);
    }

    ctx.restore();

    ctx.restore();
  }

  function drawArrow(ctx) {
    if (!arrow || !arrow.active) return;

    arrow.trail.forEach(t => {
      ctx.fillStyle = `rgba(251, 191, 36, ${t.alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      t.alpha -= 0.08;
    });

    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.rotation);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(12, -4.5);
    ctx.lineTo(21, 0);
    ctx.lineTo(12, 4.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-22, -3.5, 7, 7);

    ctx.restore();
  }

  function drawParticles(ctx) {
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
      const p = gameState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        gameState.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawFloatingTexts(ctx) {
    for (let i = gameState.floatingTexts.length - 1; i >= 0; i--) {
      const ft = gameState.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;

      if (ft.alpha <= 0) {
        gameState.floatingTexts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `900 20px var(--font-display)`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. MAIN GAME LOOP
  // ==========================================================================
  function gameLoop() {
    if (gameState.screen === 'PLAYING') {
      updateArrow();
    }
    render();
    requestAnimationFrame(gameLoop);
  }

  // ==========================================================================
  // 8. STUCENT INTEGRATION HOOKS
  // ==========================================================================
  window.game = window.game || {};

  window.game.init = function(config) {
    window.game.config = config || {};
  };

  window.game.end = function(result) {
    console.log('[Angle Archers] Game Finished Result:', result);
  };

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
