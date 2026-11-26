/**
 * The Number Detective - Central Game Controller
 * Manages case flow, clue progression, deduction checks, and scoring.
 */

class GameEngine {
  constructor() {
    this.currentCaseId = 1;
    this.currentCaseData = null;
    this.currentStageIndex = 0;
    this.score = 0;
    this.cluesFound = 0;
    this.mistakesCount = 0;

    this.detVis = null;
  }

  init() {
    this.detVis = new DetectiveVisualizer('detective-canvas');
    this.detVis.start();

    // Hotspot interaction
    this.detVis.onHotspotClick = (hotspot) => {
      this.handleHotspotInspected(hotspot);
    };

    this.bindGlobalEvents();
    this.openMainMenu();
  }

  bindGlobalEvents() {
    // Menu Buttons
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.uiCtrl.showScreen('hq-screen');
        window.uiCtrl.updateHQDisplay();
      });
    }

    const hqCasesBtn = document.getElementById('btn-hq-open-cases');
    if (hqCasesBtn) {
      hqCasesBtn.addEventListener('click', () => {
        window.uiCtrl.showScreen('case-select-screen');
        window.uiCtrl.renderCaseSelectGrid();
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

    const backHQBtns = document.querySelectorAll('.btn-to-hq');
    backHQBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.uiCtrl.showScreen('hq-screen');
        window.uiCtrl.updateHQDisplay();
      });
    });

    const caseSelectBtns = document.querySelectorAll('.btn-to-case-select');
    caseSelectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.uiCtrl.showScreen('case-select-screen');
        window.uiCtrl.renderCaseSelectGrid();
      });
    });

    // Briefing Launch Button
    const startCaseBtn = document.getElementById('btn-briefing-start-case');
    if (startCaseBtn) {
      startCaseBtn.addEventListener('click', () => {
        this.enterInvestigation();
      });
    }

    // Hint Button
    const hintBtn = document.getElementById('btn-investigation-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        window.investigationSys.showHint();
      });
    }

    // Next Stage Button
    const nextStageBtn = document.getElementById('btn-next-stage');
    if (nextStageBtn) {
      nextStageBtn.addEventListener('click', () => {
        this.loadStage(this.currentStageIndex + 1);
      });
    }

    // Next Case Button
    const nextCaseBtn = document.getElementById('btn-next-case');
    if (nextCaseBtn) {
      nextCaseBtn.addEventListener('click', () => {
        if (this.currentCaseId < 10) {
          this.startCase(this.currentCaseId + 1);
        } else {
          this.showFinalResults();
        }
      });
    }

    // Replay Case Button
    const replayBtn = document.getElementById('btn-replay-case');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.startCase(this.currentCaseId);
      });
    }

    // Play Again (Final Screen)
    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.startCase(1);
      });
    }

    // Reset Progress
    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all detective case records, stars and badges?")) {
          window.gameState.resetProgress();
          window.uiCtrl.renderCaseSelectGrid();
          window.uiCtrl.updateHQDisplay();
          alert("Detective records reset to Case 1.");
        }
      });
    }
  }

  openMainMenu() {
    window.uiCtrl.showScreen('menu-screen');
  }

  startCase(caseId) {
    this.currentCaseId = caseId;
    this.currentCaseData = window.DETECTIVE_CASES.find(c => c.id === caseId);
    if (!this.currentCaseData) return;

    this.currentStageIndex = 0;
    this.score = 0;
    this.cluesFound = 0;
    this.mistakesCount = 0;

    // Load case into investigation system
    window.investigationSys.loadCase(this.currentCaseData);

    // Setup visualizer scene & hotspots
    this.detVis.setScene(this.currentCaseData.sceneName, this.currentCaseData.hotspots || []);

    // Show Briefing
    this.showBriefing();
  }

  showBriefing() {
    const data = this.currentCaseData;
    const titleEl = document.getElementById('briefing-case-title');
    const topicEl = document.getElementById('briefing-topic-tag');
    const loreEl = document.getElementById('briefing-lore-text');
    const objEl = document.getElementById('briefing-objective-text');
    const mathEl = document.getElementById('briefing-math-concept');

    if (titleEl) titleEl.textContent = data.title;
    if (topicEl) topicEl.textContent = `TOPIC: ${data.topic.toUpperCase()}`;
    if (loreEl) loreEl.textContent = data.briefing.lore;
    if (objEl) objEl.textContent = data.briefing.objective;
    if (mathEl) mathEl.innerHTML = `💡 <strong>Mathematical Principle:</strong> ${data.briefing.mathConcept}`;

    window.uiCtrl.showScreen('briefing-screen');
  }

  enterInvestigation() {
    window.uiCtrl.showScreen('investigation-screen');
    if (window.soundCtrl) window.soundCtrl.playInspect();
    this.loadStage(0);
  }

  loadStage(index) {
    this.currentStageIndex = index;
    window.investigationSys.currentStageIndex = index;
    const stages = this.currentCaseData.stages;

    if (index >= stages.length) {
      this.completeCase();
      return;
    }

    // Hide hint box
    const hintBox = document.getElementById('investigation-hint-box');
    if (hintBox) hintBox.classList.add('hidden');

    // Update HUD
    window.uiCtrl.updateHUD(this.currentCaseData, this.score, index, stages.length);

    // Render Stage UI & answer handler
    window.investigationSys.renderStageUI((selectedVal, btnEl, stage) => {
      this.handlePlayerDeduction(selectedVal, btnEl, stage);
    });
  }

  handleHotspotInspected(hotspot) {
    // When player clicks hotspot, show inspection alert & play sound
    const hintBox = document.getElementById('investigation-hint-box');
    if (hintBox) {
      hintBox.innerHTML = `🔍 <strong>Inspected [${hotspot.label}]:</strong> Clue marks identified!`;
      hintBox.classList.remove('hidden');
    }
  }

  handlePlayerDeduction(selectedValue, btnEl, stage) {
    const isCorrect = stage.options.some(opt => opt.value === selectedValue && opt.correct);
    const feedbackBox = document.getElementById('investigation-feedback-box');
    const optionsGrid = document.getElementById('evidence-options-grid');

    const allBtns = optionsGrid.querySelectorAll('.evidence-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      this.cluesFound++;
      const earned = 100 + (this.mistakesCount === 0 ? 25 : 0);
      this.score += earned;

      if (window.soundCtrl) {
        window.soundCtrl.playEvidenceFound();
        setTimeout(() => window.soundCtrl.playPinConnect(), 300);
      }

      // Add to Notebook
      window.investigationSys.addClueToNotebook(`${stage.title}: ${stage.targetAnswer} (${stage.explanation})`);

      // Show floating score
      const rect = btnEl.getBoundingClientRect();
      window.uiCtrl.showFloatingClue(`+${earned} PTS 🔍`, rect.left + 20, rect.top - 20);

      // Feedback display
      if (feedbackBox) {
        feedbackBox.className = 'feedback-box success-feedback';
        feedbackBox.innerHTML = `
          <div class="feedback-heading">✅ EVIDENCE VERIFIED!</div>
          <div class="feedback-body">${stage.explanation}</div>
          <button id="btn-next-stage" class="pixel-btn btn-confirm">CONTINUE INVESTIGATION ➔</button>
        `;
        feedbackBox.classList.remove('hidden');

        document.getElementById('btn-next-stage').addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          this.loadStage(this.currentStageIndex + 1);
        });
      }
    } else {
      this.mistakesCount++;
      if (window.soundCtrl) window.soundCtrl.playMistake();

      if (feedbackBox) {
        feedbackBox.className = 'feedback-box error-feedback';
        feedbackBox.innerHTML = `
          <div class="feedback-heading">⚠️ DEDUCTION MISMATCH</div>
          <div class="feedback-body">
            Let's re-examine the evidence:<br>
            ${stage.hint}
          </div>
          <button id="btn-retry-stage" class="pixel-btn" style="border-color:#f59e0b; color:#fef3c7;">RE-EXAMINE ↺</button>
        `;
        feedbackBox.classList.remove('hidden');

        document.getElementById('btn-retry-stage').addEventListener('click', () => {
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
    window.uiCtrl.updateHUD(this.currentCaseData, this.score, this.currentStageIndex, this.currentCaseData.stages.length);
  }

  completeCase() {
    if (window.soundCtrl) window.soundCtrl.playCaseSolved();

    const stars = this.mistakesCount === 0 ? 3 : (this.mistakesCount <= 2 ? 2 : 1);
    const badgeKey = `badge_case_${this.currentCaseId}`;

    window.gameState.recordCaseCompletion(
      this.currentCaseId,
      this.score,
      stars,
      this.cluesFound,
      badgeKey
    );

    const titleEl = document.getElementById('complete-case-title');
    const scoreEl = document.getElementById('complete-score');
    const debriefEl = document.getElementById('complete-concept-debrief');
    const nextBtn = document.getElementById('btn-next-case');

    if (titleEl) titleEl.textContent = `${this.currentCaseData.title} SOLVED!`;
    if (scoreEl) scoreEl.textContent = `${this.score} PTS`;

    if (debriefEl) {
      debriefEl.innerHTML = `
        <h3>Investigation Solved:</h3>
        <p style="color:var(--gold-coin); font-weight:bold;">${this.currentCaseData.topic}</p>
        <p style="color:#e2e8f0; margin-top:6px;">${this.currentCaseData.briefing.mathConcept}</p>
        <div style="margin-top:10px; font-family:var(--font-mono); color:#a7f3d0;">
          All clues connected and filed at Detective Headquarters!
        </div>
      `;
    }

    if (nextBtn) {
      if (this.currentCaseId >= 10) {
        nextBtn.textContent = "VIEW FINAL BUREAU RESULTS 🏆";
      } else {
        nextBtn.textContent = `OPEN CASE #${this.currentCaseId + 1} ➔`;
      }
    }

    window.uiCtrl.showScreen('case-complete-screen');
    window.uiCtrl.renderCaseSelectGrid();
    window.uiCtrl.updateHQDisplay();
  }

  showFinalResults() {
    if (window.soundCtrl) window.soundCtrl.playCaseSolved();

    const grandScore = window.gameState.data.totalScore;
    const completedCount = Object.keys(window.gameState.data.completedCases).length;
    const cluesTotal = window.gameState.data.cluesDiscovered;

    const finalScoreEl = document.getElementById('final-total-score');
    const finalCasesEl = document.getElementById('final-cases-completed');
    const finalCluesEl = document.getElementById('final-clues-discovered');
    const finalRankEl = document.getElementById('final-detective-rank');

    if (finalScoreEl) finalScoreEl.textContent = `${grandScore} PTS`;
    if (finalCasesEl) finalCasesEl.textContent = `${completedCount} / 10`;
    if (finalCluesEl) finalCluesEl.textContent = `${cluesTotal}`;
    if (finalRankEl) finalRankEl.textContent = "MASTER NUMBER DETECTIVE 🌟";

    window.uiCtrl.showScreen('final-results-screen');
  }
}

window.gameEngine = new GameEngine();
