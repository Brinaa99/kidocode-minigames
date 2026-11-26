/**
 * Space Mission Control - Main Game Engine
 * Orchestrates missions, interactive equipment consoles,
 * player decisions, feedback animations, and progression.
 */

class GameEngine {
  constructor() {
    this.currentLevelId = 1;
    this.currentLevelData = null;
    this.currentScenarioIndex = 0;
    this.score = 0;
    this.fuel = 100;
    this.streak = 0;
    this.answersRecord = [];
    this.timer = null;
    this.timeLeft = 0;

    this.spaceVis = null;
    this.radarSys = null;
  }

  init() {
    // Initialize Visualizers
    this.spaceVis = new SpaceVisualizer('space-canvas');
    this.radarSys = new RadarSystem('radar-canvas');
    this.spaceVis.start();
    this.radarSys.start();

    // Init probability elements
    window.probCtrl.initElements();

    // Bind Screen Event Buttons
    this.bindGlobalEvents();

    // Load main menu
    this.openMainMenu();
  }

  bindGlobalEvents() {
    // Menu Buttons
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.uiCtrl.showScreen('level-select-screen');
        window.uiCtrl.renderLevelSelectGrid();
      });
    }

    const instrBtn = document.getElementById('btn-instructions');
    if (instrBtn) {
      instrBtn.addEventListener('click', () => {
        window.uiCtrl.showScreen('instructions-screen');
      });
    }

    const backMenuBtns = document.querySelectorAll('.btn-back-to-menu');
    backMenuBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.openMainMenu();
      });
    });

    const levelSelectBtns = document.querySelectorAll('.btn-to-level-select');
    levelSelectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.uiCtrl.showScreen('level-select-screen');
        window.uiCtrl.renderLevelSelectGrid();
      });
    });

    // Briefing Continue Button
    const briefingLaunchBtn = document.getElementById('btn-briefing-launch');
    if (briefingLaunchBtn) {
      briefingLaunchBtn.addEventListener('click', () => {
        this.enterGameplay();
      });
    }

    // Level Complete Next Button
    const nextMissionBtn = document.getElementById('btn-next-mission');
    if (nextMissionBtn) {
      nextMissionBtn.addEventListener('click', () => {
        if (this.currentLevelId < 10) {
          this.startLevel(this.currentLevelId + 1);
        } else {
          this.showFinalResults();
        }
      });
    }

    // Replay Button
    const replayBtn = document.getElementById('btn-replay-mission');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.startLevel(this.currentLevelId);
      });
    }

    // Play Again Button on Final Results
    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.startLevel(1);
      });
    }

    // Reset Progress Button
    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all mission progress and stars?")) {
          window.gameState.resetProgress();
          window.uiCtrl.renderLevelSelectGrid();
          alert("Mission progress reset to Level 1.");
        }
      });
    }
  }

  openMainMenu() {
    this.spaceVis.setMode('menu');
    window.uiCtrl.showScreen('menu-screen');
  }

  startLevel(levelId) {
    this.currentLevelId = levelId;
    this.currentLevelData = window.LEVELS_DATA.find(lvl => lvl.id === levelId);
    if (!this.currentLevelData) return;

    this.currentScenarioIndex = 0;
    this.score = 0;
    this.fuel = 100;
    this.streak = 0;
    this.answersRecord = [];

    // Set Visualizer mode and blips
    this.spaceVis.setMode(this.currentLevelData.mode);
    this.radarSys.setBlips(this.currentLevelData.radarBlips || []);

    // Show Briefing Screen
    this.showBriefing();
  }

  showBriefing() {
    const data = this.currentLevelData;
    const titleEl = document.getElementById('briefing-title');
    const loreEl = document.getElementById('briefing-lore');
    const conceptTitleEl = document.getElementById('briefing-concept-title');
    const conceptExplainEl = document.getElementById('briefing-concept-explain');
    const instrEl = document.getElementById('briefing-instructions');

    if (titleEl) titleEl.textContent = data.title;
    if (loreEl) loreEl.textContent = data.briefing.lore;
    if (conceptTitleEl) conceptTitleEl.textContent = data.briefing.conceptTitle;
    if (conceptExplainEl) conceptExplainEl.innerHTML = data.briefing.conceptExplain.replace(/\n/g, '<br>');
    if (instrEl) instrEl.textContent = data.briefing.instructions;

    window.uiCtrl.showScreen('briefing-screen');
  }

  enterGameplay() {
    window.uiCtrl.showScreen('gameplay-screen');
    if (window.soundCtrl) window.soundCtrl.playScan();
    this.loadScenario(0);
  }

  loadScenario(index) {
    this.currentScenarioIndex = index;
    const scenarios = this.currentLevelData.scenarios;
    if (index >= scenarios.length) {
      this.completeLevel();
      return;
    }

    const sc = scenarios[index];
    const totalScenarios = scenarios.length;
    const progressRatio = index / totalScenarios;

    // Update HUD
    window.uiCtrl.updateHUD(this.currentLevelData, this.score, this.fuel, progressRatio);

    // Update Objective text
    const objTitle = document.getElementById('mission-step-title');
    const objDesc = document.getElementById('mission-step-desc');
    const objQuestion = document.getElementById('mission-question-text');

    if (objTitle) objTitle.textContent = `[STAGE ${index + 1}/${totalScenarios}] ${sc.title}`;
    if (objDesc) objDesc.textContent = sc.description;
    if (objQuestion) objQuestion.textContent = sc.question;

    // Render Visual Equipment Data if present (e.g. channel bars, hazard counters)
    this.renderEquipmentConsole(sc);

    // Set initial probability gauge
    window.probCtrl.setGaugeValue(50);

    // Render interactive probability buttons
    window.probCtrl.renderCategoryButtons('prob-options-container', (selectedVal, btnEl) => {
      this.handlePlayerDecision(sc, selectedVal, btnEl);
    }, sc.options);

    // Clear feedback box
    const feedbackBox = document.getElementById('mission-feedback-box');
    if (feedbackBox) {
      feedbackBox.className = 'feedback-box hidden';
      feedbackBox.innerHTML = '';
    }
  }

  renderEquipmentConsole(scenario) {
    const consoleBox = document.getElementById('interactive-equipment-box');
    if (!consoleBox) return;
    consoleBox.innerHTML = '';

    // If scenario has visualData (e.g. ratios, bars, channels)
    if (scenario.visualData) {
      const v = scenario.visualData;
      const equipDiv = document.createElement('div');
      equipDiv.className = 'visual-equipment-display';

      let itemsHtml = '';
      if (v.green !== undefined && v.red !== undefined) {
        itemsHtml += `<div class="equipment-label">${v.label}</div><div class="equipment-slots">`;
        for (let i = 0; i < v.green; i++) {
          itemsHtml += `<div class="slot-box clear" title="Clear Channel">📻 ON</div>`;
        }
        for (let i = 0; i < v.red; i++) {
          itemsHtml += `<div class="slot-box jammed" title="Jammed Channel">⚡ JAM</div>`;
        }
        itemsHtml += `</div>`;
      } else if (v.safe !== undefined && v.danger !== undefined) {
        itemsHtml += `<div class="equipment-label">${v.label}</div><div class="equipment-slots">`;
        for (let i = 0; i < v.safe; i++) {
          itemsHtml += `<div class="slot-box safe" title="Clear Path">🚀 SAFE</div>`;
        }
        for (let i = 0; i < v.danger; i++) {
          itemsHtml += `<div class="slot-box danger" title="Asteroid Danger">☄️ AST</div>`;
        }
        itemsHtml += `</div>`;
      } else if (v.blue !== undefined && v.red !== undefined) {
        itemsHtml += `<div class="equipment-label">${v.label}</div><div class="equipment-slots">`;
        for (let i = 0; i < v.blue; i++) {
          itemsHtml += `<div class="slot-box blue-beacon">🔷 BLUE</div>`;
        }
        for (let i = 0; i < v.red; i++) {
          itemsHtml += `<div class="slot-box red-beacon">🔴 RED</div>`;
        }
        itemsHtml += `</div>`;
      } else if (v.smooth !== undefined && v.rough !== undefined) {
        itemsHtml += `<div class="equipment-label">${v.label}</div><div class="equipment-slots">`;
        for (let i = 0; i < v.smooth; i++) {
          itemsHtml += `<div class="slot-box smooth">🌕 FLAT</div>`;
        }
        for (let i = 0; i < v.rough; i++) {
          itemsHtml += `<div class="slot-box rough">🪨 CRAG</div>`;
        }
        itemsHtml += `</div>`;
      } else if (v.label) {
        itemsHtml += `<div class="equipment-label">${v.label}</div>`;
      }

      equipDiv.innerHTML = itemsHtml;
      consoleBox.appendChild(equipDiv);
    }
  }

  handlePlayerDecision(scenario, selectedValue, btnEl) {
    const isCorrect = scenario.options.some(opt => opt.value === selectedValue && opt.correct);
    const feedbackBox = document.getElementById('mission-feedback-box');
    const optionsContainer = document.getElementById('prob-options-container');

    // Disable buttons temporarily
    const allBtns = optionsContainer.querySelectorAll('.prob-btn');
    allBtns.forEach(b => b.disabled = true);

    // Set gauge to scenario's true target
    window.probCtrl.setGaugeValue(scenario.gaugeTarget, selectedValue);

    if (isCorrect) {
      // Correct!
      this.streak++;
      const earned = 100 + (this.streak > 1 ? (this.streak - 1) * 25 : 0);
      this.score += earned;
      this.answersRecord.push({ scenarioId: scenario.id, correct: true, score: earned });

      if (window.soundCtrl) window.soundCtrl.playSuccess();

      // Show floating score
      const rect = btnEl.getBoundingClientRect();
      window.uiCtrl.showFloatingScore(`+${earned} PTS!`, rect.left + 20, rect.top - 10, this.streak > 1);

      // Feedback display
      if (feedbackBox) {
        feedbackBox.className = 'feedback-box success-feedback';
        feedbackBox.innerHTML = `
          <div class="feedback-heading">✅ DECISION VERIFIED - EXCELLENT!</div>
          <div class="feedback-body">${scenario.explanation}</div>
          <button id="btn-next-scenario" class="pixel-btn btn-confirm">CONTINUE TO NEXT STAGE ➔</button>
        `;
        feedbackBox.classList.remove('hidden');

        document.getElementById('btn-next-scenario').addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          this.loadScenario(this.currentScenarioIndex + 1);
        });
      }
    } else {
      // Incorrect
      this.streak = 0;
      this.fuel = Math.max(10, this.fuel - 15);
      this.answersRecord.push({ scenarioId: scenario.id, correct: false, score: 0 });

      if (window.soundCtrl) window.soundCtrl.playError();

      if (feedbackBox) {
        feedbackBox.className = 'feedback-box error-feedback';
        feedbackBox.innerHTML = `
          <div class="feedback-heading">⚠️ MISSION COMPUTATION MISMATCH</div>
          <div class="feedback-body">
            Not quite Commander. Let's look at the conditions again:<br>
            <strong>${scenario.explanation}</strong>
          </div>
          <button id="btn-retry-scenario" class="pixel-btn btn-retry">RE-CALIBRATE & RETRY ↺</button>
        `;
        feedbackBox.classList.remove('hidden');

        document.getElementById('btn-retry-scenario').addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          feedbackBox.classList.add('hidden');
          allBtns.forEach(b => {
            b.disabled = false;
            b.classList.remove('selected');
          });
        });
      }
    }

    // Refresh HUD
    window.uiCtrl.updateHUD(this.currentLevelData, this.score, this.fuel, (this.currentScenarioIndex + 1) / this.currentLevelData.scenarios.length);
  }

  completeLevel() {
    if (window.soundCtrl) window.soundCtrl.playFanfare();

    // Calculate stars
    const totalScenarios = this.currentLevelData.scenarios.length;
    const correctCount = this.answersRecord.filter(a => a.correct).length;
    let stars = 1;
    if (correctCount === totalScenarios && this.fuel >= 80) {
      stars = 3;
    } else if (correctCount >= totalScenarios - 1) {
      stars = 2;
    }

    // Record progress
    window.gameState.recordLevelCompletion(
      this.currentLevelId,
      this.score,
      stars,
      this.currentLevelData.mode
    );

    // Populate Level Complete Screen
    const titleEl = document.getElementById('complete-level-title');
    const scoreEl = document.getElementById('complete-score');
    const starsEl = document.getElementById('complete-stars');
    const conceptDebriefEl = document.getElementById('complete-concept-debrief');
    const nextBtn = document.getElementById('btn-next-mission');

    if (titleEl) titleEl.textContent = `${this.currentLevelData.title} COMPLETED!`;
    if (scoreEl) scoreEl.textContent = `${this.score} PTS`;

    if (starsEl) {
      let starsHtml = '';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<span class="star ${i <= stars ? 'earned' : 'empty'}">★</span>`;
      }
      starsEl.innerHTML = starsHtml;
    }

    if (conceptDebriefEl) {
      conceptDebriefEl.innerHTML = `
        <h3>Key Concept Mastered:</h3>
        <p>${this.currentLevelData.briefing.conceptTitle}</p>
        <div class="debrief-note">${this.currentLevelData.briefing.conceptExplain.replace(/\n/g, '<br>')}</div>
      `;
    }

    if (nextBtn) {
      if (this.currentLevelId >= 10) {
        nextBtn.textContent = "VIEW FINAL RESULTS 🏆";
      } else {
        nextBtn.textContent = `CONTINUE TO LEVEL ${this.currentLevelId + 1} ➔`;
      }
    }

    window.uiCtrl.showScreen('level-complete-screen');
    window.uiCtrl.renderLevelSelectGrid();
  }

  showFinalResults() {
    if (window.soundCtrl) window.soundCtrl.playFanfare();

    const grandScore = window.gameState.data.totalScore;
    const completedCount = Object.keys(window.gameState.data.completedLevels).length;

    const finalScoreEl = document.getElementById('final-total-score');
    const finalLevelsEl = document.getElementById('final-levels-completed');
    const finalRankEl = document.getElementById('final-commander-rank');

    if (finalScoreEl) finalScoreEl.textContent = `${grandScore} PTS`;
    if (finalLevelsEl) finalLevelsEl.textContent = `${completedCount} / 10`;

    let rank = "JUNIOR CADET";
    if (completedCount >= 10) rank = "GRAND FLEET ADMIRAL 🌟";
    else if (completedCount >= 7) rank = "SENIOR MISSION COMMANDER 🚀";
    else if (completedCount >= 4) rank = "ORBITAL FLIGHT DIRECTOR 🛰️";
    else rank = "MISSION CONTROL OPERATOR 🛸";

    if (finalRankEl) finalRankEl.textContent = rank;

    window.uiCtrl.showScreen('final-results-screen');
  }
}

window.gameEngine = new GameEngine();
