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
const bankCountEl = document.getElementById("bankCount");
const questionTypeEl = document.getElementById("questionType");
const questionPromptEl = document.getElementById("questionPrompt");
const choiceListEl = document.getElementById("choiceList");
const feedbackEl = document.getElementById("vocabFeedback");
const explainEl = document.getElementById("vocabExplain");
const notebookListEl = document.getElementById("notebookList");
const wordImageEl = document.getElementById("wordImage");
const wordImageCaptionEl = document.getElementById("wordImageCaption");


const IMAGE_HINTS = [
  { keys: ["dry", "arid", "scarce"], icon: "🏜️" },
  { keys: ["happy", "joy", "elated"], icon: "😄" },
  { keys: ["calm", "tranquil"], icon: "🌊" },
  { keys: ["strong", "robust", "endure"], icon: "💪" },
  { keys: ["light", "bright", "vivid", "illuminate"], icon: "💡" },
  { keys: ["friend", "amiable", "convivial", "kind"], icon: "🤝" },
  { keys: ["study", "analyze", "scrutinize", "inspect"], icon: "🔎" },
  { keys: ["grow", "thrive", "expand"], icon: "🌱" },
  { keys: ["speed", "brisk", "expedite"], icon: "⚡" },
  { keys: ["mystery", "enigmatic", "obscure"], icon: "🧩" },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pickImageIcon(question) {
  const text = `${question.word} ${question.explanation}`.toLowerCase();
  const hit = IMAGE_HINTS.find((item) => item.keys.some((k) => text.includes(k)));
  return hit ? hit.icon : "🧠";
}

function renderWordImage(question) {
  if (!wordImageEl || !wordImageCaptionEl) return;
  const icon = pickImageIcon(question);
  const line1 = question.word;
  const line2 = question.type === "synonym" ? `Think: ${question.answer}` : "Match the definition";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='260' viewBox='0 0 720 260'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f8e9ff'/>
        <stop offset='100%' stop-color='#e8f2ff'/>
      </linearGradient>
    </defs>
    <rect x='0' y='0' width='720' height='260' rx='24' fill='url(#g)'/>
    <text x='42' y='105' font-size='70'>${icon}</text>
    <text x='140' y='95' font-size='44' font-family='Nunito,Segoe UI,sans-serif' fill='#2c2f55' font-weight='700'>${escapeXml(line1)}</text>
    <text x='140' y='145' font-size='28' font-family='Nunito,Segoe UI,sans-serif' fill='#4d5a8b'>${escapeXml(line2)}</text>
  </svg>`;
  wordImageEl.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  wordImageCaptionEl.textContent = `Visual memory hint for “${question.word}”.`;
}

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
  bankCountEl.textContent = state.words.length;
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

  renderWordImage(state.currentQuestion);

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
