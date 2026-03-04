const { getWordBank } = window.SSATVocabData;
const { getDeck } = window.SSATFlashcardDeck || { getDeck: null };
const { getTodayKey, buildDailyDeck, normalizeWord, claimDailyReward, getWordImageCandidates } = window.SSATFlashcardLogic;
const Auth = window.Auth;

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
const flashTagsEl = document.getElementById("flashTags");
const flashImageWrapEl = document.getElementById("flashImageWrap");
const flashImageEl = document.getElementById("flashImage");
const flashImageCaptionEl = document.getElementById("flashImageCaption");
const reviewListEl = document.getElementById("reviewList");
const checkinMsgEl = document.getElementById("checkinMsg");
const claimRewardEl = document.getElementById("claimReward");
const accountEntryLinkEl = document.getElementById("accountEntryLink");

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


function renderAccountEntry() {
  if (!accountEntryLinkEl) return;
  const currentUser = Auth && typeof Auth.getCurrentUser === "function" ? Auth.getCurrentUser() : null;
  if (currentUser && currentUser.username) {
    accountEntryLinkEl.textContent = `Hi, ${currentUser.username}`;
    accountEntryLinkEl.href = "auth.html";
    return;
  }
  accountEntryLinkEl.textContent = "Account Login / Register →";
  accountEntryLinkEl.href = "auth.html";
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


function hideWordImage() {
  if (flashImageWrapEl) flashImageWrapEl.classList.add("hidden");
  if (flashImageEl) {
    flashImageEl.removeAttribute("src");
    flashImageEl.onerror = null;
    flashImageEl.onload = null;
    flashImageEl.style.width = "";
    flashImageEl.style.height = "";
  }
  if (flashImageCaptionEl) flashImageCaptionEl.textContent = "";
}

function showWordImage(word) {
  if (!flashImageWrapEl || !flashImageEl) return;

  const candidates = getWordImageCandidates(word);
  if (!candidates.length) {
    hideWordImage();
    return;
  }

  let idx = 0;
  const tryNext = () => {
    if (idx >= candidates.length) {
      hideWordImage();
      return;
    }
    flashImageEl.onerror = () => {
      idx += 1;
      tryNext();
    };
    flashImageEl.onload = () => {
      const halfWidth = Math.max(1, Math.round(flashImageEl.naturalWidth / 2));
      const halfHeight = Math.max(1, Math.round(flashImageEl.naturalHeight / 2));
      flashImageEl.style.width = `${halfWidth}px`;
      flashImageEl.style.height = `${halfHeight}px`;
    };
    flashImageEl.src = candidates[idx];
  };

  flashImageEl.onerror = null;
  flashImageEl.onload = null;
  tryNext();
  flashImageWrapEl.classList.remove("hidden");
  if (flashImageCaptionEl) flashImageCaptionEl.textContent = `Image: ${word}`;
}

function renderCard() {
  const card = state.deck[state.index];
  if (!card) return;
  if (flashCardEl) flashCardEl.classList.remove("flipped");
  hideWordImage();
  if (flashTagsEl) flashTagsEl.classList.add("hidden");

  flashWordEl.textContent = card.word;
  if (flashWordBackEl) flashWordBackEl.textContent = card.word;
  flashMeaningEl.textContent = `Meaning: ${card.definition}`;
  flashUsageEl.textContent = `Usage: ${card.usage}`;
  flashSynonymEl.textContent = card.synonym;
  flashAntonymEl.textContent = card.antonym;

  const reviewedDone = getReviewedCount() >= state.deck.length;
  const claimed = !!state.claimedDays[state.todayKey];
  if (claimRewardEl) claimRewardEl.classList.add("hidden");
  if (claimed && !checkinMsgEl.textContent) {
    checkinMsgEl.textContent = "Daily check-in already completed. Come back tomorrow for new 20 words.";
    checkinMsgEl.className = "feedback good";
  } else if (!reviewedDone && !claimed) {
    checkinMsgEl.textContent = "";
    checkinMsgEl.className = "feedback";
  }
}


function requireFlashTrial() {
  if (!Auth || Auth.isLoggedIn()) return true;
  const result = Auth.consumeGuestTrial("flash", 3);
  if (!result.ok) {
    checkinMsgEl.innerHTML = 'Trial finished: new users can review up to 3 flash cards for free. <a href="auth.html">Register / Login</a>';
    checkinMsgEl.className = "feedback bad";
    return false;
  }
  return true;
}


function autoClaimDailyCheckin() {
  const reviewedDone = getReviewedCount() >= state.deck.length;
  const claimed = !!state.claimedDays[state.todayKey];
  if (!reviewedDone || claimed) return;

  const result = claimDailyReward(state.accountPoints, false, 1);
  if (!result.ok) return;

  state.accountPoints = result.points;
  state.claimedDays[state.todayKey] = true;
  checkinMsgEl.textContent = "Daily check-in complete! +1 point added automatically.";
  checkinMsgEl.className = "feedback good";
}

function markCard(needsReview) {
  if (!requireFlashTrial()) return;
  const card = state.deck[state.index];
  if (!card) return;
  if (flashCardEl) flashCardEl.classList.remove("flipped");
  state.reviewed[card.word] = true;

  if (needsReview && !state.reviewWords.includes(card.word)) {
    state.reviewWords.unshift(card.word);
  }

  if (state.index < state.deck.length - 1) state.index += 1;
  autoClaimDailyCheckin();
  saveState();
  renderStats();
  renderReviewList();
  renderCard();
}


function canAdvanceFlashCard() {
  if (!Auth || Auth.isLoggedIn()) return true;
  if (state.index >= 2) {
    checkinMsgEl.innerHTML = 'Trial finished: guests can preview up to 3 flash cards. <a href="auth.html">Register / Login</a>';
    checkinMsgEl.className = "feedback bad";
    return false;
  }
  return true;
}

function claimReward() {
  const result = claimDailyReward(state.accountPoints, !!state.claimedDays[state.todayKey], 1);
  checkinMsgEl.textContent = result.message;
  checkinMsgEl.className = result.ok ? "feedback good" : "feedback bad";
  if (result.ok) {
    state.accountPoints = result.points;
    state.claimedDays[state.todayKey] = true;
    if (claimRewardEl) claimRewardEl.classList.add("hidden");
    saveState();
    renderStats();
  }
}

document.getElementById("knowBtn").addEventListener("click", () => markCard(false));
document.getElementById("reviewBtn").addEventListener("click", () => markCard(true));
document.getElementById("prevCard").addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    saveState();
    renderCard();
  }
});
document.getElementById("nextCard").addEventListener("click", () => {
  if (!canAdvanceFlashCard()) return;
  if (state.index < state.deck.length - 1) {
    state.index += 1;
    saveState();
    renderCard();
  }
});
if (claimRewardEl) claimRewardEl.addEventListener("click", claimReward);

document.getElementById("flipCard").addEventListener("click", () => {
  if (!flashCardEl) return;
  flashCardEl.classList.toggle("flipped");
  const card = state.deck[state.index];
  if (!card) return;

  if (flashCardEl.classList.contains("flipped")) {
    showWordImage(card.word);
    if (flashTagsEl) flashTagsEl.classList.remove("hidden");
  } else {
    hideWordImage();
    if (flashTagsEl) flashTagsEl.classList.add("hidden");
  }
});

loadState();
renderAccountEntry();
renderStats();
renderReviewList();
renderCard();
