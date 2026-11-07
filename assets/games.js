/* ============================================================
   games.js — 游戏清单
   加一款游戏：
     1. 新建 games/<slug>/index.html（slug 只用小写字母、数字、短横线）
     2. 在下面的 list 里追加一条
   score: "high" 分越高越好；"low" 步数越少越好（翻牌）
   ============================================================ */
(function () {
  'use strict';

  var list = [
    {
      slug: 'lattice',
      title: '晶格',
      en: 'Lattice',
      blurb: '把相同数字滑到一起。数字越大，格子越暖。试着合出 2048。',
      tags: ['益智'],
      score: 'high',
      cover: 'assets/covers/lattice.svg'
    },
    {
      slug: 'snake',
      title: '贪吃蛇',
      en: 'Snake',
      blurb: '吃掉光点就会变长。别撞到墙，也别咬到自己。',
      tags: ['街机'],
      score: 'high',
      cover: 'assets/covers/snake.svg'
    },
    {
      slug: 'pairs',
      title: '翻牌',
      en: 'Pairs',
      blurb: '翻开两张牌，记住位置，用尽量少的步数把它们全部配对。',
      tags: ['记忆'],
      score: 'low',
      cover: 'assets/covers/pairs.svg'
    },
    {
      slug: 'pulse',
      title: '脉冲',
      en: 'Pulse',
      blurb: '点按核心收集能量，再把能量换成更强的点击和自动增长。',
      tags: ['休闲'],
      score: 'high',
      cover: 'assets/covers/pulse.svg'
    },
    {
      slug: 'breakout',
      title: '打砖块',
      en: 'Breakout',
      blurb: '接住小球，把砖一层层打掉。接丢三次，这局就结束。',
      tags: ['街机'],
      score: 'high',
      cover: 'assets/covers/breakout.svg'
    }
  ];

  function formatScore(game, value, emptyText) {
    var n = Math.floor(Number(value) || 0);
    if (!n) return emptyText == null ? '' : emptyText;
    var shown;
    if (n >= 1000000000) shown = (Math.round(n / 100000000) / 10) + 'b';
    else if (n >= 1000000) shown = (Math.round(n / 100000) / 10) + 'm';
    else if (n >= 10000) shown = (Math.round(n / 100) / 10) + 'k';
    else shown = String(n);
    if (game && game.score === 'low') return '最少 ' + shown + ' 步';
    return '最好 ' + shown;
  }

  window.GAMES = list;
  window.formatScore = formatScore;
})();
