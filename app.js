const STORAGE_PREFIX = "mathImmersionGrade";

const { isAnswerCorrect } = window.GameLogic;
const { generateQuestionsByTopic } = window.Reinforcement;
const { getSupportedGrades, getLevelsByGrade } = window.Curriculum;
const { getCatalog, purchaseEquipment } = window.ShopLogic;

const state = {
  currentGrade: 7,
  unlockedLevel: 1,
  score: 0,
  selectedLevel: null,
  completed: [],
  mistakes: [],
  masteredTopics: [],
  reinforcement: null,
  ownedEquipment: [],
};

const shopCatalog = getCatalog();
const equipmentIcons = {
  pencil_plus: "✏️",
  focus_goggles: "🥽",
  fraction_blade: "🗡️",
  algebra_shield: "🛡️",
  geometry_compass: "🧭",
};

const scoreEl = document.getElementById("score");
const unlockedEl = document.getElementById("unlocked");
const totalLevelsEl = document.getElementById("totalLevels");
const mistakeCountEl = document.getElementById("mistakeCount");
const equipmentCountEl = document.getElementById("equipmentCount");
const progressBarEl = document.getElementById("progressBar");
const levelListEl = document.getElementById("levelList");
const levelTitleEl = document.getElementById("levelTitle");
const storyEl = document.getElementById("story");
const visualAidEl = document.getElementById("visualAid");
const answerInputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const hintEl = document.getElementById("hint");
const solutionEl = document.getElementById("solution");
const mistakeListEl = document.getElementById("mistakeList");
const reinforcementBoxEl = document.getElementById("reinforcementBox");
const reinforcementTitleEl = document.getElementById("reinforcementTitle");
const reinforcementListEl = document.getElementById("reinforcementList");
const gradeSelectEl = document.getElementById("gradeSelect");
const levelPanelTitleEl = document.getElementById("levelPanelTitle");
const shopListEl = document.getElementById("shopList");
const inventoryListEl = document.getElementById("inventoryList");
const shopMessageEl = document.getElementById("shopMessage");
<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
const fairySpriteEl = document.getElementById("fairySprite");
=======
const fairyBubbleEl = document.getElementById("fairyBubble");
const fairyTextEl = document.getElementById("fairyText");
>>>>>>> main

function currentLevels() {
  return getLevelsByGrade(state.currentGrade);
}

function storageKey() {
  return `${STORAGE_PREFIX}${state.currentGrade}`;
}

function playTone(freq, duration = 0.16) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.value = 0.001;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

function playCorrectSound() {
  playTone(660, 0.13);
  setTimeout(() => playTone(880, 0.16), 120);
}

function playIncorrectSound() {
  playTone(240, 0.18);
}

<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
function speakFairy(line) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(line);
  utter.rate = 1;
  utter.pitch = 1.25;
  utter.volume = 1;
  const voice = synth.getVoices().find((v) => /en/i.test(v.lang));
  if (voice) utter.voice = voice;
  synth.speak(utter);
}

function triggerFairy(line) {
  if (fairySpriteEl) {
    fairySpriteEl.classList.remove("fly");
    void fairySpriteEl.offsetWidth;
    fairySpriteEl.classList.add("fly");
  }
  speakFairy(line);
=======
function showFairy(line) {
  fairyTextEl.textContent = line;
  fairyBubbleEl.classList.remove("hidden");
}

function hideFairy() {
  fairyTextEl.textContent = "";
  fairyBubbleEl.classList.add("hidden");
>>>>>>> main
}

function resetTransientUI() {
  state.selectedLevel = null;
  state.reinforcement = null;
  levelTitleEl.textContent = "Choose a level";
  storyEl.textContent = "";
  visualAidEl.textContent = "";
  hintEl.textContent = "";
  solutionEl.textContent = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answerInputEl.value = "";
  shopMessageEl.textContent = "";
<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
=======
  hideFairy();
>>>>>>> main
}

function loadState() {
  const raw = localStorage.getItem(storageKey());
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.unlockedLevel = Math.max(1, parsed.unlockedLevel || 1);
    state.score = parsed.score || 0;
    state.completed = Array.isArray(parsed.completed) ? parsed.completed : [];
    state.mistakes = Array.isArray(parsed.mistakes) ? parsed.mistakes : [];
    state.masteredTopics = Array.isArray(parsed.masteredTopics) ? parsed.masteredTopics : [];
    state.ownedEquipment = Array.isArray(parsed.ownedEquipment) ? parsed.ownedEquipment : [];
  } catch {
    localStorage.removeItem(storageKey());
  }
}

