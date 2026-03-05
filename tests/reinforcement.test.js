const test = require('node:test');
const assert = require('node:assert/strict');

const { generateQuestionsByTopic } = require('../reinforcement');

test('generateQuestionsByTopic returns requested count and shape', () => {
  const items = generateQuestionsByTopic('ratio', 3, () => 0.1);
  assert.equal(items.length, 3);
  items.forEach((item) => {
    assert.ok(item.prompt.length > 0);
    assert.ok(Array.isArray(item.answers));
    assert.ok(item.answers.length > 0);
    assert.equal(item.topic, 'ratio');
  });
});

test('generateQuestionsByTopic falls back for unknown topic', () => {
  const items = generateQuestionsByTopic('unknown_topic', 2, () => 0.1);
  assert.equal(items.length, 2);
  items.forEach((item) => {
    assert.equal(item.topic, 'unknown_topic');
    assert.ok(item.prompt.length > 0);
  });
});
