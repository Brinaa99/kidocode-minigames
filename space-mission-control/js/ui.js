/**
 * Space Mission Control - User Interface Controller
 * Manages screen transitions, HUD telemetry updates, modals,
 * feedback popups, sound buttons, and level selection grid.
 */

class UIController {
  constructor() {
    this.currentScreen = 'menu';
    this.screens = [
      'menu-screen',
      'level-select-screen',
      'briefing-screen',
      'gameplay-screen',
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

    if (window.soundCtrl) {
      window.soundCtrl.playClick();
    }
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
            console.warn('Fullscreen request blocked:', err);
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

    window.LEVELS_DATA.forEach(lvl => {
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
        <div class="level-num">LVL ${lvl.id}</div>
        <div class="level-title">${lvl.title.replace(`Level ${lvl.id} – `, '')}</div>
        <div class="level-subtitle">${lvl.subtitle}</div>
        <div class="level-status">
          ${!isUnlocked ? '<span class="lock-icon">🔒 LOCKED</span>' : (isCompleted ? `<div class="stars">${starsHtml}</div><div class="high-score">${stats.score} PTS</div>` : '<span class="ready-badge">READY</span>')}
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

  showFloatingScore(text, x, y, isBonus = false) {
    const floater = document.createElement('div');
    floater.className = `floating-score ${isBonus ? 'bonus' : ''}`;
    floater.textContent = text;
    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;
    document.body.appendChild(floater);

    setTimeout(() => {
      if (floater.parentNode) floater.parentNode.removeChild(floater);
    }, 1200);
  }

  updateHUD(levelData, score, fuel = 100, progressRatio = 0) {
    const titleEl = document.getElementById('hud-level-title');
    const scoreEl = document.getElementById('hud-score');
    const fuelEl = document.getElementById('hud-fuel-fill');
    const fuelVal = document.getElementById('hud-fuel-val');
    const progEl = document.getElementById('hud-progress-fill');

    if (titleEl) titleEl.textContent = levelData.title;
    if (scoreEl) scoreEl.textContent = `${score}`;
    if (fuelEl) fuelEl.style.width = `${Math.max(0, Math.min(100, fuel))}%`;
    if (fuelVal) fuelVal.textContent = `${Math.round(fuel)}%`;
    if (progEl) progEl.style.width = `${Math.max(0, Math.min(100, progressRatio * 100))}%`;
  }
}

window.uiCtrl = new UIController();
