# 成航CAPU大学生方程式车队 · 官网

设计参考大厂官网的排版与动效手法，视觉语言取自学校的真实视觉资产。

## 设计依据

| 依据 | 来源 | 在站点中的体现 |
| --- | --- | --- |
| 成航蓝 `#0059AA` | 从学校官方校徽 PNG 取样得到的标准色 | 全站主色 |
| 校徽构成：飞机 + 地平线 + 1965 | 学校官方校徽 | 地平线弧线母题、爬升飞机图形、页脚年份标记 |
| 建校 1965 年 | 学校官网 | 页脚与车队介绍页的 `SINCE 1965` 标记 |
| 龙泉驿校区 · 车城东七路 699 号 | 学校官网 | 联系页方位图、车队简介 |
| 校区位于成都经开区汽车产业带 | 学校官网 / 公开信息 | 「联系我们」页的区位说明 |
| 校徽大写无衬线英文 | 学校官方校徽 | Inter + IBM Plex Mono 的等宽标签体系 |

官方校徽文件位于 `public/brand/`，其中 `cap-emblem.png` 同时作为站点图标。

## 技术栈

- **Next.js 15**（App Router、Server Actions）
- **TypeScript**
- **Tailwind CSS 4**（`@theme` 设计令牌 + 语义化主题切换）
- **Framer Motion** 负责入场、滚动联动、布局动画
- **Markdown** 内容管线：`gray-matter` + `remark` + `remark-gfm`
- 无数据库依赖：内容存 Markdown 文件，报名数据存 JSONL

## 目录结构

```
content/
  qa/             Q&A 条目（Markdown + frontmatter）
  news/           赛事动态（Markdown + frontmatter）
  **/_*.md        以 _ 开头的文件为模板，不会被读取
data/
  applications.jsonl   报名数据（每行一条 JSON，已 gitignore）
docs/
  DEPLOYMENT.md   部署与运维
  CONTENT.md      内容维护（改文案、改配置看这篇）
public/brand/    官方校徽
src/
  app/
    (site)/      面向访客的站点（含页头页脚）
    (admin)/     内容管理后台（含登录与鉴权）
  components/
    ui/          设计系统基础组件
    home/        首页区块
    content/     内容型组件（问答浏览器、动态列表、封面）
    join/        报名表单
    admin/       后台组件
  lib/           站点数据、内容读取、鉴权、存储、校验
  styles/globals.css   设计令牌与排版规则
```

## 本地运行

```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev
```

`npm run dev` 内存占用明显高于生产模式。若开发服务器首次编译就 OOM，
改用 `npm run build && npm run start`，或临时用 `NEXT_BUILD_CPUS=2` 限制构建 worker 数。

`.env.local` 需要填写：

| 变量 | 说明 | 生效时机 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 后台登录密码，**至少 4 位** | 运行期 |
| `ADMIN_SESSION_SECRET` | 会话签名密钥，**至少 16 位**随机字符串 | 运行期 |
| `NEXT_PUBLIC_SITE_URL` | 站点地址，用于 sitemap / canonical / OG | **构建期** ⚠️ |

生成随机密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

两个注意点：

- **长度不足会静默禁用后台**。不满足最小长度时 `/admin` 会显示配置引导页
  而不是报错，容易被误判成「密码记错了」。
- **`NEXT_PUBLIC_SITE_URL` 改了必须重新构建**。它会被 Next 在构建期内联进产物，
  运行期修改不生效。仓库里的 `.env.local` 目前是开发用的 `http://localhost:3100`，
  上线前记得改成真实域名并重新 `npm run build`。

## 内容维护

两种方式，效果完全一致：

1. **后台**：访问 `/admin`，登录后可增删改赛事动态与 Q&A，支持 Markdown 实时预览。
   预览走的是与前台相同的渲染管线，因此所见即所得。
2. **直接改文件**：编辑 `content/news/*.md` 或 `content/qa/*.md`。

### 赛事动态 frontmatter

```yaml
---
title: 文章标题
date: 2026-09-01
category: race | build | test | team
excerpt: 列表页展示的摘要，留空会自动截取正文
tags: [标签一, 标签二]
---
```

