/* ============================================================
   app.js — 首页逻辑
   主题 / 年份 / 按 games.js 渲染游戏卡 / 导航分隔线
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ── 主题 ─────────────────────────────────────────────── */
  var themeBtn = document.getElementById('themeBtn');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
      );
    }
  }

  if (themeBtn) {
    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ── 年份 ─────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 游戏清单 ─────────────────────────────────────────── */
  var games = Array.isArray(window.GAMES) ? window.GAMES : [];
  var grid = document.getElementById('gameGrid');
  var emptyEl = document.getElementById('empty');
  var countEl = document.getElementById('count');

  if (countEl) countEl.textContent = '共 ' + games.length + ' 款';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function bestOf(slug) {
    try {
      var raw = localStorage.getItem('xg:best:' + slug);
      var num = raw ? parseInt(raw, 10) : 0;
      return isNaN(num) ? 0 : num;
    } catch (e) {
      return 0;
    }
  }

  function buildCard(game, index) {
    var num = (index + 1 < 10 ? '0' : '') + (index + 1);
    var best = bestOf(game.slug);

    var card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--c1', game.color || '#ff5a1f');
    card.style.setProperty('--c2', game.color2 || '#3b1d8f');

    card.innerHTML =
      '<a class="card-link" href="play.html?g=' + encodeURIComponent(game.slug) + '">' +
        '<div class="cover">' +
          '<div class="cover-lines"></div>' +
          '<span class="cover-num">' + num + '</span>' +
          '<span class="play-pill">▶ 玩</span>' +
          '<div class="cover-title">' + esc(game.title) +
            (game.en ? '<span class="cover-en">' + esc(game.en) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-foot">' +
            '<span class="tag">' + esc(game.tag || '小游戏') + '</span>' +
            (best ? '<span class="best">最好 ' + best + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</a>';

    return card;
  }

  if (grid) {
    if (!games.length) {
      if (emptyEl) emptyEl.hidden = false;
    } else {
      games.forEach(function (game, i) {
        grid.appendChild(buildCard(game, i));
      });
    }
  }

  /* ── 卡片入场 ─────────────────────────────────────────── */
  var hasIO = 'IntersectionObserver' in window;
  var io = hasIO
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    : null;

  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    (function (el, idx) {
      el.style.transitionDelay = (idx % 6) * 70 + 'ms';
      window.setTimeout(function () { el.style.transitionDelay = '0ms'; }, 1300);
      if (io) io.observe(el); else el.classList.add('in');
    })(cards[i], i);
  }

  /* ── 导航分隔线 ───────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
