/* Color Drop authentication page helpers */
(function () {
  function byId(id) { return document.getElementById(id); }
  function message(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-status show ' + (type || 'info');
  }
  function url(file) { return new URL(file, window.location.href).href; }
  function friendly(error) {
    const m = String(error?.message || error || 'Authentication failed.');
    if (/invalid login credentials/i.test(m)) return 'Incorrect email or password.';
    if (/email not confirmed/i.test(m)) return 'Please confirm your email address using the confirmation email before signing in.';
    if (/password should be at least/i.test(m)) return 'Your password is too short. Please use at least 6 characters.';
    if (/user already registered/i.test(m)) return 'An account already exists with this email. Try signing in or resetting the password.';
    return m;
  }

  window.ColorDropAuth = { message, url, friendly, byId };
})();
