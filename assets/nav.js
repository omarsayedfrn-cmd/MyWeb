/* ── سولفر — قائمة التنقل على الموبايل ──────────────────────────────── */
(function () {
  'use strict';

  var head = document.querySelector('.site-head');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (!head || !btn || !nav) return;

  function setOpen(open) {
    head.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && head.classList.contains('nav-open')) {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!head.classList.contains('nav-open')) return;
    if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) setOpen(false);
  });
})();