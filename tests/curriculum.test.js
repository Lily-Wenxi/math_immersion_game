const test = require('node:test');
const assert = require('node:assert/strict');

const { getSupportedGrades, getLevelsByGrade } = require('../curriculum');

test('supported grades include 7, 8 and 9', () => {
  const grades = getSupportedGrades();
  assert.deepEqual(grades, [7, 8, 9]);
});

test('getLevelsByGrade returns level sets with 7 items', () => {
  assert.equal(getLevelsByGrade(7).length, 7);
  assert.equal(getLevelsByGrade(8).length, 7);
  assert.equal(getLevelsByGrade(9).length, 7);
});

test('getLevelsByGrade returns a clone array', () => {
  const levels = getLevelsByGrade(7);
  levels.pop();
  assert.equal(getLevelsByGrade(7).length, 7);
});
