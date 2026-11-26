/**
 * The Number Detective - User Interface Controller
 * Screen switching, HUD updates, HQ case board rendering, and modals.
 */

class UIController {
  constructor() {
    this.currentScreen = 'menu';
    this.screens = [
      'menu-screen',
      'hq-screen',
      'case-select-screen',
      'briefing-screen',
      'investigation-screen',
      'case-complete-screen',
      'final-results-screen',
      'instructions-screen'
    ];
  }

  init() {
    this.setupSoundButton();
    this.setupFullscreenButton();
    this.renderCaseSelectGrid();
    this.updateHQDisplay();
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

  renderCaseSelectGrid() {
    const grid = document.getElementById('case-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.DETECTIVE_CASES.forEach(c => {
      const isUnlocked = window.gameState.isCaseUnlocked(c.id);
      const stats = window.gameState.getCaseStats(c.id);
      const isCompleted = !!stats;

      const card = document.createElement('div');
      card.className = `case-card pixel-box ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;

      let starsHtml = '';
      if (isCompleted) {
        for (let i = 1; i <= 3; i++) {
          starsHtml += `<span class="star ${i <= stats.stars ? 'earned' : 'empty'}">★</span>`;
        }
      }

      card.innerHTML = `
        <div class="case-badge">CASE #${c.id}</div>
        <div class="case-title">${c.title.replace(`Case ${c.id} – `, '')}</div>
        <div class="case-topic">📋 ${c.topic}</div>
        <div class="case-status">
          ${!isUnlocked ? '<span class="lock-icon">🔒 CLASSIFIED</span>' : (isCompleted ? `<div class="stars">${starsHtml}</div><div class="high-score">${stats.score} PTS</div>` : '<span class="ready-badge">ACTIVE FILE</span>')}
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          window.gameEngine.startCase(c.id);
        });
      }

      grid.appendChild(card);
    });
  }

  updateHQDisplay() {
    const rankEl = document.getElementById('hq-detective-rank');
    const casesSolvedEl = document.getElementById('hq-cases-solved');
    const totalScoreEl = document.getElementById('hq-total-score');
    const cluesCountEl = document.getElementById('hq-clues-count');

    const solvedCount = Object.keys(window.gameState.data.completedCases).length;
    const rank = window.gameState.getDetectiveRank();

    if (rankEl) rankEl.textContent = rank;
    if (casesSolvedEl) casesSolvedEl.textContent = `${solvedCount} / 10`;
    if (totalScoreEl) totalScoreEl.textContent = `${window.gameState.data.totalScore} PTS`;
    if (cluesCountEl) cluesCountEl.textContent = `${window.gameState.data.cluesDiscovered}`;
  }

  showFloatingClue(text, x, y) {
    const floater = document.createElement('div');
    floater.className = 'floating-clue';
    floater.textContent = text;
    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;
    document.body.appendChild(floater);

    setTimeout(() => {
      if (floater.parentNode) floater.parentNode.removeChild(floater);
    }, 1200);
  }

  updateHUD(caseData, score, stageIdx, totalStages) {
    const titleEl = document.getElementById('hud-case-title');
    const scoreEl = document.getElementById('hud-score');
    const progEl = document.getElementById('hud-case-progress');
    const rankEl = document.getElementById('hud-rank-tag');

    if (titleEl) titleEl.textContent = `CASE #${caseData.id}`;
    if (scoreEl) scoreEl.textContent = `${score}`;
    if (progEl) progEl.textContent = `Clue ${stageIdx + 1} of ${totalStages}`;
    if (rankEl) rankEl.textContent = window.gameState.getDetectiveRank();
  }
}

window.uiCtrl = new UIController();