function saveState() {
  localStorage.setItem(
    storageKey(),
    JSON.stringify({
      unlockedLevel: state.unlockedLevel,
      score: state.score,
      completed: state.completed,
      mistakes: state.mistakes,
      masteredTopics: state.masteredTopics,
      ownedEquipment: state.ownedEquipment,
    })
  );
}

function renderStats() {
  const levels = currentLevels();
  scoreEl.textContent = state.score;
  unlockedEl.textContent = state.unlockedLevel;
  totalLevelsEl.textContent = levels.length;
  mistakeCountEl.textContent = state.mistakes.length;
  equipmentCountEl.textContent = state.ownedEquipment.length;
  const completedRatio = levels.length ? (state.completed.length / levels.length) * 100 : 0;
  progressBarEl.style.width = `${Math.max(4, completedRatio)}%`;
}

function renderShop() {
  shopListEl.innerHTML = "";
  inventoryListEl.innerHTML = "";

  shopCatalog.forEach((item) => {
    const owned = state.ownedEquipment.includes(item.id);
    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
      <div class="icon" aria-hidden="true">${equipmentIcons[item.id] || "🎒"}</div>
      <h4>${item.name}</h4>
      <p>${item.effect}</p>
      <p class="price">Cost: ${item.cost} pts</p>
      <button ${owned ? "disabled" : ""} data-buy="${item.id}">${owned ? "Owned" : "Buy"}</button>
    `;
    shopListEl.appendChild(card);
  });

  shopListEl.querySelectorAll("button[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const result = purchaseEquipment(state.score, state.ownedEquipment, btn.dataset.buy);
      shopMessageEl.textContent = result.message;
      if (result.ok) {
        state.score = result.score;
        state.ownedEquipment = result.owned;
        saveState();
        renderStats();
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
      renderShop();
    });
  });

  if (state.ownedEquipment.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No equipment yet. Clear levels to earn points and buy gear.";
    inventoryListEl.appendChild(li);
  } else {
    state.ownedEquipment.forEach((id) => {
      const item = shopCatalog.find((it) => it.id === id);
      const li = document.createElement("li");
      li.textContent = `${equipmentIcons[id] || "🎒"} ${item?.name || id} — ${item?.effect || ""}`;
      inventoryListEl.appendChild(li);
    });
  }
}

function renderLevels() {
  levelListEl.innerHTML = "";
  currentLevels().forEach((level) => {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    const locked = level.id > state.unlockedLevel;
    if (locked) {
      btn.classList.add("locked");
      btn.disabled = true;
    }
    if (state.selectedLevel?.id === level.id) btn.classList.add("active");

    const mastered = state.masteredTopics.includes(level.topic) ? "🏅 Mastered" : "";
    const status = state.completed.includes(level.id) ? "✅ Cleared" : locked ? "🔒 Locked" : "🟡 Available";
    btn.innerHTML = `<strong>${level.title}</strong><div class="meta">${status} ${mastered} · Reward ${level.points} pts</div>`;
    btn.addEventListener("click", () => selectLevel(level.id));
    levelListEl.appendChild(btn);
  });
}

function selectLevel(levelId) {
  const level = currentLevels().find((item) => item.id === levelId);
  if (!level || level.id > state.unlockedLevel) return;
  state.selectedLevel = level;
  levelTitleEl.textContent = level.title;
  storyEl.textContent = level.story;
  visualAidEl.textContent = level.visualAid;
  answerInputEl.value = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  hintEl.textContent = "";
  solutionEl.textContent = "";
<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
=======
  hideFairy();
>>>>>>> main
  renderLevels();
}

function addMistake(userAnswer) {
  if (!state.selectedLevel) return;
  state.mistakes.unshift({
    levelId: state.selectedLevel.id,
    topic: state.selectedLevel.topic,
    title: state.selectedLevel.title,
    wrongAnswer: userAnswer || "(empty)",
    expected: state.selectedLevel.answers[0],
    time: new Date().toLocaleString(),
  });
  if (state.mistakes.length > 40) state.mistakes = state.mistakes.slice(0, 40);
  saveState();
  renderStats();
  renderMistakes();
}

function startReinforcement(topic, title) {
  state.reinforcement = { topic, title, questions: generateQuestionsByTopic(topic, 3), solved: {}, shown: {} };
  renderReinforcement();
}

function renderMistakes() {
  mistakeListEl.innerHTML = "";
  if (state.mistakes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No mistakes yet. Keep going!";
    mistakeListEl.appendChild(li);
    return;
  }

  state.mistakes.forEach((item) => {
    const li = document.createElement("li");
    const mastered = state.masteredTopics.includes(item.topic) ? "🏅 Topic mastered" : "";
    li.innerHTML = `[${item.time}] ${item.title} | Your answer: ${item.wrongAnswer} | Correct answer: ${item.expected}
      <div class="mistake-actions">
        <button class="secondary mini reinforce-btn" data-topic="${item.topic}" data-title="${item.title}">Generate 3 same-topic drills</button>
        <span class="muted">${mastered}</span>
      </div>`;
    mistakeListEl.appendChild(li);
  });

  document.querySelectorAll(".reinforce-btn").forEach((btn) => {
    btn.addEventListener("click", () => startReinforcement(btn.dataset.topic, btn.dataset.title));
  });
}

function renderReinforcement() {
  reinforcementListEl.innerHTML = "";
  if (!state.reinforcement) {
    reinforcementBoxEl.classList.add("hidden");
    return;
  }

  reinforcementBoxEl.classList.remove("hidden");
  reinforcementTitleEl.textContent = `Reinforcement: ${state.reinforcement.title}`;

  state.reinforcement.questions.forEach((question, index) => {
    const wrap = document.createElement("li");
    const solved = state.reinforcement.solved[question.id] === true;
    const shown = state.reinforcement.shown[question.id] === true;
    wrap.innerHTML = `<p><strong>Q${index + 1}:</strong> ${question.prompt}</p>
      <input type="text" id="re-answer-${question.id}" placeholder="Type your answer" />
      <button class="mini" data-check="${question.id}">Check</button>
      <button class="secondary mini" data-show="${question.id}">Show solution</button>
      <p id="re-feedback-${question.id}" class="feedback ${solved ? "good" : ""}">${solved ? "Correct ✅" : ""}</p>
      <p class="hint">${shown ? `Solution: ${question.solution}` : ""}</p>`;
    reinforcementListEl.appendChild(wrap);
  });

  const solvedCount = Object.values(state.reinforcement.solved).filter(Boolean).length;
  const tip = document.createElement("li");
  tip.className = "muted";
  tip.textContent = `Progress: ${solvedCount}/3. Finish all to mark this topic as mastered.`;
  reinforcementListEl.appendChild(tip);

  reinforcementListEl.querySelectorAll("button[data-check]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const question = state.reinforcement.questions.find((q) => q.id === btn.dataset.check);
      if (!question) return;
      const input = document.getElementById(`re-answer-${btn.dataset.check}`);
      const feedback = document.getElementById(`re-feedback-${btn.dataset.check}`);
      const ok = isAnswerCorrect(input.value, question.answers);
      if (ok) {
        state.reinforcement.solved[btn.dataset.check] = true;
        feedback.textContent = "Correct ✅";
        feedback.className = "feedback good";
        playCorrectSound();
      } else {
        feedback.textContent = `Not yet. Hint: ${question.hint}`;
        feedback.className = "feedback bad";
        playIncorrectSound();
      }

      const allSolved = state.reinforcement.questions.every((q) => state.reinforcement.solved[q.id]);
      if (allSolved && !state.masteredTopics.includes(state.reinforcement.topic)) {
        state.masteredTopics.push(state.reinforcement.topic);
        saveState();
        renderLevels();
        renderMistakes();
      }
      renderReinforcement();
    });
  });

  reinforcementListEl.querySelectorAll("button[data-show]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.reinforcement.shown[btn.dataset.show] = true;
      renderReinforcement();
    });
  });
}

function submitAnswer() {
  if (!state.selectedLevel) return;
  const correct = isAnswerCorrect(answerInputEl.value, state.selectedLevel.answers);

  if (correct) {
    const alreadyCompleted = state.completed.includes(state.selectedLevel.id);
    feedbackEl.textContent = alreadyCompleted
      ? "🎉 Correct! You already cleared this level — keep the streak!"
      : `🎉 Correct! +${state.selectedLevel.points} pts`;
    feedbackEl.className = "feedback good";
<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
    triggerFairy("Congratulations!");
=======
    showFairy("✨ Fairy appears: Congratulations, brilliant answer! ✨");
>>>>>>> main
    playCorrectSound();

    if (!alreadyCompleted) {
      const levels = currentLevels();
      state.completed.push(state.selectedLevel.id);
      state.score += state.selectedLevel.points;
      state.unlockedLevel = Math.max(state.unlockedLevel, Math.min(levels.length, state.selectedLevel.id + 1));
      saveState();
      renderStats();
      renderLevels();
      renderShop();
    }
  } else {
    feedbackEl.textContent = "Not quite yet. Added to Mistake Book for targeted practice.";
    feedbackEl.className = "feedback bad";
<<<<<<< codex/develop-math-immersion-game-for-seventh-grade-hhj1ih
    triggerFairy("keep going~!");
=======
    showFairy("🧚 Fairy appears: Keep going~! You are getting closer!");
>>>>>>> main
    playIncorrectSound();
    addMistake(answerInputEl.value);
  }
}

function showHint() {
  if (!state.selectedLevel) return;
  hintEl.textContent = `Hint: ${state.selectedLevel.hint}`;
}

function showSolution() {
  if (!state.selectedLevel) return;
  solutionEl.textContent = `Solution: ${state.selectedLevel.solution}`;
}

function clearMistakes() {
  state.mistakes = [];
  state.reinforcement = null;
  saveState();
  renderStats();
  renderMistakes();
  renderReinforcement();
}

function resetProgress() {
  state.unlockedLevel = 1;
  state.score = 0;
  state.completed = [];
  state.mistakes = [];
  state.masteredTopics = [];
  state.ownedEquipment = [];
  localStorage.removeItem(storageKey());
  resetTransientUI();
  renderStats();
  renderLevels();
  renderMistakes();
  renderReinforcement();
  renderShop();
}

function switchGrade(grade) {
  state.currentGrade = grade;
  levelPanelTitleEl.textContent = `Levels (Grade ${grade})`;
  state.unlockedLevel = 1;
  state.score = 0;
  state.completed = [];
  state.mistakes = [];
  state.masteredTopics = [];
  state.ownedEquipment = [];
  loadState();
  resetTransientUI();
  renderStats();
  renderLevels();
  renderMistakes();
  renderReinforcement();
  renderShop();
  selectLevel(1);
}

function initGradeSelector() {
  levelPanelTitleEl.textContent = `Levels (Grade ${state.currentGrade})`;
  gradeSelectEl.innerHTML = "";
  getSupportedGrades().forEach((grade) => {
    const option = document.createElement("option");
    option.value = String(grade);
    option.textContent = `Grade ${grade}`;
    if (grade === state.currentGrade) option.selected = true;
    gradeSelectEl.appendChild(option);
  });
  gradeSelectEl.addEventListener("change", (event) => switchGrade(Number(event.target.value)));
}

document.getElementById("submitAnswer").addEventListener("click", submitAnswer);
document.getElementById("hintBtn").addEventListener("click", showHint);
document.getElementById("solutionBtn").addEventListener("click", showSolution);
document.getElementById("clearMistakes").addEventListener("click", clearMistakes);
document.getElementById("resetProgress").addEventListener("click", resetProgress);
answerInputEl.addEventListener("keydown", (event) => { if (event.key === "Enter") submitAnswer(); });

initGradeSelector();
loadState();
renderStats();
renderLevels();
renderMistakes();
renderReinforcement();
renderShop();
selectLevel(1);
