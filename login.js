/**
 * Smart Sachivalayam Portal - Staff Login
 * Handles authentication validation and session management
 */

/* Demo staff credentials */
const STAFF_CREDENTIALS = {
  username: 'admin',
  password: 'Sachivalayam@2024'
};

const AUTH_KEY = 'sachivalayam_auth';

/**
 * Check if user is already logged in; redirect to dashboard
 */
function checkExistingSession() {
  const auth = localStorage.getItem(AUTH_KEY);
  if (auth) {
    try {
      const session = JSON.parse(auth);
      if (session.loggedIn && session.expiry > Date.now()) {
        window.location.href = 'dashboard.html';
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }
}

/**
 * Validate login form fields
 */
function validateLoginForm(username, password) {
  let valid = true;
  const usernameField = document.getElementById('username');
  const passwordField = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  /* Reset states */
  usernameField.classList.remove('error');
  passwordField.classList.remove('error');
  usernameError.classList.remove('show');
  passwordError.classList.remove('show');

  if (!username.trim()) {
    usernameField.classList.add('error');
    usernameError.textContent = 'Username is required.';
    usernameError.classList.add('show');
    valid = false;
  } else if (username.trim().length < 3) {
    usernameField.classList.add('error');
    usernameError.textContent = 'Username must be at least 3 characters.';
    usernameError.classList.add('show');
    valid = false;
  }

  if (!password) {
    passwordField.classList.add('error');
    passwordError.textContent = 'Password is required.';
    passwordError.classList.add('show');
    valid = false;
  } else if (password.length < 6) {
    passwordField.classList.add('error');
    passwordError.textContent = 'Password must be at least 6 characters.';
    passwordError.classList.add('show');
    valid = false;
  }

  return valid;
}

/**
 * Attempt login with provided credentials
 */
function attemptLogin(username, password) {
  const loginError = document.getElementById('loginError');

  if (
    username.trim() === STAFF_CREDENTIALS.username &&
    password === STAFF_CREDENTIALS.password
  ) {
    /* Create session valid for 8 hours */
    const session = {
      loggedIn: true,
      username: username.trim(),
      loginTime: new Date().toISOString(),
      expiry: Date.now() + 8 * 60 * 60 * 1000
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    window.location.href = 'dashboard.html';
    return true;
  }

  loginError.textContent = 'Invalid username or password. Please try again.';
  loginError.classList.add('show');
  return false;
}

/**
 * Initialize login form
 */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    loginError.classList.remove('show');

    if (validateLoginForm(username, password)) {
      attemptLogin(username, password);
    }
  });

  /* Clear errors on input */
  ['username', 'password'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const field = document.getElementById(id);
      field.classList.remove('error');
      document.getElementById(id + 'Error')?.classList.remove('show');
      document.getElementById('loginError')?.classList.remove('show');
    });
  });
}

/* --- Auth utility for dashboard --- */
function isAuthenticated() {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  try {
    const session = JSON.parse(auth);
    if (session.loggedIn && session.expiry > Date.now()) {
      return session;
    }
    localStorage.removeItem(AUTH_KEY);
    return false;
  } catch {
    return false;
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

if (typeof window !== 'undefined') {
  window.SachivalayamAuth = { isAuthenticated, logout, AUTH_KEY };
}

document.addEventListener('DOMContentLoaded', () => {
  checkExistingSession();
  initLoginForm();
});
