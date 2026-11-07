/* Short original tones. No borrowed melodies. */
(function () {
  'use strict';

  var ctx = null;
  var muted = false;
  try { muted = localStorage.getItem('xg:mute') === '1'; } catch (e) {}

  function ac() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, gain, to) {
    if (muted) return;
    var c = ac();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (to) o.frequency.exponentialRampToValueAtTime(Math.max(40, to), c.currentTime + dur);
    g.gain.setValueAtTime(gain || 0.05, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur + 0.02);
  }

  window.XSound = {
    get muted() { return muted; },
    toggle: function () {
      muted = !muted;
      try { localStorage.setItem('xg:mute', muted ? '1' : '0'); } catch (e) {}
      return muted;
    },
    jump: function () { tone(380, 0.09, 'square', 0.035, 720); },
    coin: function () { tone(880, 0.07, 'sine', 0.05, 1320); },
    stomp: function () { tone(160, 0.12, 'triangle', 0.06, 70); },
    hurt: function () { tone(240, 0.18, 'sawtooth', 0.04, 60); },
    win: function () {
      tone(523, 0.1, 'sine', 0.05);
      setTimeout(function () { tone(784, 0.14, 'sine', 0.05); }, 90);
    },
    tap: function () { tone(540, 0.035, 'sine', 0.03); },
    hit: function () { tone(280, 0.07, 'square', 0.04, 140); },
    shoot: function () { tone(660, 0.05, 'square', 0.03, 220); }
  };
})();
