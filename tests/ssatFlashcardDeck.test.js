const test = require('node:test');
const assert = require('node:assert/strict');

const { getDeck } = require('../ssatFlashcardDeck');

test('flashcard curated deck has enough entries and required fields', () => {
  const deck = getDeck();
  assert.ok(deck.length >= 60);
  deck.forEach((item) => {
    assert.ok(item.word);
    assert.ok(item.definition);
    assert.ok(item.synonym);
    assert.ok(item.antonym);
    assert.ok(item.usage);
  });
});
