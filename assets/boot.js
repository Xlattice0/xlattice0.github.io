/* Apply the saved theme before paint, and wire every theme button. */
(function () {
  'use strict';

  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}

  /* Dark is the cabinet. A saved choice still wins. */
  var theme = saved === 'dark' || saved === 'light' ? saved : 'dark';
  root.dataset.theme = theme;
  if (window.parent !== window) root.classList.add('framed');

  function paintChrome(next) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#090b10' : '#f3eee6');
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-label', next === 'dark' ? '切换到浅色' : '切换到深色');
      buttons[i].setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    }
  }

  function apply(next, persist) {
    root.dataset.theme = next;
    if (persist) {
      try { localStorage.setItem('theme', next); } catch (e) {}
    }
    paintChrome(next);
    if (window.parent === window) {
      var frame = document.getElementById('frame');
      if (frame && frame.contentWindow) {
        try {
          frame.contentWindow.postMessage({ type: 'xg:theme', theme: next }, '*');
        } catch (e) {}
      }
    }
  }

  window.XTheme = {
    current: function () { return root.dataset.theme === 'dark' ? 'dark' : 'light'; },
    toggle: function () { apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () { window.XTheme.toggle(); });
    }
  });

})();
