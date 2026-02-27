const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getTodayKey,
  buildDailyDeck,
  normalizeWord,
  claimDailyReward,
} = require('../ssatFlashcardLogic');
const { getWordBank } = require('../ssatVocabData');

test('getTodayKey formats YYYY-MM-DD', () => {
  const key = getTodayKey(new Date('2026-02-27T00:00:00Z'));
  assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
});

test('buildDailyDeck returns deterministic 20 words for same day key', () => {
  const words = getWordBank();
  const d1 = buildDailyDeck(words, '2026-02-27', 20).map((w) => w.word);
  const d2 = buildDailyDeck(words, '2026-02-27', 20).map((w) => w.word);
  assert.deepEqual(d1, d2);
  assert.equal(d1.length, 20);
});

test('normalizeWord adds antonym usage and comic panels', () => {
  const item = normalizeWord({ word: 'abundant', definition: 'plenty', synonym: 'plentiful' });
  assert.notEqual(item.antonym, 'plentiful');
  assert.ok(item.usage.length > 0);
  assert.equal(item.comicPanels.length, 3);
});

test('claimDailyReward grants once per day', () => {
  const ok = claimDailyReward(100, false, 40);
  assert.equal(ok.ok, true);
  assert.equal(ok.points, 140);
  const no = claimDailyReward(ok.points, true, 40);
  assert.equal(no.ok, false);
  assert.equal(no.points, 140);
});
