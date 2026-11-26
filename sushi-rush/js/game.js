/**
 * Sushi Rush - Central Game Engine
 * Orchestrates restaurant day cycles, customer queue, orders,
 * multiplication checks, serving rewards, and progression.
 */

class GameEngine {
  constructor() {
    this.currentLevelId = 1;
    this.currentLevelData = null;
    this.currentOrderIndex = 0;
    this.score = 0;
    this.coins = 0;
    this.ordersCompleted = 0;
    this.ordersRecord = [];

    this.restVis = null;
  }

  init() {
    this.restVis = new RestaurantVisualizer('restaurant-canvas');
    this.restVis.start();

    this.bindGlobalEvents();
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

    // Briefing Start Day Button
    const startDayBtn = document.getElementById('btn-briefing-start-day');
    if (startDayBtn) {
      startDayBtn.addEventListener('click', () => {
        this.enterGameplay();
      });
    }

    // Plate Quantity Controls (+1 piece, +2 pieces, Clear)
    const add1Btn = document.getElementById('btn-add-1-piece');
    if (add1Btn) {
      add1Btn.addEventListener('click', () => {
        window.cookingSys.addPiecesToPlates(1);
      });
    }

    const add2Btn = document.getElementById('btn-add-2-pieces');
    if (add2Btn) {
      add2Btn.addEventListener('click', () => {
        window.cookingSys.addPiecesToPlates(2);
      });
    }

    const add3Btn = document.getElementById('btn-add-3-pieces');
    if (add3Btn) {
      add3Btn.addEventListener('click', () => {
        window.cookingSys.addPiecesToPlates(3);
      });
    }

    const clearPlatesBtn = document.getElementById('btn-clear-plates');
    if (clearPlatesBtn) {
      clearPlatesBtn.addEventListener('click', () => {
        window.cookingSys.clearPlates();
      });
    }

    // Serve Order Button
    const serveBtn = document.getElementById('btn-serve-order');
    if (serveBtn) {
      serveBtn.addEventListener('click', () => {
        this.handleServeOrder();
      });
    }

    // Continue to next customer from Order Complete screen
    const nextOrderBtn = document.getElementById('btn-next-customer');
    if (nextOrderBtn) {
      nextOrderBtn.addEventListener('click', () => {
        this.loadOrder(this.currentOrderIndex + 1);
      });
    }

    // Next Level Button
    const nextLevelBtn = document.getElementById('btn-next-level');
    if (nextLevelBtn) {
      nextLevelBtn.addEventListener('click', () => {
        if (this.currentLevelId < 10) {
          this.startLevel(this.currentLevelId + 1);
        } else {
          this.showFinalResults();
        }
      });
    }

    // Replay Level Button
    const replayBtn = document.getElementById('btn-replay-level');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.startLevel(this.currentLevelId);
      });
    }

    // Play Again Button (from Final Screen)
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
        if (confirm("Reset all restaurant progress, coins and stars?")) {
          window.gameState.resetProgress();
          window.uiCtrl.renderLevelSelectGrid();
          alert("Restaurant progress reset to Level 1.");
        }
      });
    }
  }

  openMainMenu() {
    window.uiCtrl.showScreen('menu-screen');
  }

  startLevel(levelId) {
    this.currentLevelId = levelId;
    this.currentLevelData = window.SUSHI_LEVELS.find(lvl => lvl.id === levelId);
    if (!this.currentLevelData) return;

    this.currentOrderIndex = 0;
    this.score = 0;
    this.coins = 0;
    this.ordersCompleted = 0;
    this.ordersRecord = [];

    this.showBriefing();
  }

  showBriefing() {
    const data = this.currentLevelData;
    const titleEl = document.getElementById('briefing-title');
    const conceptEl = document.getElementById('briefing-concept');
    const tablesEl = document.getElementById('briefing-tables');
    const ordersCountEl = document.getElementById('briefing-orders-count');

    if (titleEl) titleEl.textContent = data.title;
    if (conceptEl) conceptEl.innerHTML = data.conceptExplain.replace(/\n/g, '<br>');
    if (tablesEl) tablesEl.textContent = `Practicing: ${data.tablesPracticed}`;
    if (ordersCountEl) ordersCountEl.textContent = `${data.orders.length} Customer Orders`;

    window.uiCtrl.showScreen('briefing-screen');
  }

  enterGameplay() {
    window.uiCtrl.showScreen('gameplay-screen');
    this.loadOrder(0);
  }

  loadOrder(index) {
    this.currentOrderIndex = index;
    const orders = this.currentLevelData.orders;

    if (index >= orders.length) {
      this.completeLevel();
      return;
    }

    const order = orders[index];

    // Customer arrival bell
    if (window.soundCtrl) window.soundCtrl.playDoorbell();

    // Set Customer in Visualizer
    this.restVis.setCustomer(order.customerType, 'sitting');

    // Update HUD
    window.uiCtrl.updateHUD(this.currentLevelData, this.score, this.coins, index, orders.length);

    // Update Customer Speech Bubble & Order Display
    const nameEl = document.getElementById('customer-name-tag');
    const bubbleEl = document.getElementById('customer-speech-bubble');
    const orderTitleEl = document.getElementById('order-dish-title');
    const orderReqEl = document.getElementById('order-requirement-summary');

    if (nameEl) nameEl.textContent = `Customer: ${order.customerName}`;
    if (bubbleEl) bubbleEl.textContent = `"${order.dialogue}"`;
    if (orderTitleEl) orderTitleEl.textContent = `${order.icon} ${order.sushiName}`;
    if (orderReqEl) {
      orderReqEl.innerHTML = `Need: <strong>${order.plates} plates</strong> with <strong>${order.piecesPerPlate} pieces</strong> each.`;
    }

    // Set up cooking station with this order
    window.cookingSys.setOrder(order);

    // Clear feedback box
    const feedbackBox = document.getElementById('kitchen-feedback-box');
    if (feedbackBox) {
      feedbackBox.className = 'feedback-box hidden';
      feedbackBox.innerHTML = '';
    }

    // Return to gameplay screen
    window.uiCtrl.showScreen('gameplay-screen');
  }

  handleServeOrder() {
    const result = window.cookingSys.checkOrderCompletion();
    const feedbackBox = document.getElementById('kitchen-feedback-box');
    const currentOrder = this.currentLevelData.orders[this.currentOrderIndex];

    if (result.success) {
      // Order correct!
      this.ordersCompleted++;
      const earnedCoins = 50 + (currentOrder.total >= 20 ? 30 : 10);
      const earnedScore = 100 + currentOrder.total * 5;

      this.coins += earnedCoins;
      this.score += earnedScore;
      this.ordersRecord.push({ orderId: currentOrder.id, success: true });

      // Customer eats happily
      this.restVis.setCustomer(currentOrder.customerType, 'happy');

      if (window.soundCtrl) {
        window.soundCtrl.playServeSuccess();
        setTimeout(() => window.soundCtrl.playCoin(), 300);
      }

      // Show floating rewards
      const serveBtn = document.getElementById('btn-serve-order');
      if (serveBtn) {
        const rect = serveBtn.getBoundingClientRect();
        window.uiCtrl.showFloatingReward(`+${earnedCoins} 🪙`, rect.left + 20, rect.top - 20, true);
        window.uiCtrl.showFloatingReward(`+${earnedScore} PTS`, rect.left + 80, rect.top - 40, false);
      }

      // Update HUD
      window.uiCtrl.updateHUD(this.currentLevelData, this.score, this.coins, this.currentOrderIndex, this.currentLevelData.orders.length);

      // Show Order Complete Modal
      this.showOrderCompleteModal(currentOrder, earnedCoins, earnedScore);

    } else {
      // Mistake
      if (window.soundCtrl) window.soundCtrl.playMistake();

      if (feedbackBox) {
        feedbackBox.className = 'feedback-box error-feedback';
        feedbackBox.innerHTML = `
          <div class="feedback-heading">⚠️ ORDER NEEDS ADJUSTMENT</div>
          <div class="feedback-body">
            ${result.reason}<br>
            <strong>Hint: ${currentOrder.hint}</strong>
          </div>
        `;
        feedbackBox.classList.remove('hidden');
      }
    }
  }

  showOrderCompleteModal(order, earnedCoins, earnedScore) {
    const nameEl = document.getElementById('order-complete-name');
    const mathEl = document.getElementById('order-complete-math');
    const additionEl = document.getElementById('order-complete-addition');
    const coinsEl = document.getElementById('order-complete-coins');

    if (nameEl) nameEl.textContent = `${order.customerName} is delighted! ⭐⭐⭐`;
    if (mathEl) {
      mathEl.innerHTML = `
        <div style="font-size:1.4rem; color:var(--neon-green); margin:8px 0;">
          ${order.plates} plates × ${order.piecesPerPlate} pieces = ${order.total} PIECES!
        </div>
      `;
    }
    if (additionEl) {
      additionEl.innerHTML = `Repeated addition: <strong>${order.repeatedAddition}</strong>`;
    }
    if (coinsEl) {
      coinsEl.textContent = `+${earnedCoins} Coins Earned!`;
    }

    setTimeout(() => {
      window.uiCtrl.showScreen('order-complete-screen');
    }, 800);
  }

  completeLevel() {
    if (window.soundCtrl) window.soundCtrl.playLevelFanfare();

    const stars = 3; // Completed all orders accurately
    window.gameState.recordLevelCompletion(this.currentLevelId, this.score, this.coins, stars);

    const titleEl = document.getElementById('complete-level-title');
    const scoreEl = document.getElementById('complete-score');
    const coinsEl = document.getElementById('complete-coins');
    const debriefEl = document.getElementById('complete-concept-debrief');
    const nextBtn = document.getElementById('btn-next-level');

    if (titleEl) titleEl.textContent = `${this.currentLevelData.title} COMPLETED!`;
    if (scoreEl) scoreEl.textContent = `${this.score} PTS`;
    if (coinsEl) coinsEl.textContent = `🪙 ${this.coins} Coins`;

    if (debriefEl) {
      debriefEl.innerHTML = `
        <h3>Multiplication Tables Mastered:</h3>
        <p style="color:var(--neon-cyan); font-weight:bold;">${this.currentLevelData.tablesPracticed}</p>
        <p style="color:#cbd5e1; margin-top:6px;">${this.currentLevelData.conceptExplain.replace(/\n/g, '<br>')}</p>
      `;
    }

    if (nextBtn) {
      if (this.currentLevelId >= 10) {
        nextBtn.textContent = "VIEW FINAL RESTAURANT RESULTS 🏆";
      } else {
        nextBtn.textContent = `CONTINUE TO LEVEL ${this.currentLevelId + 1} ➔`;
      }
    }

    window.uiCtrl.showScreen('level-complete-screen');
    window.uiCtrl.renderLevelSelectGrid();
  }

  showFinalResults() {
    if (window.soundCtrl) window.soundCtrl.playLevelFanfare();

    const grandScore = window.gameState.data.totalScore;
    const grandCoins = window.gameState.data.totalCoins;
    const completedCount = Object.keys(window.gameState.data.completedLevels).length;

    const finalScoreEl = document.getElementById('final-total-score');
    const finalCoinsEl = document.getElementById('final-total-coins');
    const finalLevelsEl = document.getElementById('final-levels-completed');

    if (finalScoreEl) finalScoreEl.textContent = `${grandScore} PTS`;
    if (finalCoinsEl) finalCoinsEl.textContent = `🪙 ${grandCoins}`;
    if (finalLevelsEl) finalLevelsEl.textContent = `${completedCount} / 10`;

    window.uiCtrl.showScreen('final-results-screen');
  }
}

window.gameEngine = new GameEngine();
