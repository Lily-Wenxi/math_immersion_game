(function (global) {
  const grade7 = [
    { id: 1, topic: "ratio", title: "Level 1: Ratios and Scaling (Grade 7)", story: "A drink mix uses syrup:water = 2:5. If you need 42 cups total, how many cups of syrup are needed?", visualAid: "Total parts: 2+5=7, so each part is 42÷7.", answers: ["12"], hint: "Find one part first, then multiply by 2.", solution: "42÷7=6, syrup = 2×6 = 12.", points: 15 },
    { id: 2, topic: "fraction", title: "Level 2: Fraction Route (Grade 7)", story: "A team walks 1/3 of a route, then walks 1/2 of the remaining route. What fraction of the whole route has been covered?", visualAid: "After first part, remaining is 1-1/3.", answers: ["2/3"], hint: "Remaining after first part is 2/3.", solution: "Second part is (1/2)×(2/3)=1/3. Total = 1/3+1/3=2/3.", points: 15 },
    { id: 3, topic: "integer_abs", title: "Level 3: Integers and Absolute Value (Grade 7)", story: "If x=-4 and y=3, find |x-y| + |x+y|.", visualAid: "Compute x-y and x+y first, then take absolute values.", answers: ["8"], hint: "x-y=-7, x+y=-1.", solution: "|-7|+|-1|=7+1=8.", points: 15 },
    { id: 4, topic: "equation", title: "Level 4: Linear Equation (Grade 7)", story: "Solve: 3(x-2)+5=2x+9.", visualAid: "Expand, collect x terms on one side and constants on the other.", answers: ["10"], hint: "3x-6+5=2x+9.", solution: "3x-1=2x+9, so x=10.", points: 20 },
    { id: 5, topic: "geometry", title: "Level 5: Rectangle Perimeter (Grade 7)", story: "A rectangle has length 5 more than width and perimeter 34. Find length and width. Format: length,width", visualAid: "Let width be w, length is w+5.", answers: ["11,6"], hint: "2[(w+5)+w]=34.", solution: "2(2w+5)=34 => 4w=24 => w=6, length=11.", points: 20 },
    { id: 6, topic: "remainder", title: "Level 6: Remainders (Grade 7)", story: "A positive integer n leaves remainder 3 when divided by 7. What is the remainder of 2n+1 when divided by 7?", visualAid: "Write n as 7k+3.", answers: ["0"], hint: "2(7k+3)+1=14k+7.", solution: "14k+7 is divisible by 7, so remainder is 0.", points: 25 },
    { id: 7, topic: "counting", title: "Level 7: Counting Strategy (Grade 7)", story: "Using digits 1,2,3,4 (repetition allowed), how many two-digit numbers have ones digit greater than tens digit?", visualAid: "Count by fixing tens digit.", answers: ["6"], hint: "If tens is 1, ones can be 2,3,4.", solution: "3+2+1+0 = 6.", points: 30 },
  ];

  const grade8 = [
    { id: 1, topic: "equation", title: "Level 1: System of Equations (Grade 8)", story: "Solve x+y=11 and x-y=3. Find x.", visualAid: "Add the equations to eliminate y.", answers: ["7"], hint: "(x+y)+(x-y)=14.", solution: "2x=14, so x=7.", points: 18 },
    { id: 2, topic: "equation", title: "Level 2: Linear Function (Grade 8)", story: "Given y=2x+1, find y when x=5.", visualAid: "Substitute x into the expression.", answers: ["11"], hint: "2×5+1.", solution: "y=11.", points: 16 },
    { id: 3, topic: "geometry", title: "Level 3: Triangle Angles (Grade 8)", story: "Two angles in a triangle are 50° and 65°. Find the third angle.", visualAid: "Triangle angles sum to 180°.", answers: ["65"], hint: "180-50-65.", solution: "Third angle is 65°.", points: 16 },
    { id: 4, topic: "equation", title: "Level 4: Algebraic Expression (Grade 8)", story: "Simplify (2x+3)+(x-5), then evaluate at x=4.", visualAid: "Combine like terms first.", answers: ["10"], hint: "3x-2.", solution: "3(4)-2=10.", points: 18 },
    { id: 5, topic: "geometry", title: "Level 5: Pythagorean Basics (Grade 8)", story: "A right triangle has legs 6 and 8. Find the hypotenuse.", visualAid: "Use c²=a²+b².", answers: ["10"], hint: "6²+8²=100.", solution: "c=10.", points: 22 },
    { id: 6, topic: "fraction", title: "Level 6: Intro Probability (Grade 8)", story: "A bag has 3 red balls and 5 blue balls. Probability of drawing red? (simplest fraction)", visualAid: "Probability = favorable / total.", answers: ["3/8"], hint: "Total is 8.", solution: "P(red)=3/8.", points: 20 },
    { id: 7, topic: "counting", title: "Level 7: Multiplication Principle (Grade 8)", story: "Choose 1 main dish from 3 and 1 drink from 4. How many combinations?", visualAid: "Multiply choices.", answers: ["12"], hint: "3×4.", solution: "12 combinations.", points: 24 },
  ];

  const grade9 = [
    { id: 1, topic: "equation", title: "Level 1: Quadratic Equation (Grade 9)", story: "Solve x²-5x+6=0. Find the smaller root.", visualAid: "Factorization is fastest here.", answers: ["2"], hint: "(x-2)(x-3)=0.", solution: "Roots are 2 and 3, so smaller root is 2.", points: 20 },
    { id: 2, topic: "equation", title: "Level 2: Quadratic Function Value (Grade 9)", story: "Given y=x²-4x+1, find y when x=3.", visualAid: "Substitute directly.", answers: ["-2"], hint: "9-12+1.", solution: "y=-2.", points: 18 },
    { id: 3, topic: "geometry", title: "Level 3: Similar Triangles Ratio (Grade 9)", story: "Two similar triangles have side ratio 2:3. If the smaller perimeter is 16, what is the larger perimeter?", visualAid: "Perimeters scale by same ratio.", answers: ["24"], hint: "Multiply by 3/2.", solution: "16×3/2 = 24.", points: 22 },
    { id: 4, topic: "geometry", title: "Level 4: Circle Circumference (Grade 9)", story: "A circle has radius 5. Find circumference in terms of π.", visualAid: "C=2πr.", answers: ["10π", "10pi", "10*pi"], hint: "2×π×5.", solution: "C=10π.", points: 20 },
    { id: 5, topic: "remainder", title: "Level 5: Units Digit Pattern (Grade 9)", story: "What is the ones digit of 2^5?", visualAid: "You can compute directly or use pattern.", answers: ["2"], hint: "2^5=32.", solution: "Ones digit is 2.", points: 18 },
    { id: 6, topic: "fraction", title: "Level 6: Mean and Total (Grade 9)", story: "Five numbers have mean 12. If four of them sum to 46, what is the fifth number?", visualAid: "Total = mean × count.", answers: ["14"], hint: "Total is 60.", solution: "60-46=14.", points: 20 },
    { id: 7, topic: "counting", title: "Level 7: Basic Probability (Grade 9)", story: "Roll one die. Probability of getting a number greater than 4? (simplest fraction)", visualAid: "Favorable outcomes: 5 and 6.", answers: ["1/3"], hint: "2 out of 6.", solution: "2/6=1/3.", points: 22 },
  ];

  const byGrade = { 7: grade7, 8: grade8, 9: grade9 };

  function getSupportedGrades() {
    return Object.keys(byGrade).map(Number).sort((a, b) => a - b);
  }

  function getLevelsByGrade(grade) {
    const levels = byGrade[grade];
    if (!levels) return [];
    return levels.map((item) => ({ ...item }));
  }

  const api = { getSupportedGrades, getLevelsByGrade };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.Curriculum = api;
})(typeof window !== "undefined" ? window : globalThis);