### Q&A frontmatter

```yaml
---
question: 问题标题
category: basics | systems | join | growth
order: 10          # 数字越小越靠前
---
```

`content/qa/_template.md` 与 `content/news/_template.md` 是可直接复制的模板。

当前 Q&A 共 **20 条**，已按车队问答文档原文录入，分类分布为：
基础认知 4 · 组别详情 5 · 加入相关 7 · 成长收获 4。

完整的字段说明、分类枚举、排序规则、常见坑，见 **[`docs/CONTENT.md`](./docs/CONTENT.md)**。

> 改完内容**不需要重新构建，也不需要重启进程**——内容页是按请求实时读取文件的。
> 但 `src/lib/site.ts` 里的配置（公告、联系方式、组别介绍等）是编译进产物的，
> 改完需要重新 `npm run build`。

## 需要车队确认的真实数据

以下位置目前是占位值，请统一替换（`src/lib/site.ts` 中已用 `PLACEHOLDER`
注释标出，搜索这个关键字即可定位）：

| 文件 | 内容 |
| --- | --- |
| `src/lib/site.ts` → `team.founded` | 建队年份 |
| `src/lib/site.ts` → `team.seasons` | 参赛赛季数 |
| `src/lib/site.ts` → `team.members` | 现役成员规模 |
| `src/lib/site.ts` → `contact` | 邮箱、电话、公众号、QQ 群、B 站、二维码 |
| `content/news/*.md` | 三条动态目前是按常见场景写的草稿，请核对日期与细节后替换为真实记录 |

同时请核对 `src/lib/site.ts` 中 `systems` 的组别描述是否与车队实际情况一致。

> 这些数据改完需要重新 `npm run build`，因为它们编译在产物里（不是运行时读取）。

## 文档

| 文档 | 内容 |
| --- | --- |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | 部署、运维、备份、升级回滚、故障排查、上线检查清单 |
| [`docs/CONTENT.md`](./docs/CONTENT.md) | 内容维护：改文案、改配置、分类与排序规则、常见坑 |

## 部署

```bash
npm run build
npm start          # 默认监听 0.0.0.0:3000
```

完整部署说明（Node / PM2 / systemd / Windows / Docker、Nginx 与 HTTPS、
备份恢复、升级回滚、故障排查、上线检查清单）见
**[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)**。

三个必须记住的前提：

- **必须常驻一个 Node 进程**：后台 `/admin` 直接读写服务器文件，
  且内容页是 `force-dynamic`，不能当纯静态站（`output: export`）部署。
- **`content/` 与 `data/` 必须可写且持久化**：否则容器重建/发版会丢报名数据与内容改动。
  `data/applications.jsonl` 含个人信息，已加入 `.gitignore`，不要提交。
- **`NEXT_PUBLIC_SITE_URL` 是构建期内联的**：改域名后必须重新 `npm run build`，
  只重启进程不生效（已实测：同一产物用不同域名启动，sitemap 输出完全相同）。

> ⚠️ **不要用 `next dev` 验证部署。** 它内存占用远高于 `next start`，
> 且终端被回收后会变成**孤儿进程**持续监视项目、反复重编译，
> 把生产用的 `.next` 覆盖成开发产物，导致线上所有 `/_next/static/chunks/*.js`
> 返回 400、页面报 `ChunkLoadError`。验证一律用 `npm run build` + `npm run start`。

若日后改用数据库，只需替换 `src/lib/store.ts` 中三个导出函数的实现。

## 动效原则（避免「模板感」的具体约束）

- 禁用：紫蓝渐变、emoji 图标、大面积玻璃拟态、通用三卡片套路
- 采纳：1px 发丝分隔线、2–4px 小圆角、等宽字体标签、章节编号、蓝图网格、工程制图标注
- 入场动效统一使用 `cubic-bezier(0.16, 1, 0.3, 1)`，位移量控制在 8–24px，且只播放一次
- 无限滚动的技术栈条用 CSS 动画跑在合成层，不占用主线程
- 数字滚动通过 MotionValue 直接写入 DOM，不触发 React 重渲染
- 全站尊重 `prefers-reduced-motion`，开启后所有动效降级为静态呈现
