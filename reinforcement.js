(function (global) {
  const topicTemplates = {
    ratio: [
      { prompt: "A juice mix ratio is syrup:water = 1:4. If total is 25 cups, how many cups of syrup are needed?", answers: ["5"], hint: "Total parts is 5.", solution: "25÷5=5, syrup is 1 part so 5 cups." },
      { prompt: "In ratio 3:7, if the first term is 12, what is the second term?", answers: ["28"], hint: "3 scaled to 12 means ×4.", solution: "7×4=28." },
      { prompt: "a:b=2:3 and a+b=25. Find a.", answers: ["10"], hint: "Total parts = 5.", solution: "Each part is 5, so a=2×5=10." },
    ],
    fraction: [
      { prompt: "A route is covered by first walking 1/4 then 1/2 of the whole. What fraction of the whole is covered?", answers: ["3/4"], hint: "Use common denominator.", solution: "1/4+1/2=1/4+2/4=3/4." },
      { prompt: "Remaining distance is 3/5. You walk 1/3 of the remaining. What fraction of the whole did you walk?", answers: ["1/5"], hint: "Multiply fractions.", solution: "(1/3)×(3/5)=1/5." },
      { prompt: "Compute 1 - 2/7 (simplest fraction).", answers: ["5/7"], hint: "Write 1 as 7/7.", solution: "7/7-2/7=5/7." },
    ],
    integer_abs: [
      { prompt: "If x=-6, find |x+2|.", answers: ["4"], hint: "Compute inside absolute first.", solution: "x+2=-4, so |x+2|=4." },
      { prompt: "Compute |-8| + |3|.", answers: ["11"], hint: "Absolute value is distance from 0.", solution: "8+3=11." },
      { prompt: "If a=-2 and b=5, find |a-b|.", answers: ["7"], hint: "Find a-b first.", solution: "a-b=-7, so |a-b|=7." },
    ],
    equation: [
      { prompt: "Solve 2x+3=13.", answers: ["5"], hint: "Subtract 3 then divide by 2.", solution: "2x=10 so x=5." },
      { prompt: "Solve 4(x-1)=20.", answers: ["6"], hint: "Divide by 4 first.", solution: "x-1=5 so x=6." },
      { prompt: "Solve 3x-7=11.", answers: ["6"], hint: "Add 7 first.", solution: "3x=18 so x=6." },
    ],
    geometry: [
      { prompt: "A rectangle has length 8 and width 5. What is the perimeter?", answers: ["26"], hint: "P=2(l+w).", solution: "2×(8+5)=26." },
      { prompt: "A square has side length 7. What is the perimeter?", answers: ["28"], hint: "4×side.", solution: "4×7=28." },
      { prompt: "A rectangle has perimeter 30 and length 9. What is the width?", answers: ["6"], hint: "l+w=15.", solution: "30÷2=15, width=15-9=6." },
    ],
    remainder: [
      { prompt: "n leaves remainder 2 when divided by 5. What is remainder of n+3 when divided by 5?", answers: ["0"], hint: "Add remainders then mod 5.", solution: "2+3=5, remainder 0." },
      { prompt: "If n=7k+4, what is the remainder of 2n when divided by 7?", answers: ["1"], hint: "2n=14k+8.", solution: "14k+8=14k+7+1, remainder 1." },
      { prompt: "n leaves remainder 5 when divided by 6. What is remainder of n+1 when divided by 6?", answers: ["0"], hint: "5+1=6.", solution: "Remainder becomes 0." },
    ],
    counting: [
      { prompt: "How many two-digit numbers can be formed using 1,2,3 with repetition allowed?", answers: ["9"], hint: "3 choices for tens and 3 for ones.", solution: "3×3=9." },
      { prompt: "How many ways to choose 2 students from 4?", answers: ["6"], hint: "Use combination or list.", solution: "C(4,2)=6." },
      { prompt: "How many two-digit numbers can be formed from 1,2,3,4 without repetition?", answers: ["12"], hint: "4 choices then 3 choices.", solution: "4×3=12." },
    ],
  };

  function pickTemplates(topic) {
    return topicTemplates[topic] || topicTemplates.equation;
  }

  function shuffle(arr, rng = Math.random) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generateQuestionsByTopic(topic, count = 3, rng = Math.random) {
    const pool = pickTemplates(topic);
    const selected = shuffle(pool, rng).slice(0, Math.max(1, count));
    return selected.map((item, idx) => ({
      id: `${topic}-${idx + 1}`,
      topic,
      prompt: item.prompt,
      answers: item.answers,
      hint: item.hint,
      solution: item.solution,
    }));
  }

  const api = { generateQuestionsByTopic };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.Reinforcement = api;
})(typeof window !== "undefined" ? window : globalThis);
