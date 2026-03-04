(function (global) {
  const USERS_KEY = "appUsers";
  const SESSION_KEY = "appSession";
  const GUEST_KEY = "guestTrials";

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUsers() {
    return readJson(USERS_KEY, []);
  }

  function saveUsers(users) {
    writeJson(USERS_KEY, users);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function registerUser(payload) {
    const users = getUsers();
    const email = normalizeEmail(payload.email);
    if (!email || !payload.password || !payload.username) {
      return { ok: false, message: "Username, email, and password are required." };
    }
    if (users.some((u) => normalizeEmail(u.email) === email)) {
      return { ok: false, message: "Email already registered." };
    }

    const age = Number(payload.age || 18);
    const under18 = Number.isFinite(age) && age < 18;
    if (under18) {
      if (!payload.parentName || !payload.parentPhone || !payload.parentEmail) {
        return { ok: false, message: "Parent/guardian info is required for users under 18." };
      }
    }

    const user = {
      username: String(payload.username || "").trim(),
      email,
      password: String(payload.password || ""),
      address: String(payload.address || "").trim(),
      phone: String(payload.phone || "").trim(),
      age,
      parentName: under18 ? String(payload.parentName || "").trim() : "",
      parentEmail: under18 ? normalizeEmail(payload.parentEmail) : "",
      parentPhone: under18 ? String(payload.parentPhone || "").trim() : "",
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);
    writeJson(SESSION_KEY, { email: user.email, loggedInAt: new Date().toISOString() });

    return { ok: true, user };
  }

  function login(email, password) {
    const normalized = normalizeEmail(email);
    const user = getUsers().find((u) => normalizeEmail(u.email) === normalized);
    if (!user || user.password !== String(password || "")) {
      return { ok: false, message: "Invalid email or password." };
    }
    writeJson(SESSION_KEY, { email: user.email, loggedInAt: new Date().toISOString() });
    return { ok: true, user };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser() {
    const session = readJson(SESSION_KEY, null);
    if (!session || !session.email) return null;
    return getUsers().find((u) => normalizeEmail(u.email) === normalizeEmail(session.email)) || null;
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function findPasswordByEmail(email) {
    const normalized = normalizeEmail(email);
    const user = getUsers().find((u) => normalizeEmail(u.email) === normalized);
    if (!user) return { ok: false, message: "Email not found." };
    return { ok: true, password: user.password, message: `Password found for ${normalized}.` };
  }

  function getGuestTrials() {
    return readJson(GUEST_KEY, { math: 0, vocab: 0, flash: 0 });
  }

  function setGuestTrials(next) {
    writeJson(GUEST_KEY, next);
  }

  function consumeGuestTrial(feature, limit = 1) {
    if (isLoggedIn()) return { ok: true, used: 0, remaining: Infinity, registered: true };
    const trials = getGuestTrials();
    const used = Number(trials[feature] || 0);
    if (used >= limit) {
      return { ok: false, used, remaining: 0, message: "Trial limit reached. Please register." };
    }
    trials[feature] = used + 1;
    setGuestTrials(trials);
    return { ok: true, used: trials[feature], remaining: Math.max(0, limit - trials[feature]), registered: false };
  }

  const api = {
    getUsers,
    registerUser,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    findPasswordByEmail,
    getGuestTrials,
    consumeGuestTrial,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.Auth = api;
})(typeof window !== "undefined" ? window : globalThis);
