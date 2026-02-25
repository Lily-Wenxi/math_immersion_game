const STORAGE_KEY = "mathImmersionGrade7";

const levels = [
  {
    id: 1,
    title: "关卡 1：比例烘焙站",
    story:
      "你在学校义卖做松饼。基础配方是面粉:牛奶 = 3:2。现在用了 12 杯面粉，需要多少杯牛奶？",
    visualAid: "比例条：面粉 [■■■] 对应 牛奶 [■■]，放大到面粉 12 杯。",
    answer: "8",
    hint: "先求 3 份变成 12 份，放大了几倍？",
    points: 20,
  },
  {
    id: 2,
    title: "关卡 2：分数步道",
    story:
      "探险队走了全程的 3/8，又走了 1/4。请问现在一共走了全程的几分之几？（最简分数）",
    visualAid: "把 1/4 变成与 3/8 同分母，再相加。",
    answer: "5/8",
    hint: "1/4 = 2/8。",
    points: 20,
  },
  {
    id: 3,
    title: "关卡 3：负数温度舱",
    story:
      "实验舱开始时温度是 -3°C，先升高 7°C，再降低 4°C。最终温度是多少？",
    visualAid: "数轴法：从 -3 向右 7 格，再向左 4 格。",
    answer: "0",
    hint: "先算 -3 + 7，再减 4。",
    points: 20,
  },
  {
    id: 4,
    title: "关卡 4：代数钥匙门",
    story:
      "门锁密码满足 2x + 5 = 19。求 x 的值。",
    visualAid: "平衡思想：两边同时减 5，再同时除以 2。",
    answer: "7",
    hint: "先把常数项移走。",
    points: 20,
  },
  {
    id: 5,
    title: "关卡 5：几何能量塔",
    story:
      "一个长方形花园长 9 米，宽 6 米。要沿边围一圈彩灯，需要多少米灯带？",
    visualAid: "周长公式：P = 2 × (长 + 宽)。",
    answer: "30",
    hint: "先算长+宽，再乘 2。",
    points: 30,
  },
];

const state = {
  unlockedLevel: 1,
  score: 0,
  selectedLevel: null,
  completed: [],
};

const scoreEl = document.getElementById("score");
const unlockedEl = document.getElementById("unlocked");
const levelListEl = document.getElementById("levelList");
const levelTitleEl = document.getElementById("levelTitle");
const storyEl = document.getElementById("story");
const visualAidEl = document.getElementById("visualAid");
const answerInputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const hintEl = document.getElementById("hint");

function normalizeAnswer(value) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.unlockedLevel = Math.max(1, parsed.unlockedLevel || 1);
    state.score = parsed.score || 0;
    state.completed = Array.isArray(parsed.completed) ? parsed.completed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      unlockedLevel: state.unlockedLevel,
      score: state.score,
      completed: state.completed,
    })
  );
}

function renderStats() {
  scoreEl.textContent = state.score;
  unlockedEl.textContent = `${state.unlockedLevel}/${levels.length}`;
}

function renderLevels() {
  levelListEl.innerHTML = "";

  levels.forEach((level) => {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    const locked = level.id > state.unlockedLevel;

    if (locked) {
      btn.classList.add("locked");
      btn.disabled = true;
    }

    const done = state.completed.includes(level.id) ? "✅" : "";
    btn.innerHTML = `<strong>${level.title}</strong><br><small>${done} 奖励 ${level.points} 分</small>`;
    btn.addEventListener("click", () => selectLevel(level.id));
    levelListEl.appendChild(btn);
  });
}

function selectLevel(levelId) {
  const level = levels.find((item) => item.id === levelId);
  if (!level || level.id > state.unlockedLevel) return;

  state.selectedLevel = level;
  levelTitleEl.textContent = level.title;
  storyEl.textContent = level.story;
  visualAidEl.textContent = level.visualAid;
  answerInputEl.value = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  hintEl.textContent = "";
}

function submitAnswer() {
  if (!state.selectedLevel) return;

  const userAnswer = normalizeAnswer(answerInputEl.value);
  const expected = normalizeAnswer(state.selectedLevel.answer);

  if (userAnswer === expected) {
    const alreadyCompleted = state.completed.includes(state.selectedLevel.id);

    feedbackEl.textContent = alreadyCompleted
      ? "你之前已经通过该关卡，可以挑战下一关！"
      : `回答正确！+${state.selectedLevel.points} 分`;
    feedbackEl.className = "feedback good";

    if (!alreadyCompleted) {
      state.completed.push(state.selectedLevel.id);
      state.score += state.selectedLevel.points;
      state.unlockedLevel = Math.max(
        state.unlockedLevel,
        Math.min(levels.length, state.selectedLevel.id + 1)
      );
      saveState();
      renderStats();
      renderLevels();
    }
  } else {
    feedbackEl.textContent = "答案还不对，试试提示或重新思考 CPA 三步法。";
    feedbackEl.className = "feedback bad";
  }
}

function showHint() {
  if (!state.selectedLevel) return;
  hintEl.textContent = `提示：${state.selectedLevel.hint}`;
}

function resetProgress() {
  state.unlockedLevel = 1;
  state.score = 0;
  state.selectedLevel = null;
  state.completed = [];
  localStorage.removeItem(STORAGE_KEY);

  renderStats();
  renderLevels();
  levelTitleEl.textContent = "请选择一个关卡";
  storyEl.textContent = "";
  visualAidEl.textContent = "";
  hintEl.textContent = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
}

document.getElementById("submitAnswer").addEventListener("click", submitAnswer);
document.getElementById("hintBtn").addEventListener("click", showHint);
document.getElementById("resetProgress").addEventListener("click", resetProgress);

answerInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitAnswer();
});

loadState();
renderStats();
renderLevels();
selectLevel(1);
