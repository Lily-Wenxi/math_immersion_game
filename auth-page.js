const messageEl = document.getElementById("authMessage");
const ageInputEl = document.getElementById("ageInput");
const parentFieldsEl = document.getElementById("parentFields");

function showMessage(text, good = true) {
  messageEl.textContent = text;
  messageEl.className = good ? "feedback good" : "feedback bad";
}

function toggleParentFields() {
  const age = Number(ageInputEl.value || 18);
  const under18 = Number.isFinite(age) && age < 18;
  parentFieldsEl.classList.toggle("hidden", !under18);
  parentFieldsEl.querySelectorAll("input").forEach((input) => {
    input.required = under18;
  });
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const result = window.Auth.login(form.get("email"), form.get("password"));
  if (result.ok) {
    showMessage(`Welcome back, ${result.user.username}!`, true);
    return;
  }
  showMessage(result.message, false);
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  const result = window.Auth.registerUser(payload);
  if (result.ok) {
    showMessage(`Account created for ${result.user.username}. You are now logged in.`, true);
    event.currentTarget.reset();
    toggleParentFields();
    return;
  }
  showMessage(result.message, false);
});

document.getElementById("findPwdForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const result = window.Auth.findPasswordByEmail(form.get("email"));
  if (result.ok) {
    showMessage(`Password: ${result.password}`, true);
    return;
  }
  showMessage(result.message, false);
});

ageInputEl.addEventListener("input", toggleParentFields);
toggleParentFields();

const currentUser = window.Auth.getCurrentUser();
if (currentUser) {
  showMessage(`Logged in as ${currentUser.username} (${currentUser.email})`, true);
}
