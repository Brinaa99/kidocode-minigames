/**
 * Space Mission Control - Probability & Likelihood Engine
 * Manages the visual probability gauge, likelihood categories,
 * mathematical ratios, and interactive probability controls.
 */

class ProbabilityController {
  constructor() {
    this.categories = {
      impossible: {
        id: 'impossible',
        name: 'Impossible',
        range: [0, 0],
        percent: 0,
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#f87171',
        icon: '🚫',
        description: 'Cannot happen under given conditions (0% chance).'
      },
      unlikely: {
        id: 'unlikely',
        name: 'Unlikely',
        range: [1, 40],
        percent: 20,
        color: '#f97316',
        bg: 'rgba(249, 115, 22, 0.2)',
        borderColor: '#fb923c',
        icon: '📉',
        description: 'Small chance of happening (less than half).'
      },
      equally_likely: {
        id: 'equally_likely',
        name: 'Equally Likely',
        range: [45, 55],
        percent: 50,
        color: '#eab308',
        bg: 'rgba(234, 179, 8, 0.2)',
        borderColor: '#facc15',
        icon: '⚖️',
        description: 'Two or more outcomes with the exact same chance (50/50).'
      },
      likely: {
        id: 'likely',
        name: 'Likely',
        range: [60, 99],
        percent: 80,
        color: '#06b6d4',
        bg: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#38bdf8',
        icon: '📈',
        description: 'High chance of happening (more than half).'
      },
      certain: {
        id: 'certain',
        name: 'Certain',
        range: [100, 100],
        percent: 100,
        color: '#22c55e',
        bg: 'rgba(34, 197, 94, 0.2)',
        borderColor: '#4ade80',
        icon: '🎯',
        description: 'Will definitely happen under given conditions (100% chance).'
      }
    };

    this.currentValue = 50;
    this.targetValue = 50;
    this.gaugeElement = null;
    this.needleElement = null;
  }

  initElements() {
    this.gaugeBar = document.getElementById('prob-gauge-fill');
    this.needleElement = document.getElementById('prob-needle');
    this.valueLabel = document.getElementById('prob-value-label');
    this.statusLabel = document.getElementById('prob-status-label');
  }

  setGaugeValue(percent, categoryKey = null) {
    this.currentValue = Math.max(0, Math.min(100, percent));

    if (this.needleElement) {
      this.needleElement.style.left = `${this.currentValue}%`;
    }
    if (this.gaugeBar) {
      this.gaugeBar.style.width = `${this.currentValue}%`;
    }

    if (this.valueLabel) {
      this.valueLabel.textContent = `${Math.round(this.currentValue)}% CHANCE`;
    }

    if (this.statusLabel && categoryKey && this.categories[categoryKey]) {
      const cat = this.categories[categoryKey];
      this.statusLabel.textContent = cat.name.toUpperCase();
      this.statusLabel.style.color = cat.color;
    }
  }

  getCategoryForPercent(p) {
    if (p === 0) return 'impossible';
    if (p === 100) return 'certain';
    if (p >= 45 && p <= 55) return 'equally_likely';
    if (p < 45) return 'unlikely';
    return 'likely';
  }

  renderCategoryButtons(containerId, onSelectCallback, allowedOptions = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const list = allowedOptions || [
      { text: "Impossible", value: "impossible" },
      { text: "Unlikely", value: "unlikely" },
      { text: "Equally likely", value: "equally_likely" },
      { text: "Likely", value: "likely" },
      { text: "Certain", value: "certain" }
    ];

    list.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn prob-btn';
      btn.dataset.val = item.value;

      const catInfo = this.categories[item.value];
      const icon = catInfo ? catInfo.icon : '🚀';
      const color = catInfo ? catInfo.color : '#38bdf8';

      btn.innerHTML = `
        <span class="btn-icon">${icon}</span>
        <span class="btn-text">${item.text}</span>
      `;
      btn.style.setProperty('--btn-accent', color);

      btn.addEventListener('click', () => {
        if (window.soundCtrl) window.soundCtrl.playClick();
        // Update selection UI
        container.querySelectorAll('.prob-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (catInfo) {
          this.setGaugeValue(catInfo.percent, item.value);
        }
        if (onSelectCallback) {
          onSelectCallback(item.value, btn);
        }
      });

      container.appendChild(btn);
    });
  }
}

window.probCtrl = new ProbabilityController();
