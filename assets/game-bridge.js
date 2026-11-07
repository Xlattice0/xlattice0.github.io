/* Small bridge between a game iframe and the play shell. */
(function () {
  'use strict';

  function readBest(slug) {
    try {
      var n = parseInt(localStorage.getItem('xg:best:' + slug) || '0', 10);
      return isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  }

  function publish(slug, score, best) {
    var n = Math.max(0, Math.floor(Number(best) || 0));
    try { localStorage.setItem('xg:best:' + slug, String(n)); } catch (e) {}
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: 'xg:score', slug: slug, score: Math.floor(Number(score) || 0), best: n },
          '*'
        );
      }
    } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data || data.type !== 'xg:theme') return;
    if (data.theme !== 'dark' && data.theme !== 'light') return;
    document.documentElement.dataset.theme = data.theme;
  });

  window.XGame = { readBest: readBest, publish: publish };
})();
