const STORAGE_KEY = "mathImmersionGrade7v2";

const levels = [
  {
    id: 1,
    title: "关卡 1：比与缩放（AMC 风格改编）",
    story:
      "一种果汁配比为果浆:苏打水 = 2:5。要做 42 杯混合饮料，需要多少杯果浆？",
    visualAid: "比例条：总份数 2+5=7，每份 = 42÷7。",
    answers: ["12"],
    hint: "先算每份多少杯，再乘以果浆的 2 份。",
    solution: "总共 7 份，42÷7=6，每份 6 杯，果浆需要 2×6=12 杯。",
    points: 15,
  },
  {
    id: 2,
    title: "关卡 2：分数路径（AMC 风格改编）",
    story:
      "小队先走完全程的 1/3，再走剩余路程的 1/2。此时已走全程的几分之几？",
    visualAid: "先用 1 减去 1/3 得剩余，再取剩余的一半。",
    answers: ["2/3"],
    hint: "第一段后剩 2/3，再走其中一半。",
    solution: "第一段走 1/3，剩 2/3。第二段走 (1/2)×(2/3)=1/3，总共走 1/3+1/3=2/3。",
    points: 15,
  },
  {
    id: 3,
    title: "关卡 3：整数与绝对值（AMC 风格改编）",
    story:
      "若 x=-4，y=3，求 |x-y| + |x+y| 的值。",
    visualAid: "先分别算 x-y 与 x+y，再取绝对值。",
    answers: ["8"],
    hint: "x-y=-7，x+y=-1。",
    solution: "|x-y|=|-7|=7，|x+y|=|-1|=1，和为 8。",
    points: 15,
  },
  {
    id: 4,
    title: "关卡 4：一元一次方程（AMC 风格改编）",
    story: "若 3(x-2)+5=2x+9，求 x。",
    visualAid: "展开括号后把 x 项放一边，常数项放另一边。",
    answers: ["10"],
    hint: "3x-6+5=2x+9。",
    solution: "3x-1=2x+9，所以 x=10。",
    points: 20,
  },
  {
    id: 5,
    title: "关卡 5：几何周长（AMC 风格改编）",
    story:
      "长方形长比宽多 5，且周长是 34。求长和宽分别是多少？答案格式：长,宽",
    visualAid: "设宽为 w，则长为 w+5，用周长公式建立方程。",
    answers: ["11,6", "11，6"],
    hint: "2[(w+5)+w]=34。",
    solution: "2(2w+5)=34=>4w+10=34=>w=6，长=11。",
    points: 20,
  },
  {
    id: 6,
    title: "关卡 6：数论余数（AMC 风格改编）",
    story:
      "一个正整数 n 除以 7 余 3。问 2n+1 除以 7 的余数是多少？",
    visualAid: "把 n 写成 7k+3，代入 2n+1。",
    answers: ["0"],
    hint: "2(7k+3)+1 = 14k+7。",
    solution: "2n+1 = 14k+7 = 7(2k+1)，所以余数是 0。",
    points: 25,
  },
  {
    id: 7,
    title: "关卡 7：计数策略（AMC 风格改编）",
    story:
      "用数字 1,2,3,4 组成两位数（可重复），其中个位大于十位的有多少个？",
    visualAid: "按十位分类计数：十位为 1/2/3/4 时分别有多少选择。",
    answers: ["6"],
    hint: "十位是 1 时个位可选 2,3,4。",
    solution: "十位为1有3种，十位为2有2种，十位为3有1种，十位为4有0种，总计6。",
    points: 30,
  },
];

const state = {
  unlockedLevel: 1,
  score: 0,
  selectedLevel: null,
  completed: [],
  mistakes: [],
};

const scoreEl = document.getElementById("score");
const unlockedEl = document.getElementById("unlocked");
const totalLevelsEl = document.getElementById("totalLevels");
const mistakeCountEl = document.getElementById("mistakeCount");
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

function normalizeAnswer(value) {
  return value.replace(/\s+/g, "").toLowerCase();
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

  const numeric = Number(normalized.replace("，", ","));
  return Number.isFinite(numeric) ? numeric : null;
}

