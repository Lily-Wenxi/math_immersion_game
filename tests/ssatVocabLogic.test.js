const test = require('node:test');
const assert = require('node:assert/strict');

const { getWordBank } = require('../ssatVocabData');
const {
  pickPrioritizedWord,
  createSynonymQuestion,
  createDefinitionQuestion,
} = require('../ssatVocabLogic');

test('pickPrioritizedWord prefers notebook words when available', () => {
  const words = getWordBank();
  const picked = pickPrioritizedWord(words, ['abundant', 'lucid']);
  assert.ok(['abundant', 'lucid'].includes(picked.word));
});

test('createSynonymQuestion returns 4 choices containing answer', () => {
  const q = createSynonymQuestion(getWordBank(), []);
  assert.equal(q.type, 'synonym');
  assert.equal(q.choices.length, 4);
  assert.ok(q.choices.includes(q.answer));
});

test('createDefinitionQuestion returns 4 choices containing answer', () => {
  const q = createDefinitionQuestion(getWordBank(), []);
  assert.equal(q.type, 'definition');
  assert.equal(q.choices.length, 4);
  assert.ok(q.choices.includes(q.answer));
});


test('word bank includes at least 2500 entries', () => {
  assert.ok(getWordBank().length >= 2500);
});


test('word bank includes user-submitted base and affix variants', () => {
  const words = getWordBank();
  const byWord = new Map(words.map((w) => [w.word, w]));

  assert.ok(byWord.has('postabundant'));
  assert.ok(byWord.has('superaccurate'));
  assert.ok(byWord.has('preadapt'));
  assert.ok(byWord.has('admire'));

  assert.equal(byWord.get('postabundant').synonym, 'creative');
  assert.equal(byWord.get('superaccurate').antonym, 'careless');
});
