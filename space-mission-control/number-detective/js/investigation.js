/**
 * The Number Detective - Investigation & Detective Tools Engine
 * Manages notebook clues, evidence inspection, hints, and deduction checks.
 */

class InvestigationSystem {
  constructor() {
    this.currentCase = null;
    this.currentStageIndex = 0;
    this.notebookClues = [];
    this.hintsUsed = 0;
    this.onStageCompleted = null;
  }

  loadCase(caseData) {
    this.currentCase = caseData;
    this.currentStageIndex = 0;
    this.notebookClues = [];
    this.hintsUsed = 0;
    this.renderNotebook();
  }

  getCurrentStage() {
    if (!this.currentCase || !this.currentCase.stages) return null;
    return this.currentCase.stages[this.currentStageIndex] || null;
  }

  addClueToNotebook(clueText) {
    if (!this.notebookClues.includes(clueText)) {
      this.notebookClues.push(clueText);
      this.renderNotebook();
    }
  }

  renderNotebook() {
    const listEl = document.getElementById('notebook-clues-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (this.notebookClues.length === 0) {
      listEl.innerHTML = '<li class="notebook-empty">No clues recorded yet. Inspect the crime scene!</li>';
      return;
    }

    this.notebookClues.forEach((clue, idx) => {
      const li = document.createElement('li');
      li.className = 'notebook-entry';
      li.innerHTML = `<span class="clue-bullet">🔍 #${idx + 1}:</span> ${clue}`;
      listEl.appendChild(li);
    });
  }

  renderStageUI(onAnswerCallback) {
    const stage = this.getCurrentStage();
    if (!stage) return;

    const titleEl = document.getElementById('case-stage-title');
    const descEl = document.getElementById('case-stage-desc');
    const questionEl = document.getElementById('case-question-text');
    const optionsGrid = document.getElementById('evidence-options-grid');
    const feedbackBox = document.getElementById('investigation-feedback-box');

    if (titleEl) titleEl.textContent = `[EVIDENCE ${this.currentStageIndex + 1}/${this.currentCase.stages.length}] ${stage.title}`;
    if (descEl) descEl.textContent = stage.description;
    if (questionEl) questionEl.textContent = stage.question;

    if (feedbackBox) {
      feedbackBox.className = 'feedback-box hidden';
      feedbackBox.innerHTML = '';
    }

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      stage.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'pixel-btn evidence-opt-btn';
        btn.dataset.val = opt.value;
        btn.innerHTML = `<span class="opt-bullet">📌</span> ${opt.text}`;

        btn.addEventListener('click', () => {
          if (window.soundCtrl) window.soundCtrl.playClick();
          optionsGrid.querySelectorAll('.evidence-opt-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          if (onAnswerCallback) {
            onAnswerCallback(opt.value, btn, stage);
          }
        });

        optionsGrid.appendChild(btn);
      });
    }
  }

  showHint() {
    const stage = this.getCurrentStage();
    if (!stage) return;
    this.hintsUsed++;
    if (window.soundCtrl) window.soundCtrl.playInspect();

    const hintBox = document.getElementById('investigation-hint-box');
    if (hintBox) {
      hintBox.innerHTML = `💡 <strong>Detective Tip:</strong> ${stage.hint}`;
      hintBox.classList.remove('hidden');
    }
  }
}

window.investigationSys = new InvestigationSystem();
