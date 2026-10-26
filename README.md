# 个人主页 · www.xlattice.top

纯静态站点,零依赖、零构建。托管 GitHub Pages(`Xlattice0` → 仓库 `xlattice0.github.io`),
域名 `xlattice.top`(NameSilo 购买,NS 已托管 Cloudflare)。

## 当前状态

| 项目 | 状态 |
|---|---|
| 域名注册 | ✅ NameSilo |
| NS 托管 | ✅ `harmony.ns.cloudflare.com` / `woz.ns.cloudflare.com` |
| `@` 和 `www` 解析 | ⚠️ **有两条橙云记录,源站是死的,现在访问返回 520** |
| 邮件收发 | ✅ Cloudflare Email Routing 已开(MX = `route1-3.mx.cloudflare.net`),**别动 MX / SPF** |
| CAA 记录 | 无,不会影响 Let's Encrypt 签证书 |
| 站点代码 | ✅ 域名与用户名已填好,只剩个人内容 |

**结论:域名侧完全就绪,唯一要修的是那两条 520 记录。** 剩下就是把文件推上去。

## 最终配置(已写进文件)

| 项 | 值 |
|---|---|
| 主域(canonical) | `https://www.xlattice.top` |
| 备用跳转 | `xlattice.top` → 301 → `www.xlattice.top` |
| GitHub 仓库 | `Xlattice0/xlattice0.github.io` |
| GitHub Pages 地址 | `https://xlattice0.github.io/` |
| DNS 目标 | `xlattice0.github.io` |

---

## 文件结构

```
.
├── index.html          主页(唯一需要改内容的文件)
├── 404.html            自定义 404
├── .nojekyll           关掉 Jekyll 处理(别删)
├── assets/
│   ├── style.css       全部样式,顶部是颜色变量
│   ├── app.js          主题切换 / 年份 / 滚动淡入
│   └── favicon.svg     标签页图标
└── README.md           本文件,可删
```

> **故意不放 `CNAME` 文件**:自定义域名在 GitHub 设置里填,GitHub 自动生成正确的 CNAME。
> 手动塞错一个会报 `domain is already taken`。

---

## 第 1 步:改成你自己的内容

域名和 GitHub 用户名都填好了,只剩个人资料:

| 搜索 | 换成 | 出现次数 |
|---|---|---|
| `你的名字` | 你的名字或昵称 | 4 |
| `N`(`.brand-mark` 里的 logo 字母) | 你名字首字母 | 1 |
| `you@example.com` | 你的邮箱 | 4 |
| `[X] 年`、`[城市]`、`[公司 / 在做的事]` | 真实信息 | 各 1 |
| 三个 `.card` 项目 | 你的项目 | 3 |
| 三条 `.list` 笔记 | 你的文章(先当占位也行) | 3 |

**顺便白拿一个邮箱**:Cloudflare → Email → Email Routing 加一个目标地址,就能用
`hello@xlattice.top` 收发信,免费,不用改 MX。填进页面前先确认那个地址能收到邮件。

## 第 2 步:推到 GitHub

先在 GitHub 网页上建一个**空仓库**,名字必须叫 `xlattice0.github.io`(用户站点专用名,
不要建 README),然后再本地推:

```bash
cd 解压后的目录
git init
git add .
git commit -m "init: personal site"
git branch -M main
git remote add origin https://github.com/Xlattice0/xlattice0.github.io.git
git push -u origin main
```

仓库必须 **public**——免费账号的 Pages 只能从公开仓库发布。

## 第 3 步:开启 Pages 并先验证

仓库 → **Settings → Pages**

- Source:`Deploy from a branch`
- Branch:`main`,目录 `/ (root)`
- Save

等 1 分钟,打开 `https://xlattice0.github.io/`。**这一步必须能看到页面**,再往下做 DNS;
否则后面所有 522 都是这里没发成功引起的。

## 第 4 步:改 Cloudflare DNS(关键)

Cloudflare → `xlattice.top` → **DNS → Records**。

先处理那两条橙云的 A 记录(520 的元凶):直接**删掉**,或在同一条上改成下面这样。
目标是:

| 类型 | 名称 | 内容 | 代理状态 |
|---|---|---|---|
| CNAME | `www` | `xlattice0.github.io` | **仅 DNS(灰云)** |
| CNAME | `@` | `xlattice0.github.io` | **仅 DNS(灰云)** |

四个要点:

1. **末尾不带仓库名**,是 `xlattice0.github.io`,不是 `xlattice0.github.io/xxx`。
2. **先灰云**。GitHub 必须直连源站才能签发证书,橙云会挡住验证。
3. 根域用 CNAME 成立,是因为 Cloudflare 支持**根域展平**;用 A 记录也行,指向
   `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`。
4. **MX、TXT(SPF)、`_dmarc` 一条都别动**,那是邮件用的。

## 第 5 步:绑定域名 + 开 HTTPS

1. Settings → Pages → **Custom domain** 填 `www.xlattice.top` → Save
2. 等 GitHub 签发 Let's Encrypt 证书(几分钟,最长 24 小时)。用命令看进度:

   ```bash
   nslookup www.xlattice.top 1.1.1.1
   curl -I https://www.xlattice.top
   ```

3. 证书就绪后 **Enforce HTTPS** 变为可勾选,勾上。

完成后 `http://xlattice.top` 会被 GitHub 301 到 `https://www.xlattice.top`,
`www` 和不带 `www` 都能用。

## 第 6 步(可选):开 Cloudflare 代理

想用 CDN / 缓存 / WAF,再把灰云点成橙云,**同时**必须改:

**SSL/TLS → Overview → Full (strict)**

选 Flexible 会无限 301(`ERR_TOO_MANY_REDIRECTS`),这套组合最经典的坑。
开了代理后再开 **SSL/TLS → Edge Certificates → Always Use HTTPS**。

CAA 可以不加;要加必须包含 `letsencrypt.org`,否则 GitHub 续证书会失败。

---

## 常见问题

**访问 520 / 522**
520 = 记录指向的服务不存在(当前状态);522 = Cloudflare 到 GitHub 超时。
先确认第 3 步的 `github.io` 地址能打开,再核对 CNAME 值有没有多写路径。

**525 / 526**
SSL 模式不对或证书还没签好。GitHub Pages 用正规 Let's Encrypt,选 **Full (strict)** 就能过;
若仍报错,通常是自定义域名还没验证完,回第 5 步等。

**报 `domain is already taken`**
这个域名曾被别的 GitHub 账号占用。按提示加一条 TXT:
`_github-pages-challenge-Xlattice0`(值 GitHub 会给),验证通过后重试。

**改动没生效**
Pages 构建有几十秒延迟,再加 Cloudflare 缓存。`Ctrl + F5` 或隐身窗口看;
必要时 Cloudflare → Caching → Purge Everything。

**国内访问慢 / 偶尔打不开**
GitHub Pages 的 IP 在国内不稳定,是正常现象,不是配置错误。

**.top 域名有什么坑**
没有 ICP 问题(服务器在境外,不备案)。唯一注意:`.top` 曾被大量垃圾站使用,
部分邮件网关对它的信任度偏低,发重要邮件前先测一下送达率。

**想加文章页**
复制 `index.html` 为 `posts/hello.html`,替换正文,再把笔记列表里的 `href="#"`
改成 `/posts/hello.html`。文章多了再考虑 Astro / Hexo。

## 许可

页面代码随便用,内容换成你自己的就行。
