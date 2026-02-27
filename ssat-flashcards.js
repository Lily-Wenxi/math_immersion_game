const { getWordBank } = window.SSATVocabData;
const { getDeck } = window.SSATFlashcardDeck || { getDeck: null };
const { getTodayKey, buildDailyDeck, normalizeWord, claimDailyReward, getComicScene } = window.SSATFlashcardLogic;

const FLASHCARD_KEY = "ssatFlashcardDaily";
const ACCOUNT_KEY = "ssatAccountPoints";

const state = {
  todayKey: getTodayKey(),
  accountPoints: 0,
  deck: [],
  index: 0,
  reviewed: {},
  reviewWords: [],
  claimedDays: {},
  mode: "classic",
};

const todayKeyEl = document.getElementById("todayKey");
const reviewedCountEl = document.getElementById("reviewedCount");
const accountPointsEl = document.getElementById("accountPoints");
const flashWordEl = document.getElementById("flashWord");
const flashCardEl = document.getElementById("flashCard");
const flashWordBackEl = document.getElementById("flashWordBack");
const flashMeaningEl = document.getElementById("flashMeaning");
const flashUsageEl = document.getElementById("flashUsage");
const flashSynonymEl = document.getElementById("flashSynonym");
const flashAntonymEl = document.getElementById("flashAntonym");
const comicStripEl = document.getElementById("comicStrip");
const comicArtEl = document.getElementById("comicArt");
const mwLinkEl = document.getElementById("mwLink");
const reviewListEl = document.getElementById("reviewList");
const checkinMsgEl = document.getElementById("checkinMsg");
const claimRewardEl = document.getElementById("claimReward");
const studyModeClassicEl = document.getElementById("studyModeClassic");
const studyModeComicEl = document.getElementById("studyModeComic");

function loadState() {
  const account = Number(localStorage.getItem(ACCOUNT_KEY) || 0);
  state.accountPoints = Number.isFinite(account) ? account : 0;

  try {
    const raw = JSON.parse(localStorage.getItem(FLASHCARD_KEY) || "{}");
    state.claimedDays = raw.claimedDays || {};
    if (raw.dayKey === state.todayKey) {
      state.reviewed = raw.reviewed || {};
      state.index = raw.index || 0;
      state.reviewWords = raw.reviewWords || [];
    }
  } catch {
    state.claimedDays = {};
  }

  const sourceDeck = typeof getDeck === "function" ? getDeck() : getWordBank();
  const wordBank = sourceDeck.map((w) => normalizeWord(w));
  state.deck = buildDailyDeck(wordBank, state.todayKey, 20);
  if (state.index >= state.deck.length) state.index = state.deck.length - 1;
  if (state.index < 0) state.index = 0;
}

function saveState() {
  localStorage.setItem(ACCOUNT_KEY, String(state.accountPoints));
  localStorage.setItem(
    FLASHCARD_KEY,
    JSON.stringify({
      dayKey: state.todayKey,
      index: state.index,
      reviewed: state.reviewed,
      reviewWords: state.reviewWords,
      claimedDays: state.claimedDays,
    })
  );
}

function getReviewedCount() {
  return Object.keys(state.reviewed).length;
}

function renderStats() {
  todayKeyEl.textContent = state.todayKey;
  reviewedCountEl.textContent = getReviewedCount();
  accountPointsEl.textContent = state.accountPoints;
}

function renderReviewList() {
  reviewListEl.innerHTML = "";
  if (!state.reviewWords.length) {
    const li = document.createElement("li");
    li.textContent = "No extra review words yet. Great memory!";
    reviewListEl.appendChild(li);
    return;
  }

  state.reviewWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    reviewListEl.appendChild(li);
  });
}


