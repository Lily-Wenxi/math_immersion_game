const { getWordBank } = window.SSATVocabData;
const { createQuestion } = window.SSATVocabLogic;

const STORAGE_KEY = "ssatVocabNotebook";
const STATS_KEY = "ssatVocabStats";

const state = {
  words: getWordBank(),
  notebook: [],
  stats: { total: 0, correct: 0 },
  currentQuestion: null,
};

const qCountEl = document.getElementById("qCount");
const correctCountEl = document.getElementById("correctCount");
const accuracyEl = document.getElementById("accuracy");
const notebookCountEl = document.getElementById("notebookCount");
const questionTypeEl = document.getElementById("questionType");
const questionPromptEl = document.getElementById("questionPrompt");
const choiceListEl = document.getElementById("choiceList");
const feedbackEl = document.getElementById("vocabFeedback");
const explainEl = document.getElementById("vocabExplain");
const notebookListEl = document.getElementById("notebookList");

function loadState() {
  const notebookRaw = localStorage.getItem(STORAGE_KEY);
  const statsRaw = localStorage.getItem(STATS_KEY);
  if (notebookRaw) {
    try {
      state.notebook = JSON.parse(notebookRaw);
    } catch {
      state.notebook = [];
    }
  }
  if (statsRaw) {
    try {
      state.stats = JSON.parse(statsRaw);
    } catch {
      state.stats = { total: 0, correct: 0 };
    }
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notebook));
  localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
}

function renderStats() {
  qCountEl.textContent = state.stats.total;
  correctCountEl.textContent = state.stats.correct;
  const acc = state.stats.total ? Math.round((state.stats.correct / state.stats.total) * 100) : 0;
  accuracyEl.textContent = `${acc}%`;
  notebookCountEl.textContent = state.notebook.length;
}

function renderNotebook() {
  notebookListEl.innerHTML = "";
  if (state.notebook.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Notebook is empty. Great job!";
    notebookListEl.appendChild(li);
    return;
  }

  state.notebook.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.word}</strong> — ${entry.definition} (synonym: ${entry.synonym}) · wrong ${entry.wrongCount}x`;
    notebookListEl.appendChild(li);
  });
}

function addWrongWord(word) {
  const found = state.notebook.find((item) => item.word === word.word);
  if (found) {
    found.wrongCount += 1;
  } else {
    state.notebook.unshift({ ...word, wrongCount: 1 });
  }
}

function newQuestion() {
  state.currentQuestion = createQuestion(state.words, state.notebook.map((n) => n.word));
  questionTypeEl.textContent =
    state.currentQuestion.type === "synonym" ? "Synonym Multiple Choice" : "Definition Multiple Choice";
  questionPromptEl.textContent = state.currentQuestion.prompt;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  explainEl.textContent = "";
  choiceListEl.innerHTML = "";

  state.currentQuestion.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.addEventListener("click", () => submitAnswer(choice));
    choiceListEl.appendChild(btn);
  });
}

function submitAnswer(choice) {
  if (!state.currentQuestion) return;
  state.stats.total += 1;

  if (choice === state.currentQuestion.answer) {
    state.stats.correct += 1;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = "feedback good";
  } else {
    feedbackEl.textContent = `❌ Not yet. Correct answer: ${state.currentQuestion.answer}`;
    feedbackEl.className = "feedback bad";
    const wrongWord = state.words.find((w) => w.word === state.currentQuestion.word);
    if (wrongWord) addWrongWord(wrongWord);
  }

  explainEl.textContent = state.currentQuestion.explanation;
  saveState();
  renderStats();
  renderNotebook();
}

document.getElementById("nextQuestion").addEventListener("click", newQuestion);
document.getElementById("clearNotebook").addEventListener("click", () => {
  state.notebook = [];
  saveState();
  renderStats();
  renderNotebook();
});

loadState();
renderStats();
renderNotebook();
newQuestion();
