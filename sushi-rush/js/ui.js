/**
 * Sushi Rush - User Interface Controller
 * Manages screen transitions, HUD stats, modals,
 * floating coin animations, sound toggles, and level select cards.
 */

class UIController {
  constructor() {
    this.currentScreen = 'menu';
    this.screens = [
      'menu-screen',
      'level-select-screen',
      'briefing-screen',
      'gameplay-screen',
      'order-complete-screen',
      'level-complete-screen',
      'final-results-screen',
      'instructions-screen'
    ];
  }

  init() {
    this.setupSoundButton();
    this.setupFullscreenButton();
    this.renderLevelSelectGrid();
  }

  showScreen(screenId) {
    this.currentScreen = screenId;
    this.screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === screenId) {
          el.classList.remove('hidden');
          el.classList.add('active');
        } else {
          el.classList.add('hidden');
          el.classList.remove('active');
        }
      }
    });

    if (window.soundCtrl) window.soundCtrl.playClick();
  }

  setupSoundButton() {
    const btns = document.querySelectorAll('.sound-toggle-btn');
    const updateIcons = () => {
      const isMuted = window.soundCtrl.isMuted();
      btns.forEach(b => {
        b.innerHTML = isMuted ? '🔇 <span class="btn-lbl">Muted</span>' : '🔊 <span class="btn-lbl">Sound ON</span>';
        b.classList.toggle('muted', isMuted);
      });
    };

    btns.forEach(b => {
      b.addEventListener('click', () => {
        window.soundCtrl.toggleSound();
        updateIcons();
      });
    });

    updateIcons();
  }

  setupFullscreenButton() {
    const btns = document.querySelectorAll('.fullscreen-toggle-btn');
    btns.forEach(b => {
      b.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.warn('Fullscreen blocked:', err);
          });
        } else {
          document.exitFullscreen().catch(err => {});
        }
      });
    });
  }

  renderLevelSelectGrid() {
    const grid = document.getElementById('level-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.SUSHI_LEVELS.forEach(lvl => {
      const isUnlocked = window.gameState.isLevelUnlocked(lvl.id);
      const stats = window.gameState.getLevelStats(lvl.id);
      const isCompleted = !!stats;

      const card = document.createElement('div');
      card.className = `level-card pixel-box ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;

      let starsHtml = '';
      if (isCompleted) {
        for (let i = 1; i <= 3; i++) {
          starsHtml += `<span class="star ${i <= stats.stars ? 'earned' : 'empty'}">★</span>`;
        }
      }

      card.innerHTML = `
        <div class="level-num">LEVEL ${lvl.id}</div>
        <div class="level-title">${lvl.title.replace(`Level ${lvl.id} – `, '')}</div>
        <div class="level-tables">📊 ${lvl.tablesPracticed}</div>
        <div class="level-status">
          ${!isUnlocked ? '<span class="lock-icon">🔒 CLOSED</span>' : (isCompleted ? `<div class="stars">${starsHtml}</div><div class="high-score">🪙 ${stats.coins}</div>` : '<span class="ready-badge">OPEN</span>')}
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          window.gameEngine.startLevel(lvl.id);
        });
      }

      grid.appendChild(card);
    });
  }

  showFloatingReward(text, x, y, isCoin = true) {
    const floater = document.createElement('div');
    floater.className = `floating-reward ${isCoin ? 'coin-reward' : 'score-reward'}`;
    floater.textContent = text;
    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;
    document.body.appendChild(floater);

    setTimeout(() => {
      if (floater.parentNode) floater.parentNode.removeChild(floater);
    }, 1200);
  }

  updateHUD(levelData, score, coins, currentOrderIdx, totalOrders) {
    const lvlEl = document.getElementById('hud-level-title');
    const scoreEl = document.getElementById('hud-score');
    const coinsEl = document.getElementById('hud-coins');
    const progEl = document.getElementById('hud-day-progress');

    if (lvlEl) lvlEl.textContent = `LVL ${levelData.id}`;
    if (scoreEl) scoreEl.textContent = `${score}`;
    if (coinsEl) coinsEl.textContent = `${coins}`;
    if (progEl) progEl.textContent = `Order ${currentOrderIdx + 1} of ${totalOrders}`;
  }
}

window.uiCtrl = new UIController();