function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderComicArt(card) {
  if (!comicArtEl) return;
  const p1 = escapeXml(card.comicPanels[0] || "");
  const p2 = escapeXml(card.comicPanels[1] || "");
  const p3 = escapeXml(card.comicPanels[2] || "");
  const scene = typeof getComicScene === "function" ? getComicScene(card) : { bg: "#f4f7ff", mood: "neutral", emoji: "🧠", prop: "💬" };
  const eye = scene.mood === "happy" ? "◕" : scene.mood === "tense" ? "•" : "◔";
  const mouth = scene.mood === "happy" ? "◡" : scene.mood === "tense" ? "︿" : "—";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='300' viewBox='0 0 1000 300'>
    <rect x='0' y='0' width='1000' height='300' rx='20' fill='${scene.bg}'/>
    <text x='20' y='28' font-size='22'>${scene.emoji}</text>
    <text x='960' y='28' font-size='22'>${scene.prop}</text>
    <rect x='16' y='16' width='310' height='268' rx='12' fill='#fff'/><rect x='344' y='16' width='310' height='268' rx='12' fill='#fff'/><rect x='672' y='16' width='312' height='268' rx='12' fill='#fff'/>
    <circle cx='70' cy='170' r='26' fill='#ffd9b3'/><text x='58' y='176' font-size='16'>${eye}${eye}</text><text x='64' y='190' font-size='16'>${mouth}</text><rect x='54' y='198' width='32' height='56' rx='8' fill='#91b6ff'/>
    <circle cx='400' cy='170' r='26' fill='#ffd9b3'/><text x='388' y='176' font-size='16'>${eye}${eye}</text><text x='394' y='190' font-size='16'>${mouth}</text><rect x='384' y='198' width='32' height='56' rx='8' fill='#90d7b4'/>
    <circle cx='728' cy='170' r='26' fill='#ffd9b3'/><text x='716' y='176' font-size='16'>${eye}${eye}</text><text x='722' y='190' font-size='16'>${mouth}</text><rect x='712' y='198' width='32' height='56' rx='8' fill='#ffb4cb'/>
    <rect x='110' y='42' width='196' height='84' rx='12' fill='#eef3ff'/><text x='120' y='68' font-size='16' font-family='Arial' fill='#2d3768'>${p1}</text>
    <rect x='438' y='42' width='196' height='84' rx='12' fill='#eef3ff'/><text x='448' y='68' font-size='16' font-family='Arial' fill='#2d3768'>${p2}</text>
    <rect x='766' y='42' width='196' height='84' rx='12' fill='#eef3ff'/><text x='776' y='68' font-size='16' font-family='Arial' fill='#2d3768'>${p3}</text>
  </svg>`;
  comicArtEl.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


function renderModeUI() {
  const isComic = state.mode === "comic";
  if (studyModeClassicEl) studyModeClassicEl.classList.toggle("active-mode", !isComic);
  if (studyModeComicEl) studyModeComicEl.classList.toggle("active-mode", isComic);
  if (comicArtEl) comicArtEl.classList.toggle("hidden", !isComic);
  if (comicStripEl) comicStripEl.classList.toggle("hidden", !isComic);
}

function renderCard() {
  const card = state.deck[state.index];
  if (!card) return;
  if (flashCardEl) flashCardEl.classList.remove("flipped");

  flashWordEl.textContent = card.word;
  if (flashWordBackEl) flashWordBackEl.textContent = card.word;
  flashMeaningEl.textContent = `Meaning: ${card.definition}`;
  flashUsageEl.textContent = `Usage: ${card.usage}`;
  flashSynonymEl.textContent = card.synonym;
  flashAntonymEl.textContent = card.antonym;
  comicStripEl.innerHTML = "";
  if (mwLinkEl) mwLinkEl.href = card.dictionaryUrl || `https://www.merriam-webster.com/dictionary/${encodeURIComponent(card.word)}`;
  renderComicArt(card);

  card.comicPanels.forEach((panel, idx) => {
    const div = document.createElement("div");
    div.className = "comic-panel";
    div.innerHTML = `<strong>Panel ${idx + 1}</strong><p>${panel}</p>`;
    comicStripEl.appendChild(div);
  });

  renderModeUI();

  const reviewedDone = getReviewedCount() >= state.deck.length;
  const claimed = !!state.claimedDays[state.todayKey];
  claimRewardEl.classList.toggle("hidden", !(reviewedDone && !claimed));
  if (claimed) {
    checkinMsgEl.textContent = "Daily check-in already completed. Come back tomorrow for new 20 words.";
    checkinMsgEl.className = "feedback good";
  }
}

function markCard(needsReview) {
  const card = state.deck[state.index];
  if (!card) return;
  if (flashCardEl) flashCardEl.classList.remove("flipped");
  state.reviewed[card.word] = true;

  if (needsReview && !state.reviewWords.includes(card.word)) {
    state.reviewWords.unshift(card.word);
  }

  if (state.index < state.deck.length - 1) state.index += 1;
  saveState();
  renderStats();
  renderReviewList();
  renderCard();
}

function claimReward() {
  const result = claimDailyReward(state.accountPoints, !!state.claimedDays[state.todayKey], 40);
  checkinMsgEl.textContent = result.message;
  checkinMsgEl.className = result.ok ? "feedback good" : "feedback bad";
  if (result.ok) {
    state.accountPoints = result.points;
    state.claimedDays[state.todayKey] = true;
    claimRewardEl.classList.add("hidden");
    saveState();
    renderStats();
  }
}

document.getElementById("knowBtn").addEventListener("click", () => markCard(false));
document.getElementById("reviewBtn").addEventListener("click", () => markCard(true));
document.getElementById("nextCard").addEventListener("click", () => {
  if (state.index < state.deck.length - 1) {
    state.index += 1;
    saveState();
    renderCard();
  }
});
claimRewardEl.addEventListener("click", claimReward);
studyModeClassicEl.addEventListener("click", () => {
  state.mode = "classic";
  renderModeUI();
});
studyModeComicEl.addEventListener("click", () => {
  state.mode = "comic";
  renderModeUI();
});

document.getElementById("flipCard").addEventListener("click", () => {
  if (!flashCardEl) return;
  flashCardEl.classList.toggle("flipped");
});

loadState();
renderStats();
renderReviewList();
renderModeUI();
renderCard();
