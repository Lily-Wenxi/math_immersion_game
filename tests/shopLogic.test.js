const test = require('node:test');
const assert = require('node:assert/strict');

const { getCatalog, purchaseEquipment } = require('../shopLogic');

test('catalog has at least 5 equipment items', () => {
  const items = getCatalog();
  assert.ok(items.length >= 5);
  assert.ok(items.every((it) => typeof it.id === 'string' && typeof it.cost === 'number'));
});

test('purchase fails when points are insufficient', () => {
  const result = purchaseEquipment(10, [], 'algebra_shield');
  assert.equal(result.ok, false);
  assert.equal(result.message, 'Not enough points.');
});

test('purchase succeeds and deducts points', () => {
  const result = purchaseEquipment(100, [], 'pencil_plus');
  assert.equal(result.ok, true);
  assert.equal(result.score, 80);
  assert.ok(result.owned.includes('pencil_plus'));
});

test('duplicate purchase is blocked', () => {
  const result = purchaseEquipment(100, ['pencil_plus'], 'pencil_plus');
  assert.equal(result.ok, false);
  assert.equal(result.message, 'Already owned.');
});
