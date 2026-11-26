/**
 * Space Mission Control - Game State Manager
 * Tracks level progression, scores, stars, unlocked levels,
 * and handles persistent localStorage saving/loading.
 */

class GameStateManager {
  constructor() {
    this.storageKey = 'smc_save_data_v1';
    this.currentLevel = 1;
    this.currentScreen = 'menu';
    this.totalScore = 0;
    this.levelScore = 0;
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
          completedLevels: parsed.completedLevels || {}, // { 1: { score: 100, stars: 3 }, ... }
          totalScore: parsed.totalScore || 0,
          conceptsMastered: parsed.conceptsMastered || []
        };
      } catch (e) {
        console.warn('Failed to parse saved game data:', e);
      }
    }
    return {
      unlockedLevel: 1,
      completedLevels: {},
      totalScore: 0,
      conceptsMastered: []
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
      conceptsMastered: []
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

  recordLevelCompletion(lvl, score, stars, conceptKey) {
    const existing = this.data.completedLevels[lvl];
    const prevScore = existing ? existing.score : 0;

    // Keep highest score
    if (!existing || score > existing.score) {
      this.data.completedLevels[lvl] = {
        score: score,
        stars: Math.max(stars, existing ? existing.stars : 1),
        completedAt: Date.now()
      };
    }

    // Unlock next level
    if (lvl + 1 > this.data.unlockedLevel && lvl < this.maxLevels) {
      this.data.unlockedLevel = lvl + 1;
    }

    // Add concept mastered
    if (conceptKey && !this.data.conceptsMastered.includes(conceptKey)) {
      this.data.conceptsMastered.push(conceptKey);
    }

    // Recompute total score
    this.data.totalScore = Object.values(this.data.completedLevels).reduce((acc, curr) => acc + curr.score, 0);

    this.saveData();
    this.emit('levelCompleted', { lvl, score, stars });
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
