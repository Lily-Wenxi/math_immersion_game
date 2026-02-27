(function (global) {
  function getTodayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return Math.abs(h >>> 0);
  }

  function pickIndices(length, seed, count) {
    const picks = [];
    const used = new Set();
    let cursor = seed || 1;
    while (picks.length < Math.min(count, length)) {
      cursor = (cursor * 1664525 + 1013904223) % 4294967296;
      const idx = cursor % length;
      if (!used.has(idx)) {
        used.add(idx);
        picks.push(idx);
      }
    }
    return picks;
  }

  function buildDailyDeck(wordBank, dayKey, count = 20) {
    const seed = hashString(dayKey);
    const idxs = pickIndices(wordBank.length, seed, count);
    return idxs.map((i) => ({ ...wordBank[i] }));
  }

  function buildUsageSentence(wordObj) {
    return `In class discussion, Mia used "${wordObj.word}" to describe the idea clearly.`;
  }

  function buildComicPanels(wordObj) {
    const meaning = wordObj.definition;
    return [
      `Panel 1: A student sees a challenge and says, "What does ${wordObj.word} mean?"`,
      `Panel 2: A friend explains: "It means ${meaning}."`,
      `Panel 3: They use it in context and remember it with confidence!`,
    ];
  }

  function normalizeWord(wordObj) {
    const antonym = wordObj.antonym || `opposite of ${wordObj.synonym || wordObj.word}`;
    const usage = wordObj.usage || buildUsageSentence(wordObj);
    return {
      ...wordObj,
      antonym,
      usage,
      comicPanels: buildComicPanels(wordObj),
    };
  }

  function claimDailyReward(accountPoints, alreadyClaimed, reward = 40) {
    if (alreadyClaimed) {
      return { ok: false, points: accountPoints, reward: 0, message: "Reward already claimed today." };
    }
    return {
      ok: true,
      points: accountPoints + reward,
      reward,
      message: `Check-in complete! +${reward} points earned.`,
    };
  }

  const api = {
    getTodayKey,
    buildDailyDeck,
    normalizeWord,
    claimDailyReward,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SSATFlashcardLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
