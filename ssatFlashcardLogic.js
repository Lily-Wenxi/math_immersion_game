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

  const ANTONYM_MAP = {
    abundant: "scarce",
    adapt: "resist",
    adept: "clumsy",
    amiable: "hostile",
    apparent: "obscure",
    ardent: "apathetic",
    audacious: "timid",
    authentic: "fake",
    benevolent: "malevolent",
    candid: "deceptive",
    chaotic: "orderly",
    coherent: "confused",
    conceal: "reveal",
    credible: "implausible",
    daunt: "encourage",
    diligent: "lazy",
    disclose: "conceal",
    diverse: "uniform",
    dormant: "active",
    dynamic: "static",
    elated: "dejected",
    elusive: "obvious",
    eminent: "unknown",
    endure: "quit",
    enhance: "weaken",
    explicit: "vague",
    frugal: "wasteful",
    genuine: "counterfeit",
    hostile: "friendly",
    impartial: "biased",
    imply: "state",
    indifferent: "enthusiastic",
    inhibit: "encourage",
    intense: "mild",
    lucid: "confusing",
    meticulous: "careless",
    novel: "ordinary",
    obscure: "clear",
    optimistic: "pessimistic",
    persistent: "inconsistent",
    precise: "inexact",
    random: "systematic",
    rational: "irrational",
    relevant: "irrelevant",
    resilient: "fragile",
    rigid: "flexible",
    robust: "weak",
    scarce: "abundant",
    skeptical: "convinced",
    stable: "unstable",
    substantial: "insignificant",
    sufficient: "insufficient",
    superficial: "profound",
    tenacious: "yielding",
    tentative: "certain",
    thrive: "decline",
    tranquil: "agitated",
    ubiquitous: "rare",
    ultimate: "initial",
    validate: "refute",
    vigilant: "careless",
    vivid: "dull",
  };

  function buildUsageSentence(wordObj) {
    return `During discussion, the class used "${wordObj.word}" correctly in context.`;
  }

  function buildComicPanels(wordObj) {
    const meaning = wordObj.definition;
    return [
      `I found the word "${wordObj.word}" in today's passage.`,
      `Context clue: here it means ${meaning}.`,
      `Now I can use "${wordObj.word}" in my own sentence!`,
    ];
  }

  function resolveAntonym(wordObj) {
    const key = String(wordObj.word || "").toLowerCase();
    const fromMap = ANTONYM_MAP[key];
    if (fromMap) return fromMap;

    if (wordObj.antonym && /^[a-z-]+$/i.test(wordObj.antonym)) {
      return String(wordObj.antonym).toLowerCase();
    }

    return "(no common opposite)";
  }

  function normalizeWord(wordObj) {
    const synonym = String(wordObj.synonym || wordObj.word || "").toLowerCase();
    const antonym = resolveAntonym(wordObj);
    const usage = wordObj.usage || buildUsageSentence(wordObj);

    return {
      ...wordObj,
      synonym,
      antonym,
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
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SSATFlashcardLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
