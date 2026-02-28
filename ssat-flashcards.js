const { getWordBank } = window.SSATVocabData;
const { getDeck } = window.SSATFlashcardDeck || { getDeck: null };
const { getTodayKey, buildDailyDeck, normalizeWord, claimDailyReward } = window.SSATFlashcardLogic;

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
const reviewListEl = document.getElementById("reviewList");
const checkinMsgEl = document.getElementById("checkinMsg");
const claimRewardEl = document.getElementById("claimReward");

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

document.getElementById("flipCard").addEventListener("click", () => {
  if (!flashCardEl) return;
  flashCardEl.classList.toggle("flipped");
});

loadState();
renderStats();
renderReviewList();
renderCard();
