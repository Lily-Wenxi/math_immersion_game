const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeAnswer,
  parseFractionOrNumber,
  isAnswerCorrect,
} = require('../gameLogic');

test('normalizeAnswer removes spaces and lowercases', () => {
  assert.equal(normalizeAnswer('  A B C  '), 'abc');
  assert.equal(normalizeAnswer('  2 / 3 '), '2/3');
});

test('parseFractionOrNumber supports fractions and decimals', () => {
  assert.equal(parseFractionOrNumber('3/4'), 0.75);
  assert.equal(parseFractionOrNumber('0.75'), 0.75);
  assert.equal(parseFractionOrNumber('0，5'), 0.5);
  assert.equal(parseFractionOrNumber('abc'), null);
  assert.equal(parseFractionOrNumber('1/0'), null);
});

test('isAnswerCorrect supports direct and numeric-equivalent matches', () => {
  assert.equal(isAnswerCorrect('11，6', ['11,6', '11，6']), true);
  assert.equal(isAnswerCorrect('2/3', ['2/3']), true);
  assert.equal(isAnswerCorrect('0.6666666667', ['2/3']), true);
  assert.equal(isAnswerCorrect(' 12 ', ['12']), true);
  assert.equal(isAnswerCorrect('13', ['12']), false);
  assert.equal(isAnswerCorrect('', ['12']), false);
});
