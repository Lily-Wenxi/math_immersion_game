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

  function wordForms(word) {
    const forms = [word];
    if (!word.endsWith("s")) forms.push(`${word}s`);
    if (!word.endsWith("ed")) forms.push(`${word}ed`);
    if (!word.endsWith("ing")) forms.push(`${word}ing`);
    if (!word.endsWith("ly")) forms.push(`${word}ly`);
    if (!word.endsWith("ness")) forms.push(`${word}ness`);
    return [...new Set(forms)].slice(0, 5);
  }

  function inferAntonym(baseWord) {
    const prefixes = ["un", "in", "im", "ir", "non", "dis"];
    const lower = baseWord.toLowerCase();
    for (const prefix of prefixes) {
      if (!lower.startsWith(prefix) && lower.length > 4) {
        return `${prefix}${lower}`;
      }
    }
    return `not-${lower}`;
  }

  function buildUsageSentence(wordObj) {
    return `During the class challenge, the team used "${wordObj.word}" correctly in a real sentence.`;
  }

  function buildComicPanels(wordObj) {
    const meaning = wordObj.definition;
    return [
      `${wordObj.word.toUpperCase()}? I saw it in today's reading!`,
      `It means ${meaning}. Check the context clue bubble!`,
      `Now use it: "${wordObj.word}" in your own sentence and level up!`,
    ];
  }

  function normalizeWord(wordObj) {
    const synonymBase = String(wordObj.synonym || wordObj.word).toLowerCase();
    const antonymBase = String(wordObj.antonym || inferAntonym(synonymBase)).toLowerCase();
    const usage = wordObj.usage || buildUsageSentence(wordObj);

    const synonymForms = wordForms(synonymBase);
    const antonymForms = wordForms(antonymBase);

    return {
      ...wordObj,
      synonym: synonymForms[0],
      antonym: antonymForms[0],
      synonymForms,
      antonymForms,
      usage,
      comicPanels: buildComicPanels(wordObj),
      dictionaryUrl: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(wordObj.word)}`,
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
    wordForms,
    inferAntonym,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SSATFlashcardLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
