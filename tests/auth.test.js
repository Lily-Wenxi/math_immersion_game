const test = require('node:test');
const assert = require('node:assert/strict');

function makeStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

test('register/login/find password and under-18 parent validation', async () => {
  global.localStorage = makeStorage();
  delete require.cache[require.resolve('../auth')];
  const Auth = require('../auth');

  const missingParent = Auth.registerUser({
    username: 'kid',
    email: 'kid@example.com',
    password: 'secret123',
    address: 'a',
    phone: '1',
    age: 12,
  });
  assert.equal(missingParent.ok, false);

  const ok = Auth.registerUser({
    username: 'kid',
    email: 'kid@example.com',
    password: 'secret123',
    address: 'a',
    phone: '1',
    age: 12,
    parentName: 'parent',
    parentEmail: 'p@example.com',
    parentPhone: '2',
  });
  assert.equal(ok.ok, true);
  assert.equal(Auth.isLoggedIn(), true);

  Auth.logout();
  const bad = Auth.login('kid@example.com', 'wrong');
  assert.equal(bad.ok, false);
  const good = Auth.login('kid@example.com', 'secret123');
  assert.equal(good.ok, true);

  const found = Auth.findPasswordByEmail('kid@example.com');
  assert.equal(found.ok, true);
  assert.equal(found.password, 'secret123');
});

test('guest trials are limited', async () => {
  global.localStorage = makeStorage();
  delete require.cache[require.resolve('../auth')];
  const Auth = require('../auth');

  assert.equal(Auth.consumeGuestTrial('math', 1).ok, true);
  assert.equal(Auth.consumeGuestTrial('math', 1).ok, false);

  assert.equal(Auth.consumeGuestTrial('flash', 3).ok, true);
  assert.equal(Auth.consumeGuestTrial('flash', 3).ok, true);
  assert.equal(Auth.consumeGuestTrial('flash', 3).ok, true);
  assert.equal(Auth.consumeGuestTrial('flash', 3).ok, false);
});
