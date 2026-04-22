/* =========================================================
   Teaching Guide — Password Gate (SHA-256)
   Client-side password protection for static GitHub Pages.

   The password is NOT stored in this file. Only its SHA-256
   hash is present, which cannot be reversed. Someone reading
   this source code will see the hash but cannot derive the
   password from it.
   ========================================================= */

(function () {
  'use strict';

  // SHA-256 hash of the correct password — impossible to reverse.
  // To update, run in Node:  crypto.createHash('sha256').update('NEW_PASSWORD').digest('hex')
  var PASS_HASH = '22697854621a137c9ce18c2a016962b0c0f3034f767c1da72378895fd3311f67';

  var AUTH_KEY = '__tg_auth';

  /* Already authenticated this session? */
  if (sessionStorage.getItem(AUTH_KEY) === 'granted') return;

  /* --- Hide real page content --- */
  document.documentElement.style.visibility = 'hidden';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.style.visibility = 'hidden';
    showGate();
  });

  /* SHA-256 using the Web Crypto API (all modern browsers) */
  function sha256(str) {
    var buf = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', buf).then(function (hashBuf) {
      return Array.from(new Uint8Array(hashBuf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function showGate() {
    var overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'display:flex', 'align-items:center', 'justify-content:center',
      'background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)',
      'visibility:visible', 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
    ].join(';');

    overlay.innerHTML = '\
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:40px 36px;\
                  max-width:400px;width:90%;text-align:center;box-shadow:0 24px 48px rgba(0,0,0,0.4);">\
        <div style="width:56px;height:56px;border-radius:14px;\
                    background:linear-gradient(135deg,#0ea5e9,#0369a1);\
                    display:flex;align-items:center;justify-content:center;\
                    margin:0 auto 20px;font-size:26px;">\xF0\x9F\x94\x92</div>\
        <h2 style="color:#f1f5f9;font-size:22px;font-weight:700;margin-bottom:6px;">\
          Instructor Access Only\
        </h2>\
        <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">\
          This teaching guide is password-protected.<br>Enter the password to continue.\
        </p>\
        <input id="auth-pw" type="password" placeholder="Enter password"\
               autocomplete="off" autofocus\
               style="width:100%;padding:12px 16px;border-radius:10px;border:1px solid #475569;\
                      background:#0f172a;color:#f1f5f9;font-size:15px;outline:none;\
                      transition:border-color 0.2s;">\
        <button id="auth-btn"\
                style="width:100%;margin-top:12px;padding:12px;border:none;border-radius:10px;\
                       background:linear-gradient(135deg,#0ea5e9,#0369a1);color:white;\
                       font-size:15px;font-weight:600;cursor:pointer;\
                       transition:opacity 0.2s;">\
          Unlock\
        </button>\
        <p id="auth-err" style="color:#f87171;font-size:13px;margin-top:12px;min-height:18px;"></p>\
        <a href="../index.html"\
           style="color:#64748b;font-size:12px;text-decoration:none;margin-top:8px;display:inline-block;">\
          \u2190 Back to course home\
        </a>\
      </div>';

    document.body.appendChild(overlay);

    var inp = document.getElementById('auth-pw');
    var btn = document.getElementById('auth-btn');
    var err = document.getElementById('auth-err');

    function attempt() {
      var pw = inp.value;
      sha256(pw).then(function (hash) {
        if (hash === PASS_HASH) {
          sessionStorage.setItem(AUTH_KEY, 'granted');
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.3s';
          setTimeout(function () {
            overlay.remove();
            document.documentElement.style.visibility = '';
            document.body.style.visibility = '';
          }, 300);
        } else {
          err.textContent = 'Incorrect password. Try again.';
          inp.value = '';
          inp.style.borderColor = '#f87171';
          setTimeout(function () { inp.style.borderColor = '#475569'; }, 1500);
        }
      });
    }

    btn.addEventListener('click', attempt);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attempt();
    });

    inp.addEventListener('focus', function () { inp.style.borderColor = '#0ea5e9'; });
    inp.addEventListener('blur', function () { inp.style.borderColor = '#475569'; });
  }
})();