function isAnswerCorrect(userInput, acceptedAnswers) {
  const normalizedInput = normalizeAnswer(userInput);
  if (!normalizedInput) return false;

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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.unlockedLevel = Math.max(1, parsed.unlockedLevel || 1);
    state.score = parsed.score || 0;
    state.completed = Array.isArray(parsed.completed) ? parsed.completed : [];
    state.mistakes = Array.isArray(parsed.mistakes) ? parsed.mistakes : [];
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
      mistakes: state.mistakes,
    })
  );
}

function renderStats() {
  scoreEl.textContent = state.score;
  unlockedEl.textContent = state.unlockedLevel;
  totalLevelsEl.textContent = levels.length;
  mistakeCountEl.textContent = state.mistakes.length;
  const completedRatio = (state.completed.length / levels.length) * 100;
  progressBarEl.style.width = `${Math.max(4, completedRatio)}%`;
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

    if (state.selectedLevel?.id === level.id) {
      btn.classList.add("active");
    }

    const status = state.completed.includes(level.id)
      ? "✅ 已完成"
      : locked
      ? "🔒 未解锁"
      : "🟡 可挑战";

    btn.innerHTML = `<strong>${level.title}</strong><div class="meta">${status} · 奖励 ${level.points} 分</div>`;
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
  solutionEl.textContent = "";
  renderLevels();
}

function addMistake(userAnswer) {
  if (!state.selectedLevel) return;

  state.mistakes.unshift({
    levelId: state.selectedLevel.id,
    title: state.selectedLevel.title,
    wrongAnswer: userAnswer || "(空)",
    expected: state.selectedLevel.answers[0],
    time: new Date().toLocaleString("zh-CN"),
  });

  if (state.mistakes.length > 40) {
    state.mistakes = state.mistakes.slice(0, 40);
  }

  saveState();
  renderStats();
  renderMistakes();
}

function renderMistakes() {
  mistakeListEl.innerHTML = "";

  if (state.mistakes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "暂无错题，继续保持！";
    mistakeListEl.appendChild(li);
    return;
  }

  state.mistakes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `[${item.time}] ${item.title}｜你的答案：${item.wrongAnswer}｜参考答案：${item.expected}`;
    mistakeListEl.appendChild(li);
  });
}

function submitAnswer() {
  if (!state.selectedLevel) return;

  const userAnswer = answerInputEl.value;
  const isCorrect = isAnswerCorrect(userAnswer, state.selectedLevel.answers);

  if (isCorrect) {
    const alreadyCompleted = state.completed.includes(state.selectedLevel.id);

    feedbackEl.textContent = alreadyCompleted
      ? "你之前已经通过该关卡，可以继续冲更高分。"
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
    feedbackEl.textContent = "答案不正确，已加入错题本。建议先看提示再重做。";
    feedbackEl.className = "feedback bad";
    addMistake(userAnswer);
  }
}

function showHint() {
  if (!state.selectedLevel) return;
  hintEl.textContent = `提示：${state.selectedLevel.hint}`;
}

function showSolution() {
  if (!state.selectedLevel) return;
  solutionEl.textContent = `解析：${state.selectedLevel.solution}`;
}

function clearMistakes() {
  state.mistakes = [];
  saveState();
  renderStats();
  renderMistakes();
}

function resetProgress() {
  state.unlockedLevel = 1;
  state.score = 0;
  state.selectedLevel = null;
  state.completed = [];
  state.mistakes = [];
  localStorage.removeItem(STORAGE_KEY);

  renderStats();
  renderLevels();
  renderMistakes();
  levelTitleEl.textContent = "请选择一个关卡";
  storyEl.textContent = "";
  visualAidEl.textContent = "";
  hintEl.textContent = "";
  solutionEl.textContent = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
}

document.getElementById("submitAnswer").addEventListener("click", submitAnswer);
document.getElementById("hintBtn").addEventListener("click", showHint);
document.getElementById("solutionBtn").addEventListener("click", showSolution);
document.getElementById("clearMistakes").addEventListener("click", clearMistakes);
document.getElementById("resetProgress").addEventListener("click", resetProgress);

answerInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitAnswer();
});

loadState();
renderStats();
renderLevels();
renderMistakes();
selectLevel(1);
