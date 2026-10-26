/* ============================================================
   app.js — 三件小事:主题切换、年份、滚动出现
   没有依赖,没有构建步骤。
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. 深浅色主题 ───────────────────────────────────── */
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
      );
    }
  }

  if (btn) {
    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ── 2. 页脚年份 ─────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── 3. 滚动到视口时淡入 ─────────────────────────────── */
  var targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // 老浏览器直接显示,不做动效
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  /* ── 4. 滚动时给导航加分隔线 ─────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
