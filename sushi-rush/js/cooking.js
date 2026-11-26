/**
 * Sushi Rush - Cooking & Preparation System
 * Manages sushi ingredients, bamboo mat rolling, slicing,
 * plate arrangement into equal groups, and multiplication verification.
 */

class CookingSystem {
  constructor() {
    this.currentOrder = null;
    this.selectedIngredient = null;
    this.rollState = 'empty'; // 'empty', 'ingredients_added', 'rolled', 'sliced'
    this.platesCount = 0;
    this.piecesPerPlate = 0;
    this.plates = []; // Array of counts on each plate: [0, 0, 0]
    this.totalPiecesPrepared = 0;
    this.onOrderUpdated = null;
  }

  setOrder(order) {
    this.currentOrder = order;
    this.selectedIngredient = order.sushiType;
    this.platesCount = order.plates;
    this.piecesPerPlate = 0;
    this.plates = new Array(order.plates).fill(0);
    this.totalPiecesPrepared = 0;
    this.rollState = 'empty';
    this.renderPreparationStation();
  }

  selectIngredient(type) {
    this.selectedIngredient = type;
    if (window.soundCtrl) window.soundCtrl.playClick();
    this.renderIngredients();
  }

  rollSushi() {
    if (!this.selectedIngredient) return;
    this.rollState = 'rolled';
    if (window.soundCtrl) window.soundCtrl.playRoll();
    this.renderRollStation();
  }

  sliceRoll(piecesCount) {
    if (this.rollState !== 'rolled') return;
    this.rollState = 'sliced';
    if (window.soundCtrl) window.soundCtrl.playSlice();
    this.renderRollStation();
  }

  addPiecesToPlates(countPerPlate) {
    this.piecesPerPlate = Math.max(0, this.piecesPerPlate + countPerPlate);
    for (let i = 0; i < this.plates.length; i++) {
      this.plates[i] = this.piecesPerPlate;
    }
    this.totalPiecesPrepared = this.platesCount * this.piecesPerPlate;

    if (window.soundCtrl) window.soundCtrl.playPlateClink();
    this.renderPlatesStation();
    this.updateFormulaDisplay();
  }

  clearPlates() {
    this.piecesPerPlate = 0;
    for (let i = 0; i < this.plates.length; i++) {
      this.plates[i] = 0;
    }
    this.totalPiecesPrepared = 0;
    if (window.soundCtrl) window.soundCtrl.playClick();
    this.renderPlatesStation();
    this.updateFormulaDisplay();
  }

  renderPreparationStation() {
    this.renderIngredients();
    this.renderRollStation();
    this.renderPlatesStation();
    this.updateFormulaDisplay();
  }

