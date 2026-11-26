/**
 * Sushi Rush - Game State Manager
 * Tracks restaurant coins, scores, customer satisfaction,
 * level unlocking, stars, and persistent localStorage data.
 */

class GameStateManager {
  constructor() {
    this.storageKey = 'sushi_rush_save_data_v1';
    this.currentLevel = 1;
    this.currentScreen = 'menu';
    this.maxLevels = 10;
    this.listeners = {};

    this.data = this.loadData();
  }

  loadData() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          unlockedLevel: parsed.unlockedLevel || 1,
          completedLevels: parsed.completedLevels || {},
          totalScore: parsed.totalScore || 0,
          totalCoins: parsed.totalCoins || 0,
          customerRating: parsed.customerRating || 5.0
        };
      } catch (e) {
        console.warn('Failed to parse Sushi Rush save data:', e);
      }
    }
    return {
      unlockedLevel: 1,
      completedLevels: {},
      totalScore: 0,
      totalCoins: 0,
      customerRating: 5.0
    };
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  resetProgress() {
    this.data = {
      unlockedLevel: 1,
      completedLevels: {},
      totalScore: 0,
      totalCoins: 0,
      customerRating: 5.0
    };
    this.saveData();
    this.currentLevel = 1;
    this.emit('progressReset');
  }

  isLevelUnlocked(lvl) {
    return lvl <= this.data.unlockedLevel;
  }

  getLevelStats(lvl) {
    return this.data.completedLevels[lvl] || null;
  }

  recordLevelCompletion(lvl, score, coins, stars) {
    const existing = this.data.completedLevels[lvl];

    if (!existing || score > existing.score) {
      this.data.completedLevels[lvl] = {
        score: score,
        coins: coins,
        stars: Math.max(stars, existing ? existing.stars : 1),
        completedAt: Date.now()
      };
    }

    if (lvl + 1 > this.data.unlockedLevel && lvl < this.maxLevels) {
      this.data.unlockedLevel = lvl + 1;
    }

    // Accumulate total score and coins
    this.data.totalScore = Object.values(this.data.completedLevels).reduce((acc, curr) => acc + curr.score, 0);
    this.data.totalCoins = Object.values(this.data.completedLevels).reduce((acc, curr) => acc + curr.coins, 0);

    this.saveData();
    this.emit('levelCompleted', { lvl, score, coins, stars });
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

window.gameState = new GameStateManager();
