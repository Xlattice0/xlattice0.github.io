/* Game registry. Add a folder under games/ and an entry here. */
(function () {
  'use strict';

  var list = [
    {
      slug: 'rush',
      title: '晶格冲刺',
      en: 'Lattice Rush',
      blurb: '跑、跳、捡晶籽，踩碎挡路的裂片。三关，坑一次比一次宽。',
      tags: ['动作'],
      score: 'high',
      cover: 'assets/covers/rush.svg',
      featured: true,
      cta: '开跑'
    },
    {
      slug: 'lattice',
      title: '晶格',
      en: 'Lattice',
      blurb: '把相同的数字推进去。合上的时候，格子会迸出光。',
      tags: ['益智'],
      score: 'high',
      cover: 'assets/covers/lattice.svg'
    },
    {
      slug: 'shatter',
      title: '碎界',
      en: 'Shatter',
      blurb: '接住光球，把墙一排排打碎。砖里偶尔掉出加宽和分球。',
      tags: ['街机'],
      score: 'high',
      cover: 'assets/covers/shatter.svg'
    },
    {
      slug: 'core',
      title: '守核',
      en: 'Core',
      blurb: '绕着核心旋转，把冲过来的碎片打掉。别让它们碰到中心。',
      tags: ['街机'],
      score: 'high',
      cover: 'assets/covers/core.svg'
    },
    {
      slug: 'pairs',
      title: '翻牌',
      en: 'Pairs',
      blurb: '十六张牌。记住纹样，用更少的步数把它们配完。',
      tags: ['记忆'],
      score: 'low',
      cover: 'assets/covers/pairs.svg'
    }
  ];

  function formatScore(game, value, emptyText) {
    var n = Math.floor(Number(value) || 0);
    if (!n) return emptyText == null ? '' : emptyText;
    var shown;
    if (n >= 1000000) shown = (Math.round(n / 100000) / 10) + 'm';
    else if (n >= 10000) shown = (Math.round(n / 100) / 10) + 'k';
    else shown = String(n);
    if (game && game.score === 'low') return '最少 ' + shown + ' 步';
    return '最好 ' + shown;
  }

  window.GAMES = list;
  window.formatScore = formatScore;
})();
