(function (global) {
  function normalizeAnswer(value) {
    return String(value ?? "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function parseFractionOrNumber(value) {
    const normalized = normalizeAnswer(value);
    if (!normalized) return null;

    if (normalized.includes("/")) {
      const parts = normalized.split("/");
      if (parts.length !== 2) return null;
      const numerator = Number(parts[0]);
      const denominator = Number(parts[1]);
      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
        return null;
      }
      return numerator / denominator;
    }

    const normalizedDecimal = normalized.replace("，", ".");
    const numeric = Number(normalizedDecimal);
    return Number.isFinite(numeric) ? numeric : null;
  }

  function isAnswerCorrect(userInput, acceptedAnswers) {
    const normalizedInput = normalizeAnswer(userInput);
    if (!normalizedInput || !Array.isArray(acceptedAnswers) || acceptedAnswers.length === 0) {
      return false;
    }

    const directMatch = acceptedAnswers.some(
      (answer) => normalizeAnswer(answer) === normalizedInput
    );
    if (directMatch) return true;

    const userNumber = parseFractionOrNumber(userInput);
    if (userNumber === null) return false;

    return acceptedAnswers.some((answer) => {
      const target = parseFractionOrNumber(answer);
      return target !== null && Math.abs(target - userNumber) < 1e-9;
    });
  }

  const api = {
    normalizeAnswer,
    parseFractionOrNumber,
    isAnswerCorrect,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  global.GameLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
