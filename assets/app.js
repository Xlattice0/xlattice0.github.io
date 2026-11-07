/* Home: render cards from games.js, filter them, and show local bests. */
(function () {
  'use strict';

  var games = Array.isArray(window.GAMES) ? window.GAMES : [];
  var grid = document.getElementById('gameGrid');
  var empty = document.getElementById('empty');
  var shownCount = document.getElementById('shownCount');
  var heroCount = document.getElementById('heroCount');
  var search = document.getElementById('q');
  var chipRow = document.getElementById('chips');
  var year = document.getElementById('year');
  var topbar = document.querySelector('.topbar');

  if (year) year.textContent = String(new Date().getFullYear());
  if (heroCount) heroCount.textContent = games.length ? (games.length + ' 款可玩') : '即将上架';

  var currentTag = '全部';
  var cards = [];

  function bestOf(slug) {
    try {
      var n = parseInt(localStorage.getItem('xg:best:' + slug) || '0', 10);
      return isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  }

  function fillBests() {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var game = games[i];
      var node = card.querySelector('.card-best');
      if (!node || !game) continue;
      node.textContent = window.formatScore(game, bestOf(game.slug), '');
    }
  }

  function applyFilter() {
    var q = search ? search.value.trim().toLowerCase() : '';
    var shown = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var okQ = !q || card.dataset.hay.indexOf(q) !== -1;
      var tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
      var okT = currentTag === '全部' || tags.indexOf(currentTag) !== -1;
      var ok = okQ && okT;
      card.hidden = !ok;
      if (ok) shown++;
    }
    if (empty) {
      empty.hidden = shown !== 0;
      if (!games.length) empty.textContent = '游戏清单还是空的。请检查 assets/games.js。';
      else empty.textContent = '没有符合的游戏。清空搜索，或切回「全部」。';
    }
    if (shownCount) {
      shownCount.textContent = currentTag === '全部' && !q
        ? ('共 ' + games.length + ' 款')
        : (shown + ' / ' + games.length);
    }
  }

  function buildCard(game, index) {
    var link = document.createElement('a');
    link.className = 'card';
    link.href = 'play.html?g=' + encodeURIComponent(game.slug);
    link.style.animationDelay = Math.min(index, 8) * 45 + 'ms';
    link.dataset.tags = (game.tags || []).join(',');
    link.dataset.hay = [game.title, game.en, game.blurb, (game.tags || []).join(' ')].join(' ').toLowerCase();

    var cover = document.createElement('div');
    cover.className = 'card-cover';
    var img = document.createElement('img');
    img.src = game.cover || '';
    img.alt = '';
    img.width = 640;
    img.height = 400;
    cover.appendChild(img);
    if (game.en) {
      var en = document.createElement('span');
      en.className = 'cover-en';
      en.textContent = game.en;
      cover.appendChild(en);
    }

    var body = document.createElement('div');
    body.className = 'card-body';

    var top = document.createElement('div');
    top.className = 'card-top';
    var title = document.createElement('h3');
    title.textContent = game.title;
    var best = document.createElement('span');
    best.className = 'card-best';
    top.appendChild(title);
    top.appendChild(best);

    var blurb = document.createElement('p');
    blurb.className = 'card-blurb';
    blurb.textContent = game.blurb || '';

    var foot = document.createElement('div');
    foot.className = 'card-foot';
    var tags = document.createElement('div');
    tags.className = 'card-tags';
    (game.tags || []).forEach(function (tag) {
      var pill = document.createElement('span');
      pill.className = 'tag';
      pill.textContent = tag;
      tags.appendChild(pill);
    });
    var cta = document.createElement('span');
    cta.className = 'card-cta';
    cta.textContent = '开始';
    foot.appendChild(tags);
    foot.appendChild(cta);

    body.appendChild(top);
    body.appendChild(blurb);
    body.appendChild(foot);
    link.appendChild(cover);
    link.appendChild(body);
    return link;
  }

  if (grid) {
    if (!games.length && empty) empty.hidden = false;
    games.forEach(function (game, i) {
      var card = buildCard(game, i);
      cards.push(card);
      grid.appendChild(card);
    });
    fillBests();
  }

  if (chipRow) {
    var tags = ['全部'];
    games.forEach(function (game) {
      (game.tags || []).forEach(function (tag) {
        if (tags.indexOf(tag) === -1) tags.push(tag);
      });
    });
    tags.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = tag;
      btn.setAttribute('aria-pressed', tag === '全部' ? 'true' : 'false');
      btn.addEventListener('click', function () {
        currentTag = tag;
        var all = chipRow.querySelectorAll('.chip');
        for (var i = 0; i < all.length; i++) {
          all[i].setAttribute('aria-pressed', all[i] === btn ? 'true' : 'false');
        }
        applyFilter();
      });
      chipRow.appendChild(btn);
    });
  }

  if (search) {
    search.addEventListener('input', applyFilter);
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        search.value = '';
        applyFilter();
        search.blur();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var el = document.activeElement;
    var typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    if (typing || !search) return;
    e.preventDefault();
    search.focus();
  });

  applyFilter();
  window.addEventListener('pageshow', fillBests);

  if (topbar) {
    var onScroll = function () { topbar.classList.toggle('is-stuck', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
