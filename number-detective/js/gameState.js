/**
 * The Number Detective - Game State Manager
 * Tracks solved cases, detective badges, ranks, and persistent localStorage data.
 */

class GameStateManager {
  constructor() {
    this.storageKey = 'number_detective_save_v1';
    this.currentCase = 1;
    this.currentScreen = 'menu';
    this.maxCases = 10;
    this.listeners = {};

    this.data = this.loadData();
  }

  loadData() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          unlockedCase: parsed.unlockedCase || 1,
          completedCases: parsed.completedCases || {},
          totalScore: parsed.totalScore || 0,
          cluesDiscovered: parsed.cluesDiscovered || 0,
          badges: parsed.badges || []
        };
      } catch (e) {
        console.warn('Failed to parse Number Detective save data:', e);
      }
    }
    return {
      unlockedCase: 1,
      completedCases: {},
      totalScore: 0,
      cluesDiscovered: 0,
      badges: []
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
      unlockedCase: 1,
      completedCases: {},
      totalScore: 0,
      cluesDiscovered: 0,
      badges: []
    };
    this.saveData();
    this.currentCase = 1;
    this.emit('progressReset');
  }

  isCaseUnlocked(caseId) {
    return caseId <= this.data.unlockedCase;
  }

  getCaseStats(caseId) {
    return this.data.completedCases[caseId] || null;
  }

  getDetectiveRank() {
    const count = Object.keys(this.data.completedCases).length;
    if (count >= 10) return "Master Number Detective 🌟";
    if (count >= 7) return "Lead Inspector 🔍";
    if (count >= 4) return "Senior Sleuth 🕵️";
    return "Junior Investigator 🔎";
  }

  recordCaseCompletion(caseId, score, stars, cluesCount, badgeKey = null) {
    const existing = this.data.completedCases[caseId];

    if (!existing || score > existing.score) {
      this.data.completedCases[caseId] = {
        score: score,
        stars: Math.max(stars, existing ? existing.stars : 1),
        cluesCount: cluesCount,
        completedAt: Date.now()
      };
    }

    if (caseId + 1 > this.data.unlockedCase && caseId < this.maxCases) {
      this.data.unlockedCase = caseId + 1;
    }

    if (badgeKey && !this.data.badges.includes(badgeKey)) {
      this.data.badges.push(badgeKey);
    }

    this.data.cluesDiscovered += cluesCount;
    this.data.totalScore = Object.values(this.data.completedCases).reduce((acc, curr) => acc + curr.score, 0);

    this.saveData();
    this.emit('caseCompleted', { caseId, score, stars });
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
