# XLattice

个人小游戏站。纯静态，托管在 GitHub Pages，域名 `www.xlattice.top`。

打开首页就能看到游戏卡片。点「开始」进入某一款，成绩记在这台浏览器的 `localStorage` 里，键名是 `xg:best:<slug>`。

## 目录

```
index.html              游戏桌首页
play.html               游戏外框：?g=slug
404.html
CNAME                   www.xlattice.top
.nojekyll
assets/
  games.js              游戏清单
  app.js                首页卡片、搜索、筛选
  style.css             门户和游戏外框
  game.css              各款游戏共用的界面
  tokens.css            颜色
  boot.js               深浅色
  game-bridge.js        把成绩交给外框
  covers/               卡片封面
games/
  rush/                 晶格冲刺，横版跑跳
  lattice/              晶格，滑动合并
  shatter/              碎界，打砖
  core/                 守核
  pairs/                翻牌
```

每一款游戏都是自己文件夹里的 `index.html`，跑在 `play.html` 的 iframe 里。

## 本地预览

在仓库根目录开一个静态服务器（直接双击 `index.html` 时，部分浏览器会限制 iframe）：

```bash
python3 -m http.server 8000
```

浏览器打开 <http://localhost:8000>。

## 加一款游戏

1. 建 `games/<slug>/index.html`。`slug` 只用小写字母、数字和短横线。资源用相对路径。
2. 在 `assets/games.js` 的列表里追加一条：`slug`、`title`、`blurb`、`tags`、`score`（`"high"` 或 `"low"`）、`cover`。
3. 推到 `main`。GitHub Pages 从仓库根目录发布，通常一分钟内可以在站点上看到。

想让外框上的「最好」跟着变，在游戏里调用：

```js
XGame.publish('snake', score, best);
```

`game-bridge.js` 会写入本地，并通知 `play.html`。步数越少越好的游戏用 `score: "low"`。

## 部署

| 项目 | 值 |
|---|---|
| 站点 | https://www.xlattice.top |
| 备用 | https://xlattice.top 会跳到 www |
| 仓库 | https://github.com/Xlattice0/xlattice0.github.io |
| 托管 | GitHub Pages，`main` 分支的根目录 |
| DNS | Cloudflare，`www` 和 `@` CNAME 到 `xlattice0.github.io` |

现在是灰云（只做 DNS）。如果改成橙云，SSL/TLS 需要设成 **Full (strict)**，否则会 `ERR_TOO_MANY_REDIRECTS`。

没有构建步骤。改完推上去即可。页面有缓存时用强制刷新。

## 怎么玩

- **晶格冲刺**：方向键或 A/D 跑，空格跳跃。捡晶籽，踩裂片，过三关。
- **晶格**：方向键 / WASD，或在棋盘上滑动。相同数字合并。
- **碎界**：移动挡板，空格发射。铜砖会掉出强化。
- **守核**：旋转并射击，别让碎片碰到核心。
- **翻牌**：翻开两张相同的牌。步数越少越好。

## 许可

代码可以随便用。游戏和内容归你。