  renderIngredients() {
    const container = document.getElementById('ingredients-selector');
    if (!container) return;
    container.innerHTML = '';

    const ingredients = [
      { id: 'salmon', name: 'Fresh Salmon', icon: '🍣' },
      { id: 'tuna', name: 'Red Tuna', icon: '🍱' },
      { id: 'avocado', name: 'Avocado', icon: '🥑' },
      { id: 'cucumber', name: 'Cucumber', icon: '🥒' },
      { id: 'tamago', name: 'Sweet Egg', icon: '🍳' },
      { id: 'shrimp', name: 'Ebi Shrimp', icon: '🍤' }
    ];

    ingredients.forEach(ing => {
      const btn = document.createElement('button');
      btn.className = `ingredient-btn pixel-box ${this.selectedIngredient === ing.id ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="ing-icon">${ing.icon}</span>
        <span class="ing-name">${ing.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectIngredient(ing.id);
      });
      container.appendChild(btn);
    });
  }

  renderRollStation() {
    const mat = document.getElementById('bamboo-mat-display');
    if (!mat) return;

    let icon = '🍣';
    if (this.currentOrder) icon = this.currentOrder.icon;

    if (this.rollState === 'empty') {
      mat.innerHTML = `
        <div class="mat-surface">
          <div class="rice-bed">🍚 Steamed Rice Bed & Nori</div>
          <button id="btn-roll-makisu" class="pixel-btn btn-primary" style="margin-top:10px;">
            🥢 ROLL SUSHI WITH MAKISU
          </button>
        </div>
      `;
      const rollBtn = document.getElementById('btn-roll-makisu');
      if (rollBtn) {
        rollBtn.addEventListener('click', () => this.rollSushi());
      }
    } else if (this.rollState === 'rolled') {
      mat.innerHTML = `
        <div class="mat-surface">
          <div class="sushi-log">🌯 Whole Sushi Roll (${this.currentOrder.sushiName})</div>
          <button id="btn-slice-knife" class="pixel-btn btn-confirm" style="margin-top:10px;">
            🔪 CUT INTO EQUAL PIECES
          </button>
        </div>
      `;
      const sliceBtn = document.getElementById('btn-slice-knife');
      if (sliceBtn) {
        sliceBtn.addEventListener('click', () => this.sliceRoll(this.currentOrder.piecesPerPlate));
      }
    } else {
      mat.innerHTML = `
        <div class="mat-surface">
          <div class="sliced-pieces">
            ${new Array(6).fill(icon).map(item => `<span class="piece-icon">${item}</span>`).join('')}
          </div>
          <div style="color:var(--neon-green); font-size:0.75rem; font-family:var(--font-pixel); margin-top:6px;">
            ✅ FRESH PIECES READY FOR PLATES!
          </div>
        </div>
      `;
    }
  }

  renderPlatesStation() {
    const container = document.getElementById('plates-container');
    if (!container) return;
    container.innerHTML = '';

    const icon = this.currentOrder ? this.currentOrder.icon : '🍣';

    for (let i = 0; i < this.platesCount; i++) {
      const plate = document.createElement('div');
      plate.className = 'sushi-plate pixel-box';

      const piecesInPlate = this.plates[i] || 0;
      let piecesHtml = '';
      for (let p = 0; p < piecesInPlate; p++) {
        piecesHtml += `<span class="plate-piece">${icon}</span>`;
      }

      plate.innerHTML = `
        <div class="plate-header">PLATE ${i + 1}</div>
        <div class="plate-dish">
          ${piecesHtml || '<span class="plate-empty-hint">Empty Plate</span>'}
        </div>
        <div class="plate-count">${piecesInPlate} pieces</div>
      `;
      container.appendChild(plate);
    }
  }

  updateFormulaDisplay() {
    const formulaEl = document.getElementById('multiplication-formula-text');
    const additionEl = document.getElementById('repeated-addition-text');
    if (!this.currentOrder) return;

    const plates = this.platesCount;
    const pieces = this.piecesPerPlate;
    const total = plates * pieces;

    if (formulaEl) {
      formulaEl.innerHTML = `
        <span class="math-factor">${plates} plates</span>
        <span class="math-op">×</span>
        <span class="math-factor">${pieces} pieces</span>
        <span class="math-op">=</span>
        <span class="math-product">${total} TOTAL PIECES</span>
      `;
    }

    if (additionEl) {
      if (pieces > 0) {
        const terms = new Array(plates).fill(pieces).join(' + ');
        additionEl.innerHTML = `💡 Repeated Addition: <strong>${terms} = ${total}</strong>`;
      } else {
        additionEl.innerHTML = `💡 Add sushi pieces to plates to solve: <strong>${plates} plates × ? pieces</strong>`;
      }
    }
  }

  checkOrderCompletion() {
    if (!this.currentOrder) return false;
    // Check if ingredient matches
    if (this.selectedIngredient !== this.currentOrder.sushiType) {
      return {
        success: false,
        reason: `The customer ordered ${this.currentOrder.sushiName}, but you prepared with another ingredient!`
      };
    }

    // Check if pieces per plate matches
    if (this.piecesPerPlate !== this.currentOrder.piecesPerPlate) {
      return {
        success: false,
        reason: `Each plate needs exactly ${this.currentOrder.piecesPerPlate} pieces, but currently has ${this.piecesPerPlate} pieces!`
      };
    }

    // Check total
    if (this.totalPiecesPrepared !== this.currentOrder.total) {
      return {
        success: false,
        reason: `Total pieces must be ${this.currentOrder.total} (${this.currentOrder.plates} × ${this.currentOrder.piecesPerPlate}), but you made ${this.totalPiecesPrepared}!`
      };
    }

    return {
      success: true,
      plates: this.platesCount,
      pieces: this.piecesPerPlate,
      total: this.totalPiecesPrepared
    };
  }
}

window.cookingSys = new CookingSystem();
