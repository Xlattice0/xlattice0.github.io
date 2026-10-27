# XLattice's Game

自制小游戏站。纯静态,零依赖、零构建,托管在 GitHub Pages,
域名 `www.xlattice.top`(NameSilo 购买 → Cloudflare 解析)。

---

## 一、站点结构

```
.
├── index.html                游戏厅首页(游戏墙)
├── play.html                 游戏容器页:?g=游戏名
├── 404.html                  自定义 404
├── .nojekyll                 关掉 Jekyll(别删)
├── assets/
│   ├── style.css             全站样式
│   ├── app.js                首页逻辑(读清单 → 生成卡片)
│   ├── games.js              ★ 游戏清单,唯一要手动改的文件
│   └── favicon.svg           标签页图标
└── games/
    └── lattice/
        └── index.html        《晶格》游戏本体(单文件,自包含)
```

设计要点:

- **每个游戏是一个独立文件夹**,跑在 iframe 里,样式和脚本完全隔离。
  你以后用 Phaser、Unity 导出、甚至纯 DOM 写都行,互不干扰。
- **加游戏不用碰首页代码**,只改 `assets/games.js`。
- 封面是**纯 CSS 生成的**(渐变 + 晶格线 + 编号),不需要准备截图。
  以后想换成真图,给 `games.js` 里的对象加一个 `cover` 字段即可(见第四节)。
- 成绩存在浏览器 `localStorage`,键名 `xg:best:<游戏名>`,不上传、无账号。

---

## 二、加一个新游戏(三步)

**第 1 步:建文件夹**

在 `games/` 下建一个目录,名字只能用小写字母、数字、短横线,比如 `games/snake/`。
里面放一个 `index.html`,这就是游戏入口。它可以是单文件,也可以带 `style.css`、`game.js`、图片:

```
games/snake/
├── index.html
├── snake.js
└── cover.png
```

> 注意:游戏内部引用资源要用**相对路径**(`./snake.js`、`./cover.png`),
> 因为它最终运行在 `games/snake/` 这个地址下。

**第 2 步:在 `assets/games.js` 里登记**

打开 `assets/games.js`,照着第一条抄一个对象,加进数组:

```js
window.GAMES = [
  { /* 已有:晶格 */ },
  {
    slug: 'snake',                 // 必填,必须和文件夹名一致
    title: '贪吃蛇',                // 显示的名字
    en: 'Snake',                   // 封面上的英文小字,可省略
    tag: '街机',                    // 类型标签
    color: '#22c55e',              // 封面主色
    color2: '#064e3b',             // 封面副色(渐变终点)
    date: '2026-11'
  }
];
```

**第 3 步:推上去**

把改动的文件上传到 GitHub 仓库(或在本地 `git push`),等 1 分钟,
刷新 `https://www.xlattice.top/`,新游戏就出现在墙上了。

---

## 三、游戏和容器页的约定(可选但推荐)

`play.html` 会给游戏提供一个统一外框:返回按钮、标题、全屏、最好成绩。
游戏本身**不需要**知道这些。如果想让它把最新成绩同步到顶部信息条,
在游戏里发一条消息就行:

```js
window.parent.postMessage(
  { type: 'xg:score', slug: 'snake', score: 120, best: 480 },
  '*'
);
```

容器页收到后会自动更新"最好 480",不用刷新。
不写也没关系,只是顶部那栏不会实时变化。

---

## 四、想给游戏换真实截图做封面

默认封面是代码生成的。如果你有截图:

1. 把图片放进游戏目录,比如 `games/lattice/cover.jpg`
2. 在 `games.js` 的对应对象里加一行:

```js
cover: 'games/lattice/cover.jpg'
```

`app.js` 会优先用这张图当封面(建议 16:10,宽度 800px 左右,jpg 压缩后 < 200KB)。

---

## 五、本地预览

直接双击 `index.html` 就能看——**但这个站大量使用 `localStorage` 和 iframe,
用本地服务器更接近线上**:

```bash
# 任选一种,在站点根目录执行
npx serve .
# 或者
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

> 注意:`file://` 下部分浏览器会限制 iframe 和存储,线上不会有这个问题。

---

## 六、当前线上状态

| 项目 | 值 |
|---|---|
| 站点 | `https://www.xlattice.top` |
| 备用 | `https://xlattice.top` → 301 → www |
| 仓库 | `Xlattice0/xlattice0.github.io` |
| 托管 | GitHub Pages,分支 `main` / 根目录 |
| DNS | Cloudflare,`www` 与 `@` 均 CNAME 到 `xlattice0.github.io`(**灰云**) |
| 邮件 | Cloudflare Email Routing 正常(MX + SPF + DKIM 未动) |

### 关于 Cloudflare 橙云

现在是灰云(仅 DNS)。想开 CDN/缓存/防护可以点成橙云,但**必须**同时把
SSL/TLS 模式改成 **Full (strict)**,否则会出现 `ERR_TOO_MANY_REDIRECTS`。

### 什么时候需要重新构建

本站没有构建步骤,改完文件推上去就行。Pages 大约 30–60 秒生效,
浏览器有缓存就 `Ctrl + F5`。

---

## 七、《晶格》怎么玩

4×4 的格子,滑动(手机)或方向键(桌面)让所有方块往一个方向移动,
两个相同的数字撞在一起就合并成两倍。目标是把数字做到 2048,
或者把格子填满、再也动不了为止。

- 手机:在棋盘上滑动
- 桌面:方向键 / WASD / HJKL,也可以按住鼠标拖
- 分数实时写入本地,关掉浏览器也在

---

## 八、许可

代码随便用。游戏和内容是你的。
