/*
  Analytics for rahadarefin.com
  Google Tag Manager with Google Consent Mode v2.

  Your Google Tag Manager container ID is below. Empty the quotes to switch
  all analytics off; put the ID back to switch them on.
*/
var GTM_ID = 'GTM-K9MBVPF5';

(function () {
  if (!GTM_ID) return;
  var w = window, d = document;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = gtag;

  var KEY = 'ra_consent', saved = null, tz = '';
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  /* Visitors in Europe (EU, UK, Switzerland and neighbours) are asked first; everyone else is measured by default. */
  var askFirst = /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);
  var state = saved ? saved : (askFirst ? 'denied' : 'granted');

  /* This site runs no ads, so advertising storage is always off. */
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: state, wait_for_update: 500
  });
  gtag('set', 'url_passthrough', false);

  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
    f.parentNode.insertBefore(j, f);
  })(w, d, 'script', 'dataLayer', GTM_ID);

  function decide(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: v });
    w.dataLayer.push({ event: 'consent_update', analytics_consent: v });
    var b = d.getElementById('consentBar'); if (b) b.remove();
  }

  function showBar() {
    if (d.getElementById('consentBar')) return;
    var css = d.createElement('style');
    css.textContent = '#consentBar{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:90;max-width:560px;margin:0 auto;background:#0F1B3D;color:#C5CEE6;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:18px 20px;box-shadow:0 24px 48px -20px rgba(0,0,0,.5);font:400 14.5px/1.55 Inter,system-ui,sans-serif}' +
      '#consentBar p{margin:0 0 14px}#consentBar a{color:#7EA6FF}' +
      '#consentBar .cb-row{display:flex;gap:10px;flex-wrap:wrap}' +
      '#consentBar button{flex:1 1 140px;min-height:44px;border-radius:999px;font:700 14.5px/1 Inter,system-ui,sans-serif;cursor:pointer;border:1.5px solid rgba(255,255,255,.25);background:transparent;color:#fff}' +
      '#consentBar button.cb-yes{background:#2563EB;border-color:#2563EB}';
    d.head.appendChild(css);
    var bar = d.createElement('div');
    bar.id = 'consentBar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Analytics consent');
    bar.innerHTML = '<p>I use privacy-friendly analytics to see which pages help visitors. No ads, nothing sold. <a href="/privacy.html">Privacy</a></p>' +
      '<div class="cb-row"><button type="button" class="cb-no">Decline</button><button type="button" class="cb-yes">Accept analytics</button></div>';
    bar.querySelector('.cb-yes').onclick = function () { decide('granted'); };
    bar.querySelector('.cb-no').onclick = function () { decide('denied'); };
    d.body.appendChild(bar);
  }

  if (askFirst && !saved) {
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', showBar); else showBar();
  }

  /* Used by the "Change my choice" button on /privacy.html */
  w.raConsent = { open: showBar, state: function () { return saved || state; } };
})();
