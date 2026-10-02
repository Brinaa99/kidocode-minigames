/**
 * ANGLE ARCHERS — COMPARING ANGLES ARCADE
 * Full-featured arcade archery game focusing on comparing angle magnitudes visually and numerically.
 * Year 4 Cambridge Mathematics Standard — No quiz worksheets, pure interactive gameplay!
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

    playTone(freq, type, duration, startVol = 0.3, endVol = 0.01, pitchDrop = null) {
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
      osc.frequency.linearRampToValueAtTime(260, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    playArrowRelease() {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      // Noise burst for release whoosh
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }

    playTargetHit(isCorrect) {
      if (this.isMuted) return;
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (isCorrect) {
        // Wooden thunk + triumphant chords
        this.playTone(180, 'triangle', 0.08, 0.4, 0.01, 80);
        
        // Bell chime
        setTimeout(() => {
          this.playTone(523.25, 'sine', 0.25, 0.3, 0.01); // C5
          setTimeout(() => this.playTone(659.25, 'sine', 0.25, 0.3, 0.01), 60); // E5
          setTimeout(() => this.playTone(783.99, 'sine', 0.35, 0.35, 0.01), 120); // G5
        }, 50);
      } else {
        // Dull wood thud + error tone
        this.playTone(130, 'sawtooth', 0.2, 0.35, 0.01, 60);
        setTimeout(() => this.playTone(95, 'sawtooth', 0.3, 0.3, 0.01, 50), 70);
      }
    }

    playStreakSound(streakLevel) {
      if (this.isMuted) return;
      const baseFreq = 440 + Math.min(streakLevel * 60, 400);
      this.playTone(baseFreq, 'sine', 0.2, 0.25, 0.01);
      setTimeout(() => this.playTone(baseFreq * 1.25, 'sine', 0.3, 0.3, 0.01), 70);
    }

    playVictory() {
      if (this.isMuted) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.4, 0.3, 0.01);
        }, idx * 120);
      });
    }

    playGameOver() {
      if (this.isMuted) return;
      const notes = [440, 415.3, 392, 349.23];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.35, 0.25, 0.01, freq * 0.8);
        }, idx * 150);
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
      // Validation: compare larger
      rule: "larger"
    },
    {
      roundNum: 2,
      missionText: "SHOOT THE SMALLER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 40, label: "A" },
        { angleDeg: 90, label: "B" }
      ],
      rule: "smaller"
    },
    {
      roundNum: 3,
      missionText: "SHOOT THE LARGER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 45, label: "A" },
        { angleDeg: 75, label: "B" }
      ],
      rule: "larger"
    },
    {
      roundNum: 4,
      missionText: "SHOOT THE SMALLER ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 65, label: "A" },
        { angleDeg: 55, label: "B" }
      ],
      rule: "smaller"
    },
    {
      roundNum: 5,
      missionText: "SHOOT AN EQUAL ANGLE!",
      targetCount: 2,
      targets: [
        { angleDeg: 70, label: "A" },
        { angleDeg: 70, label: "B" }
      ],
      rule: "equal" // Both targets are valid!
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
      rule: "largest"
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
      rule: "smallest"
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
      rule: "largest"
    },
    {
      roundNum: 9,
      missionText: "SHOOT THE SMALLEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 50, label: "A" },
        { angleDeg: 25, label: "B" },
        { angleDeg: 85, label: "C" }
      ],
      rule: "smallest"
    },
    {
      roundNum: 10,
      missionText: "FINAL CHALLENGE: SHOOT THE LARGEST ANGLE!",
      targetCount: 3,
      targets: [
        { angleDeg: 75, label: "A" },
        { angleDeg: 85, label: "B" },
        { angleDeg: 80, label: "C" }
      ],
      rule: "largest"
    }
  ];

  // ==========================================================================
  // 3. GAME STATE & CONSTANTS
  // ==========================================================================
  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 540;

  const gameState = {
    screen: 'START', // 'START', 'INSTRUCTIONS', 'PLAYING', 'ROUND_CLEAR', 'GAME_OVER', 'VICTORY'
    score: 0,
    lives: 3,
    maxLives: 3,
    roundIndex: 0, // 0 to 9 (10 rounds)
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
    roundStartTime: 0
  };

  // Archer character state
  const archer = {
    x: 140,
    y: 440,
    aimAngle: 45, // Aim angle in degrees (10° to 80°)
    targetAimAngle: 45,
    minAim: 10,
    maxAim: 80,
    bowDraw: 0, // 0 to 1
    recoil: 0,
    idleTimer: 0
  };

  // Active arrow projectile
  let arrow = null;

  // Cached DOM Elements
  const dom = {};

  // ==========================================================================
  // 4. INITIALIZATION & SETUP
  // ==========================================================================
  function initDOM() {
    dom.canvas = document.getElementById('game-canvas');
    dom.ctx = dom.canvas.getContext('2d');
    
    dom.scoreDisplay = document.getElementById('score-display');
    dom.timerDisplay = document.getElementById('timer-display');
    dom.roundDisplay = document.getElementById('round-display');
    dom.streakDisplay = document.getElementById('streak-display');
    dom.aimDisplay = document.getElementById('aim-display');
    dom.bannerText = document.getElementById('banner-text');

    dom.heart1 = document.getElementById('heart-1');
    dom.heart2 = document.getElementById('heart-2');
    dom.heart3 = document.getElementById('heart-3');

    dom.feedbackPopup = document.getElementById('feedback-popup');
    dom.feedbackIcon = document.getElementById('feedback-icon');
    dom.feedbackTitle = document.getElementById('feedback-title');
    dom.feedbackSubtitle = document.getElementById('feedback-subtitle');

    dom.startScreen = document.getElementById('start-screen');
    dom.instructionsModal = document.getElementById('instructions-modal');
    dom.gameOverModal = document.getElementById('game-over-modal');
    dom.victoryModal = document.getElementById('victory-modal');

    dom.startGameBtn = document.getElementById('start-game-btn');
    dom.howToPlayBtn = document.getElementById('how-to-play-btn');
    dom.hudHowToPlayBtn = document.getElementById('hud-how-to-play-btn');
    dom.closeInstructionsBtn = document.getElementById('close-instructions-btn');
    dom.startFromInstructionsBtn = document.getElementById('start-from-instructions-btn');
    dom.gameOverRetryBtn = document.getElementById('game-over-retry-btn');
    dom.victoryPlayAgainBtn = document.getElementById('victory-play-again-btn');
    dom.soundToggleBtn = document.getElementById('sound-toggle-btn');
    dom.soundIconOn = document.getElementById('sound-icon-on');
    dom.soundIconOff = document.getElementById('sound-icon-off');

    dom.btnAimLeft = document.getElementById('btn-aim-left');
    dom.btnAimRight = document.getElementById('btn-aim-right');
    dom.aimSlider = document.getElementById('aim-slider');
    dom.btnShoot = document.getElementById('btn-shoot');

    setupEventHandlers();
    setupAmbientScenery();
  }

  function setupAmbientScenery() {
    // Ambient floating clouds
    gameState.ambientClouds = [
      { x: 50, y: 40, speed: 0.2, scale: 1.0 },
      { x: 380, y: 70, speed: 0.15, scale: 0.8 },
      { x: 720, y: 30, speed: 0.25, scale: 1.2 }
    ];

    // Ambient floating tournament leaves
    gameState.ambientLeaves = [];
    for (let i = 0; i < 12; i++) {
      gameState.ambientLeaves.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: 0.5 + Math.random() * 0.8,
        vy: 0.3 + Math.random() * 0.5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
      });
    }
  }

  function setupEventHandlers() {
    // Start game buttons
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

    // Aim Slider
    dom.aimSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      archer.targetAimAngle = val;
      updateAimUI();
    });

    // Touch Aim Buttons (hold or tap)
    let aimInterval = null;
    const startAimAdjust = (delta) => {
      audio.playBowDraw();
      adjustAim(delta);
      aimInterval = setInterval(() => adjustAim(delta), 80);
    };
    const stopAimAdjust = () => {
      if (aimInterval) clearInterval(aimInterval);
    };

    dom.btnAimLeft.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startAimAdjust(2);
    });
    dom.btnAimLeft.addEventListener('pointerup', stopAimAdjust);
    dom.btnAimLeft.addEventListener('pointercancel', stopAimAdjust);

    dom.btnAimRight.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startAimAdjust(-2);
    });
    dom.btnAimRight.addEventListener('pointerup', stopAimAdjust);
    dom.btnAimRight.addEventListener('pointercancel', stopAimAdjust);

    dom.btnShoot.addEventListener('click', (e) => {
      e.preventDefault();
      shootArrow();
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
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

    // Mouse / Pointer Aiming on Canvas
    dom.canvas.addEventListener('pointermove', (e) => {
      if (gameState.screen !== 'PLAYING' || gameState.isShooting) return;
      const rect = dom.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Calculate angle from archer bow to mouse
      const dx = mouseX - archer.x;
      const dy = archer.y - mouseY; // Invert y for standard math angle
      if (dx > 20) {
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        angleDeg = Math.max(archer.minAim, Math.min(archer.maxAim, angleDeg));
        archer.targetAimAngle = angleDeg;
        updateAimUI();
      }
    });

    dom.canvas.addEventListener('pointerdown', (e) => {
      if (gameState.screen !== 'PLAYING') return;
      // If clicking, aim and shoot immediately toward the click location
      const rect = dom.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const dx = mouseX - archer.x;
      const dy = archer.y - mouseY;
      if (dx > 20) {
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        angleDeg = Math.max(archer.minAim, Math.min(archer.maxAim, angleDeg));
        archer.aimAngle = angleDeg;
        archer.targetAimAngle = angleDeg;
        updateAimUI();
      }

      shootArrow();
    });
  }

  function adjustAim(delta) {
    archer.targetAimAngle = Math.max(archer.minAim, Math.min(archer.maxAim, archer.targetAimAngle + delta));
    updateAimUI();
  }

  function updateAimUI() {
    dom.aimSlider.value = Math.round(archer.targetAimAngle);
    dom.aimDisplay.textContent = `${Math.round(archer.targetAimAngle)}°`;
  }

  function showInstructions() {
    dom.instructionsModal.classList.remove('hidden');
  }

  function hideInstructions() {
    dom.instructionsModal.classList.add('hidden');
  }

  // ==========================================================================
  // 5. GAMEPLAY LOGIC & ROUND PROGRESSION
  // ==========================================================================
  function startGame() {
    // Reset state
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
    arrow = null;

    // Hide modals
    dom.startScreen.classList.add('hidden');
    dom.instructionsModal.classList.add('hidden');
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
    const roundConfig = ROUND_DEFINITIONS[index];
    gameState.currentRoundData = roundConfig;
    gameState.isShooting = false;
    arrow = null;

    dom.bannerText.textContent = roundConfig.missionText;
    dom.roundDisplay.textContent = `${String(index + 1).padStart(2, '0')} / 10`;

    // Position targets across arena
    setupTargetPositions(roundConfig);

    // Initial aim suggestion for smooth gameplay
    if (gameState.targetPositions.length > 0) {
      // Find angle of first correct target as a hint direction
      const correctTarget = gameState.targetPositions.find(t => t.isCorrect) || gameState.targetPositions[0];
      const dx = correctTarget.x - archer.x;
      const dy = archer.y - (correctTarget.y + 40);
      const idealAim = Math.atan2(dy, dx) * (180 / Math.PI);
      archer.targetAimAngle = Math.round(idealAim);
      updateAimUI();
    }
  }

  function setupTargetPositions(roundConfig) {
    gameState.targetPositions = [];
    const count = roundConfig.targetCount;
    const targetY = 220; // Y level of target centers in field

    // Determine correct target(s) based on rule
    const angles = roundConfig.targets.map(t => t.angleDeg);
    let maxAngle = Math.max(...angles);
    let minAngle = Math.min(...angles);

    let xPositions = [];
    if (count === 2) {
      xPositions = [460, 760];
    } else {
      xPositions = [380, 600, 820];
    }

    roundConfig.targets.forEach((t, i) => {
      let isCorrect = false;
      if (roundConfig.rule === 'larger' || roundConfig.rule === 'largest') {
        isCorrect = t.angleDeg === maxAngle;
      } else if (roundConfig.rule === 'smaller' || roundConfig.rule === 'smallest') {
        isCorrect = t.angleDeg === minAngle;
      } else if (roundConfig.rule === 'equal') {
        // In equal round, all equal targets are correct!
        isCorrect = true;
      }

      gameState.targetPositions.push({
        id: i,
        label: t.label,
        angleDeg: t.angleDeg,
        isCorrect: isCorrect,
        x: xPositions[i],
        y: targetY,
        radius: 46, // Target disc radius
        hitReaction: 0, // Recoil animation counter
        isHit: false,
        stuckArrows: []
      });
    });
  }

  function shootArrow() {
    if (gameState.screen !== 'PLAYING' || gameState.isShooting || arrow) return;

    gameState.isShooting = true;
    gameState.shotsFired++;
    archer.recoil = 12;
    audio.playArrowRelease();

    // Physics parameters for arrow trajectory
    const rad = archer.aimAngle * (Math.PI / 180);
    const speed = 24; // Initial velocity
    const vx = Math.cos(rad) * speed;
    const vy = -Math.sin(rad) * speed;

    arrow = {
      x: archer.x + Math.cos(rad) * 45,
      y: archer.y - Math.sin(rad) * 45,
      vx: vx,
      vy: vy,
      gravity: 0.38,
      rotation: -rad,
      trail: [],
      active: true
    };
  }

  function updateArrow() {
    if (!arrow || !arrow.active) return;

    // Save trail point
    arrow.trail.push({ x: arrow.x, y: arrow.y, alpha: 0.8 });
    if (arrow.trail.length > 10) arrow.trail.shift();

    // Apply ballistic physics
    arrow.x += arrow.vx;
    arrow.y += arrow.vy;
    arrow.vy += arrow.gravity;
    arrow.rotation = Math.atan2(arrow.vy, arrow.vx);

    // Spawn tiny arrow flight particles
    if (Math.random() < 0.6) {
      gameState.particles.push({
        x: arrow.x,
        y: arrow.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 1.0,
        decay: 0.08,
        size: 2.5,
        color: '#fde047'
      });
    }

    // Check collision with targets
    let collidedTarget = null;
    for (const target of gameState.targetPositions) {
      const dx = arrow.x - target.x;
      const dy = arrow.y - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Generous arcade hit tolerance
      if (dist < target.radius + 18) {
        collidedTarget = target;
        break;
      }
    }

    if (collidedTarget) {
      handleTargetCollision(collidedTarget);
      return;
    }

    // Arrow missed all targets and went off screen
    if (arrow.y > CANVAS_HEIGHT - 30 || arrow.x > CANVAS_WIDTH + 50) {
      handleArrowMiss();
    }
  }

  function handleTargetCollision(target) {
    arrow.active = false;
    target.hitReaction = 15;
    target.isHit = true;
    target.stuckArrows.push({
      relX: arrow.x - target.x,
      relY: arrow.y - target.y,
      rotation: arrow.rotation
    });

    if (target.isCorrect) {
      // CORRECT TARGET HIT!
      gameState.shotsHit++;
      audio.playTargetHit(true);

      // Score calculation with speed bonus and streak multiplier
      const elapsedSeconds = (Date.now() - gameState.roundStartTime) / 1000;
      const speedBonus = elapsedSeconds < 4 ? 50 : (elapsedSeconds < 8 ? 25 : 0);
      const pointsEarned = (100 + speedBonus) * gameState.streak;

      gameState.score += pointsEarned;
      gameState.streak = Math.min(10, gameState.streak + 1);
      if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
      }

      if (gameState.streak > 1) {
        audio.playStreakSound(gameState.streak);
      }

      // Visual particles & feedback
      spawnHitSparks(target.x, target.y, true);
      showFeedback(true, `TARGET HIT! +${pointsEarned}`, `STREAK ${gameState.streak}x`);
      spawnFloatingText(`+${pointsEarned}`, target.x, target.y - 40, '#fbbf24');

      updateHUD();

      // Proceed to next round after short triumphant pause
      setTimeout(() => {
        loadRound(gameState.roundIndex + 1);
      }, 1000);
    } else {
      // WRONG TARGET HIT!
      audio.playTargetHit(false);
      gameState.lives--;
      gameState.streak = 1;
      gameState.screenShake = 12;

      spawnHitSparks(target.x, target.y, false);
      showFeedback(false, "WRONG TARGET!", "-1 LIFE");
      spawnFloatingText("-1 LIFE", target.x, target.y - 40, '#ef4444');

      updateHUD();

      if (gameState.lives <= 0) {
        setTimeout(triggerGameOver, 700);
      } else {
        // Allow player to shoot again in the same round
        setTimeout(() => {
          gameState.isShooting = false;
          arrow = null;
        }, 800);
      }
    }
  }

  function handleArrowMiss() {
    arrow = null;
    gameState.isShooting = false;
    audio.playTone(100, 'triangle', 0.15, 0.2, 0.01);
    spawnFloatingText("MISSED!", archer.x + 100, archer.y - 120, '#94a3b8');
  }

  function spawnHitSparks(x, y, isCorrect) {
    const count = isCorrect ? 24 : 12;
    const colors = isCorrect 
      ? ['#fbbf24', '#f59e0b', '#34d399', '#38bdf8', '#ffffff'] 
      : ['#ef4444', '#b91c1c', '#78716c', '#44403c'];

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
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function spawnFloatingText(text, x, y, color) {
    gameState.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.2,
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
    }, 900);
  }

  function updateHUD() {
    dom.scoreDisplay.textContent = String(gameState.score).padStart(6, '0');
    dom.streakDisplay.textContent = `${gameState.streak}x`;

    // Update heart display
    dom.heart1.className = `arcade-heart ${gameState.lives >= 1 ? 'heart-full' : 'heart-lost'}`;
    dom.heart2.className = `arcade-heart ${gameState.lives >= 2 ? 'heart-full' : 'heart-lost'}`;
    dom.heart3.className = `arcade-heart ${gameState.lives >= 3 ? 'heart-full' : 'heart-lost'}`;
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

    // StuCent Integration end hook
    if (window.game && typeof window.game.end === 'function') {
      window.game.end({
        score: gameState.score,
        maxScore: 3000,
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

    dom.victoryModal.classList.remove('hidden');

    // Spawn massive celebration confetti
    for (let i = 0; i < 80; i++) {
      spawnHitSparks(CANVAS_WIDTH * Math.random(), CANVAS_HEIGHT * 0.4, true);
    }

    // StuCent Integration end hook
    if (window.game && typeof window.game.end === 'function') {
      window.game.end({
        score: gameState.score,
        maxScore: 3000,
        timeTaken: gameState.totalTimeTaken,
        success: true
      });
    }
  }

  // ==========================================================================
  // 6. RENDERING ENGINE (CANVAS ARCHERY ARENA)
  // ==========================================================================
  function render() {
    const ctx = dom.ctx;
    ctx.save();

    // Screen Shake effect on miss
    if (gameState.screenShake > 0) {
      const sx = (Math.random() - 0.5) * gameState.screenShake;
      const sy = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(sx, sy);
      gameState.screenShake *= 0.85;
      if (gameState.screenShake < 0.5) gameState.screenShake = 0;
    }

    // 1. Draw Outdoor Archery Arena Background
    drawEnvironment(ctx);

    // 2. Draw Floating Scenery (Clouds & Ambient Leaves)
    drawAmbientScenery(ctx);

    // 3. Draw Archery Targets & Angle Measurement Stands
    drawTargets(ctx);

    // 4. Draw Trajectory Aim Guide
    if (gameState.screen === 'PLAYING' && !gameState.isShooting) {
      drawAimGuide(ctx);
    }

    // 5. Draw Archer Character & Bow
    drawArcher(ctx);

    // 6. Draw Arrow & Trail
    drawArrow(ctx);

    // 7. Draw Active Particles
    drawParticles(ctx);

    // 8. Draw Floating Texts
    drawFloatingTexts(ctx);

    ctx.restore();
  }

  function drawEnvironment(ctx) {
    // Vibrant sunny sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.6, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, 320);

    // Distant Rolling Castle Hills
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.ellipse(200, 290, 350, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.ellipse(750, 280, 400, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Distant Fortress Castle
    drawCastle(ctx, 160, 140);
    drawCastle(ctx, 820, 150);

    // Green Archery Lawn (Tournament grass)
    const grassGrad = ctx.createLinearGradient(0, 240, 0, CANVAS_HEIGHT);
    grassGrad.addColorStop(0, '#15803d');
    grassGrad.addColorStop(0.3, '#16a34a');
    grassGrad.addColorStop(1, '#166534');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 240, CANVAS_WIDTH, CANVAS_HEIGHT - 240);

    // Tournament Target Shooting Lanes (Distance Lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    for (let y = 300; y < CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Wooden Perimeter Fence in Background
    ctx.fillStyle = '#78350f';
    for (let x = 10; x < CANVAS_WIDTH; x += 40) {
      ctx.fillRect(x, 232, 6, 20);
    }
    ctx.fillRect(0, 236, CANVAS_WIDTH, 4);

    // Tournament Banners & Flags
    drawBannerFlag(ctx, 60, 200, '#ef4444');
    drawBannerFlag(ctx, 900, 200, '#3b82f6');
  }

  function drawCastle(ctx, x, y) {
    ctx.fillStyle = '#64748b';
    // Main tower body
    ctx.fillRect(x - 25, y, 50, 60);
    // Battlements
    ctx.fillRect(x - 28, y - 10, 12, 10);
    ctx.fillRect(x - 6, y - 10, 12, 10);
    ctx.fillRect(x + 16, y - 10, 12, 10);
    // Tower roof crest
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 10);
    ctx.lineTo(x, y - 35);
    ctx.lineTo(x + 20, y - 10);
    ctx.closePath();
    ctx.fill();
    // Flag pole
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 35);
    ctx.lineTo(x, y - 50);
    ctx.stroke();
    // Flag
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
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
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

  function drawAmbientScenery(ctx) {
    // Ambient Drifting Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    gameState.ambientClouds.forEach(c => {
      c.x += c.speed;
      if (c.x > CANVAS_WIDTH + 80) c.x = -100;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.arc(18, -8, 16, 0, Math.PI * 2);
      ctx.arc(36, 0, 18, 0, Math.PI * 2);
      ctx.arc(18, 8, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Ambient floating leaves
    gameState.ambientLeaves.forEach(leaf => {
      leaf.x += leaf.vx;
      leaf.y += leaf.vy;
      leaf.rot += leaf.rotSpeed;

      if (leaf.x > CANVAS_WIDTH) leaf.x = -10;
      if (leaf.y > CANVAS_HEIGHT) leaf.y = 100;

      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rot);
      ctx.fillStyle = leaf.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.size * 1.5, leaf.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawTargets(ctx) {
    gameState.targetPositions.forEach(target => {
      ctx.save();
      ctx.translate(target.x, target.y);

      // Hit recoil animation
      if (target.hitReaction > 0) {
        const shake = Math.sin(target.hitReaction * 2) * (target.hitReaction * 0.5);
        ctx.translate(shake, 0);
        target.hitReaction--;
      }

      // 1. Wooden Easel Legs
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-22, 10, 8, 70);
      ctx.fillRect(14, 10, 8, 70);
      ctx.fillRect(-26, 50, 52, 6);

      // 2. Circular Archery Target Disc
      // Outer rim
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius + 3, 0, Math.PI * 2);
      ctx.fill();

      // White ring
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
      ctx.fill();

      // Black ring
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Blue ring
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Red ring
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Gold bullseye center
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, target.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Target Letter Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 13px var(--font-display)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(target.label, 0, 0);

      // 3. Render Stuck Arrows
      target.stuckArrows.forEach(stuck => {
        ctx.save();
        ctx.translate(stuck.relX, stuck.relY);
        ctx.rotate(stuck.rotation);
        // Arrow shaft
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-24, 0);
        ctx.stroke();
        // Feathers
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-24, -3, 6, 6);
        ctx.restore();
      });

      // 4. Mounted Angle Sign Display Above Target
      drawAngleDisplaySign(ctx, 0, -85, target.angleDeg);

      ctx.restore();
    });
  }

  function drawAngleDisplaySign(ctx, x, y, angleDeg) {
    ctx.save();
    ctx.translate(x, y);

    // Wooden Signboard Plaque
    const signW = 100;
    const signH = 80;

    // Support rod to target
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-4, 30, 8, 20);

    // Sign background
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-signW / 2, -signH / 2, signW, signH, 10);
    ctx.fill();
    ctx.stroke();

    // Angle degree header pill
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-signW / 2 + 8, -signH / 2 + 6, signW - 16, 20, 6);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.font = `900 14px var(--font-display)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${angleDeg}°`, 0, -signH / 2 + 16);

    // --- VISUAL ANGLE RAY & ARC RENDERING ---
    // Vertex located at bottom-left of drawing box
    const vx = -20;
    const vy = 20;
    const rayLength = 38;
    const arcRadius = 18;

    // Ray 1 (Base ray - horizontal)
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + rayLength, vy);
    ctx.stroke();

    // Ray 2 (Rotated ray based on angleDeg)
    const rad = angleDeg * (Math.PI / 180);
    const r2x = vx + Math.cos(rad) * rayLength;
    const r2y = vy - Math.sin(rad) * rayLength; // Subtract for upward rotation

    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(r2x, r2y);
    ctx.stroke();

    // Angle Opening Arc
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    // Draw arc counter-clockwise from 0 rad to -rad
    ctx.arc(vx, vy, arcRadius, 0, -rad, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Angle Vertex Dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawAimGuide(ctx) {
    ctx.save();
    ctx.translate(archer.x, archer.y);

    const rad = archer.aimAngle * (Math.PI / 180);
    const guideLength = 120;

    // Dotted laser aim line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(rad) * guideLength, -Math.sin(rad) * guideLength);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small Aim Angle indicator badge on canvas
    const badgeDist = 65;
    const bx = Math.cos(rad) * badgeDist;
    const by = -Math.sin(rad) * badgeDist - 12;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - 20, by - 10, 40, 20, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 11px var(--font-display)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(archer.aimAngle)}°`, bx, by);

    ctx.restore();
  }

  function drawArcher(ctx) {
    // Smooth aim angle transition
    archer.aimAngle += (archer.targetAimAngle - archer.aimAngle) * 0.2;
    archer.idleTimer += 0.05;
    if (archer.recoil > 0) archer.recoil *= 0.8;

    const bobY = Math.sin(archer.idleTimer) * 2;

    ctx.save();
    ctx.translate(archer.x, archer.y + bobY);

    // 1. Quiver of arrows on back
    ctx.fillStyle = '#78350f';
    ctx.save();
    ctx.rotate(-0.3);
    ctx.fillRect(-22, -40, 12, 34);
    // Arrow fletchings sticking out
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-24, -48, 4, 8);
    ctx.fillRect(-18, -50, 4, 10);
    ctx.restore();

    // 2. Archer Body (Tunic & Belt)
    ctx.fillStyle = '#15803d'; // Green tournament tunic
    ctx.beginPath();
    ctx.roundRect(-16, -35, 32, 40, 6);
    ctx.fill();

    // Gold trim & belt
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-16, -14, 32, 6);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-5, -15, 10, 8);

    // 3. Archer Head & Feathered Cap
    // Head / Face
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -48, 14, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(6, -50, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(5, -45, 4, 0, Math.PI * 0.8);
    ctx.stroke();

    // Archer's Cap (Robin Hood styled tournament cap)
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(-16, -54);
    ctx.lineTo(14, -54);
    ctx.lineTo(18, -62);
    ctx.lineTo(-8, -66);
    ctx.closePath();
    ctx.fill();

    // Cap Feather
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-6, -64);
    ctx.lineTo(-14, -80);
    ctx.lineTo(-4, -72);
    ctx.closePath();
    ctx.fill();

    // 4. Animated Bow & Arms Rotating with Aim Angle
    const rad = archer.aimAngle * (Math.PI / 180);
    ctx.save();
    ctx.translate(6 - archer.recoil, -25);
    ctx.rotate(-rad);

    // Left Arm holding bow
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, -4, 26, 8);

    // Wooden Bow curve
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(28, 0, 32, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Bowstring
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const topY = -Math.sin(Math.PI * 0.45) * 32;
    const botY = Math.sin(Math.PI * 0.45) * 32;
    const topX = 28 + Math.cos(Math.PI * 0.45) * 32;
    const botX = 28 + Math.cos(Math.PI * 0.45) * 32;

    const pullX = gameState.isShooting ? topX : (topX - 14);
    ctx.moveTo(topX, topY);
    ctx.lineTo(pullX, 0);
    ctx.lineTo(botX, botY);
    ctx.stroke();

    // Nocked Arrow ready to fly
    if (!gameState.isShooting) {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pullX, 0);
      ctx.lineTo(topX + 18, 0);
      ctx.stroke();

      // Arrowhead
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(topX + 18, -4);
      ctx.lineTo(topX + 26, 0);
      ctx.lineTo(topX + 18, 4);
      ctx.closePath();
      ctx.fill();

      // Arrow feathers
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(pullX, -3, 6, 6);
    }

    ctx.restore();

    ctx.restore();
  }

  function drawArrow(ctx) {
    if (!arrow || !arrow.active) return;

    // Draw fading trail
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

    // Arrow shaft
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.lineTo(20, 0);
    ctx.lineTo(12, 4);
    ctx.closePath();
    ctx.fill();

    // Arrow feathers
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-20, -3, 6, 6);

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
      ctx.font = `900 18px var(--font-display)`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. MAIN GAME LOOP
  // ==========================================================================
  function gameLoop() {
    updateArrow();
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

  // Bootstrap when document is ready
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
