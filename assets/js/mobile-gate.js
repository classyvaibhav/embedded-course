/**
 * Desktop-only gate — blocks mobile & small-screen users with a
 * fullscreen overlay. Include this script on any page that should
 * be restricted to laptops / desktops.
 *
 * Detection: CSS media query (width < 1024px) + UA string sniffing.
 */
(function () {
  /* ── 1. Inject the CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '.mobile-block{',
    '  position:fixed;inset:0;z-index:99999;',
    '  display:none;align-items:center;justify-content:center;',
    '  background:var(--bg,#fafbfc);padding:32px;text-align:center;',
    '  flex-direction:column;gap:16px;',
    '}',
    '.mobile-block .mb-icon{font-size:56px;line-height:1}',
    '.mobile-block h2{font-size:22px;font-weight:800;letter-spacing:-.3px;color:var(--ink,#0f172a)}',
    '.mobile-block p{color:var(--muted,#64748b);font-size:14px;line-height:1.7;max-width:380px}',
    '.mobile-block .mb-hint{',
    '  font-size:12px;color:var(--muted,#64748b);opacity:.7;',
    '  border-top:1px solid var(--border,#e2e8f0);padding-top:14px;margin-top:8px;',
    '}',
    '@media(max-width:1024px){',
    '  .mobile-block{display:flex}',
    '  body>*:not(.mobile-block){display:none!important}',
    '}',
    'body.mobile-detected .mobile-block{display:flex}',
    'body.mobile-detected>*:not(.mobile-block){display:none!important}',
  ].join('\n');
  document.head.appendChild(css);

  /* ── 2. Inject the overlay HTML ── */
  var el = document.createElement('div');
  el.className = 'mobile-block';
  el.id = 'mobile-block';
  el.innerHTML =
    '<span class="mb-icon">💻</span>' +
    '<h2>Desktop only</h2>' +
    '<p>This site is designed for laptops and desktops. Please switch to a computer with a larger screen to continue.</p>' +
    '<p class="mb-hint">Minimum recommended screen width: 1024 px</p>';
  document.body.insertBefore(el, document.body.firstChild);

  /* ── 3. UA-based mobile detection ── */
  var ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    document.body.classList.add('mobile-detected');
  }
})();
