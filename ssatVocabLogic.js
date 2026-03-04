(function (global) {
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickPrioritizedWord(wordBank, notebookWords) {
    const notebookSet = new Set(notebookWords);
    const notebookPool = wordBank.filter((w) => notebookSet.has(w.word));
    const basePool = notebookPool.length ? notebookPool : wordBank;
    const picked = basePool[Math.floor(Math.random() * basePool.length)];
    return picked;
  }

  function createSynonymQuestion(wordBank, notebookWords = []) {
    const word = pickPrioritizedWord(wordBank, notebookWords);
    const distractors = shuffle(
      wordBank
        .filter((w) => w.word !== word.word)
        .map((w) => w.synonym)
    ).slice(0, 3);
    const choices = shuffle([word.synonym, ...distractors]);
    return {
      type: "synonym",
      prompt: `Choose the best synonym for "${word.word}"`,
      answer: word.synonym,
      word: word.word,
      choices,
      explanation: `"${word.word}" means ${word.definition}.`,
    };
  }

  function createDefinitionQuestion(wordBank, notebookWords = []) {
    const word = pickPrioritizedWord(wordBank, notebookWords);
    const distractors = shuffle(
      wordBank
        .filter((w) => w.word !== word.word)
        .map((w) => w.word)
    ).slice(0, 3);
    const choices = shuffle([word.word, ...distractors]);
    return {
      type: "definition",
      prompt: `Which word matches this definition: "${word.definition}"?`,
      answer: word.word,
      word: word.word,
      choices,
      explanation: `Best match is "${word.word}" (synonym: ${word.synonym}).`,
    };
  }

  function createQuestion(wordBank, notebookWords = []) {
    const mode = Math.random() < 0.5 ? "synonym" : "definition";
    return mode === "synonym"
      ? createSynonymQuestion(wordBank, notebookWords)
      : createDefinitionQuestion(wordBank, notebookWords);
  }

  const api = { createQuestion, createSynonymQuestion, createDefinitionQuestion, pickPrioritizedWord };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SSATVocabLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
