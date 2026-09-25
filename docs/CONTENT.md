# 内容维护文档

怎么改这个站点上的内容：Q&A、赛事动态、公告、联系方式、组别介绍等。

> 部署、运维、故障排查看 [`DEPLOYMENT.md`](./DEPLOYMENT.md)。

---

## 1. 速查表：想改什么，去哪里改

| 想改的东西 | 去哪改 |
| --- | --- |
| 某条 Q&A 的问答内容 | `/admin` 后台，或 `content/qa/*.md` |
| 新增 / 删除一条 Q&A | 同上 |
| Q&A 分类的**名称**（基础认知 / 组别详情 / …） | `src/lib/content-meta.ts` → `QA_CATEGORIES` |
| 某篇赛事动态 | `/admin` 后台，或 `content/news/*.md` |
| 赛事动态分类的名称（赛事 / 制作 / 测试 / 车队） | `src/lib/content-meta.ts` → `NEWS_CATEGORIES` |
| 顶部公告 | `src/lib/site.ts` → `announcement` |
| 联系方式、邮箱、电话、公众号、QQ 群、B 站 | `src/lib/site.ts` → `contact` |
| 导航菜单 | `src/lib/site.ts` → `nav` 与 `ctaNav` |
| 首页数据（建队年份 / 赛季数 / 成员数 / 组别数） | `src/lib/site.ts` → `team` 与 `teamStats` |
| 四个组别的介绍（首页卡片 + `/systems` 详情） | `src/lib/site.ts` → `systems` |
| 报名表单的年级 / 意向组别选项 | `src/lib/site.ts` → `gradeOptions` / `intentOptions` |
| 报名流程四步说明 | `src/lib/site.ts` → `joinSteps` |
| 工程流程六步（设计 → 开发 → …） | `src/lib/site.ts` → `processSteps` |
| 「车队 vs 普通社团」对比表 | `src/lib/site.ts` → `comparison` |
| 使命与愿景 | `src/lib/site.ts` → `missionVision` |
| 「适合什么样的人」 | `src/lib/site.ts` → `traits` |
| 首页 Q&A 精选显示哪 4 条 | `src/components/home/QaPreview.tsx` 里的 slug 数组 |
| SEO 标题 / 描述 / 关键词 | `src/lib/site.ts` → `siteMeta` |
| 校徽与站点图标 | `public/brand/cap-emblem.png` |
| 报名表单的字段与校验规则 | `src/lib/validation.ts` |
| 主题色、字体、间距 | `src/styles/globals.css` |

---

## 2. 两种改法，选一个

| | 后台 `/admin` | 直接改 Markdown 文件 |
| --- | --- | --- |
| 适合谁 | 不熟悉 git 的成员 | 开发者 |
| 优点 | 有实时预览，预览与前台渲染完全一致 | 有版本历史、可评审、可批量改 |
| 缺点 | 需要手动同步回仓库，否则会和 `git pull` 冲突 | 需要本地环境 |
| 生效时间 | 保存后立即生效（无需重启、无需重新构建） | 保存后立即生效（同上） |
| 影响范围 | 只能改 Q&A 与赛事动态 | 任何内容 |

> **两者改的是同一批文件**，不会不同步，但注意别同时改同一条。
> 混用时的注意事项见 [`DEPLOYMENT.md` 第 6 节](./DEPLOYMENT.md#6-内容怎么更新两条流程别混用)。

改完内容**不需要重新构建，也不需要重启进程**——内容页是按请求实时读取文件的。

---

## 3. 目录与文件规则

```
content/
  qa/      问答条目
    _template.md     以 _ 开头 → 不会被读取，可放心当模板用
    basics-01.md
    systems-01.md
    …
  news/    赛事动态
    _template.md
    2026-recruitment.md
    …
```

几条硬规则：

1. **文件名（slug）只能用小写字母、数字、连字符**，必须以字母或数字开头，最长 80 字符。
   即正则在 `src/lib/content.ts` 里是 `^[a-z0-9][a-z0-9-]{0,79}$`。
   后台新建时如果填了非法字符会被拒绝并给出提示。
2. **以 `_` 开头的文件会被忽略**，适合放模板或草稿。
3. **只读取 `.md` 文件**，其他扩展名无效。
4. **子目录不会被递归读取**，`content/qa/子文件夹/x.md` 读不到。
5. **slug 改了等于新增一条**：旧 slug 的链接（如 `/news/old-slug`）会变成 404。

---

## 4. Q&A 维护

### frontmatter 字段

```yaml
---
question: 没有基础可以加入车队吗？
category: join        # 四选一，见下表
order: 1              # 数字越小越靠前，留空默认 999
---

正文用 Markdown 写。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `question` | 是 | 问题标题。未填时用文件名兜底 |
| `category` | 是 | 见下表。**填了不在表里的值会静默归到「基础认知」** |
| `order` | 否 | 同分类内的排序权重，越小越靠前；不填为 999 |

### 分类枚举

| `category` 值 | 显示名称 | 含义 |
| --- | --- | --- |
| `basics` | 基础认知 | 车队是什么、在做什么、和社团有什么区别 |
| `systems` | 组别详情 | 四个组别分别做什么，各自需要什么基础 |
| `join` | 加入相关 | 报名条件、时间投入、面试与培养方式 |
| `growth` | 成长收获 | 能学到什么、对升学与就业有什么帮助 |

### 排序规则

先按**分类顺序**（基础认知 → 组别详情 → 加入相关 → 成长收获），
同分类内再按 `order` 升序，最后按问题文本排序。

所以 `order` 只需要在**同一分类内**保持唯一和递进即可，不必全局唯一。

### 新增一条问答

**后台**：`/admin/qa` → 「新建问答」→ 填标题、标识（slug）、分类、排序权重、正文 → 「创建」。

**直接改文件**：复制 `content/qa/_template.md` 改名为 `xxx-01.md`，填好 frontmatter 与正文。

> 建议命名沿用「分类缩写-序号」的习惯（`join-02`、`systems-03`），
> 便于一眼看出它属于哪个分类、排在第几位。

### 调整顺序

改 `order` 的数字即可，例如想让某条排到最前，把它改成比同分类内最小值更小的数。
后台列表页底部也提示了这一点。

---

## 5. 赛事动态维护

### frontmatter 字段

```yaml
---
title: 招新启动：四个技术组别同时开放报名
date: 2026-09-16              # 建议 YYYY-MM-DD
category: team                 # race | build | test | team
excerpt: 列表页展示的摘要，留空会自动截取正文前 84 字
tags: [招新, 报名]             # 可省略
---
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题，未填时用文件名兜底 |
| `date` | 是 | 发布日期。非 `YYYY-MM-DD` 格式会尝试解析，解析失败则取当天 |
| `category` | 是 | 见下表。**非法值会静默归到「车队」** |
| `excerpt` | 否 | 留空时自动从正文截取，去掉 Markdown 标记后的前 84 字 |
| `tags` | 否 | 字符串数组，会显示在详情页 |

### 分类枚举

| `category` 值 | 显示名称 |
| --- | --- |
| `race` | 赛事 |
| `build` | 制作 |
| `test` | 测试 |
| `team` | 车队 |

### 排序与阅读时长

- 列表按 `date` **倒序**排（新的在前），不依赖文件名。
- 详情页的「X 分钟阅读」按正文纯文本长度 ÷ 350 自动估算，中文下比较接近实际。

### 新增一篇动态

**后台**：`/admin/news` → 「新建动态」→ 填标题、标识、日期、分类、摘要、标签、正文 → 「创建」。

**直接改文件**：复制 `content/news/_template.md` 改名，建议用 `2026-09-descriptive-name.md`。

---

## 6. Markdown 支持范围

渲染管线是 `remark` + `remark-gfm`，因此支持：

| 语法 | 说明 |
| --- | --- |
| `## 二级标题` | Q&A 与动态正文都常用，会渲染成小标题 |
| `**加粗**` | 用来强调关键句 |
| `- 列表` / `1. 列表` | 无序与有序列表 |
| `> 引用` | 适合放提示或注意事项 |
| 表格 | GFM 表格，见下例 |
| `~~删除线~~` | GFM |
| `- [ ] 任务` | GFM 任务列表 |
| `[文字](https://…)` | 链接 |
| `` `代码` `` 与 ``` 围栏代码块 ``` | 行内代码与代码块 |

表格写法（注意第二行是分隔行，不能省）：

```markdown
| 组别 | 定位 | 典型工作 |
| --- | --- | --- |
| 电控组 | 控制中枢 | VCU、BMS、电机控制 |
```

**不支持**：HTML 内联（会被原样输出为文本）、脚注、数学公式、图片说明文字。
需要配图时，把图片放到 `public/` 下，用 `![说明](/图片文件名.png)` 引用。

---

## 7. 站点配置（`src/lib/site.ts`）怎么改

这是全站结构化内容的唯一来源，改完**需要重新构建**才生效（`npm run build`）。

### 顶部公告

```ts
export const announcement = {
  enabled: true,                                      // 设为 false 整条不显示
  id: "2026-recruit",                                 // 换公告时改这里
  label: "公告",
  text: "2026 赛季招新进行中：…",                      // 桌面端文案
  textShort: "2026 赛季招新进行中，四个组别同时开放报名。", // 移动端文案（窄屏会截断）
  href: "/join",                                      // 整条可点击跳转
};
```

- **换一条新公告时请改 `id`**（例如 `"2026-race-result"`）。已点过关闭的访客会重新看到新公告；`id` 不变则不会再次打扰他们。
- `textShort` 是给窄屏用的，因为 `text` 在手机上会被截断成省略号。

### 联系方式

```ts
export const contact = {
  email: "…",
  phone: "…",
  location: "…",
  address: school.address,
  channels: [
    { label: "微信公众号", value: "成航CAPU方程式车队", note: "招新通知首发渠道", qr: null },
    // …
  ],
  visitNote: "…",
};
```

- `channels[].qr` 填图片路径（如 `"/brand/qr-wechat.png"`）时显示二维码；留 `null` 会显示「二维码待补充」。
- 图片请放到 `public/brand/` 下，引用时写 `/brand/文件名`（`public` 不出现在路径里）。

### 组别介绍

`systems` 数组，每个元素对应一个组别：

| 字段 | 用途 |
| --- | --- |
| `code` | 编号，如 `SYS-01`，会显示在卡片与详情页 |
| `slug` | 锚点标识，`/systems#electronics` 用它跳转 |
| `name` / `nameEn` | 中文名与英文名 |
| `role` | 一句话定位（首页卡片） |
| `tagline` | 卡片上的一句话描述 |
| `glyph` | 线性图标，四选一：`ecu` / `battery` / `harness` / `chassis` |
| `intro` | 详情页开头段落 |
| `work[]` | 工作内容，`{ title, desc }` 数组 |
| `stack[]` | 技术栈关键词数组 |
| `path[]` | 学习路径，`{ step, title, desc }` 数组 |
| `basics[]` | 所需基础（对零基础同学最重要的一段） |
| `faq[]` | 该组常见疑问，`{ q, a }` 数组 |

### 首页数据

```ts
export const team = {
  founded: 2017,   // 建队年份  ← 待确认
  seasons: 6,      // 参赛赛季数 ← 待确认
  members: 60,     // 成员规模  ← 待确认
};
```

`teamStats` 是首页数据条的展示配置。注意里面 `animated: false` 的项不做数字滚动动效
（用于年份这类不该出现中间值的数字）。

### 导航

```ts
export const nav: NavItem[] = [
  { index: "01", href: "/", label: "首页", labelEn: "Home" },
  // …
];
```

- `index` 是显示在链接前的编号，新增时记得**顺延后面的编号**，否则会重号。
- 增删导航项后，移动端菜单会自动跟着变（它渲染的是同一个数组）。
- `ctaNav` 是右上角那个主按钮，`index` 默认 `07`。

---

## 8. 文案规范

`guide.md` 要求**所有面向用户的文案符合广告法**，避免极限用语。写文案时注意：

| 不要用 | 可以改成 |
| --- | --- |
| 最好、最佳、最强、第一、唯一 | 领先的、注重…的 |
| 国家级、世界级、顶级 | （直接删掉，或写具体的赛事名称） |
| 100%、绝对、保证 | 尽力、通常会 |
| 独家、首创 | 自研、自主设计 |

另外站点的既有语气是**克制、具体、不喊口号**（例如「从『不会』到让模块跑在赛车上」），
写新内容时建议保持一致。

---

## 9. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 后台新建 Q&A 提示标识非法 | slug 含大写字母、中文或空格 | 只能用小写字母、数字、连字符 |
| 新加的 Q&A 没出现在「组别详情」里 | `category` 值拼错，被静默归到「基础认知」 | 只能在 `basics` / `systems` / `join` / `growth` 里选 |
| 新加的动态跑到了「车队」分类 | `category` 值不合法 | 只能在 `race` / `build` / `test` / `team` 里选 |
| 改了 `site.ts` 但页面没变 | `site.ts` 是编译进产物的，不是运行时读取 | 重新 `npm run build` 后重启进程 |
| 改了 `content/*.md` 但页面没变 | 多半是中间有代理/CDN 缓存了 HTML | 对 HTML 与 `/admin` 关闭缓存，见部署文档第 5 节 |
| 后台改完过几天内容又变回去了 | 服务器上的改动没同步回仓库，被一次 `git pull` 覆盖 | 见部署文档第 6 节 |
| 折叠的正文里出现多余的 `<` `>` | 写了 HTML 标签，本管线不支持内联 HTML | 改用 Markdown 语法 |
| 表格没渲染成表格 | 漏了第二行分隔行 `\| --- \| --- \|` | 补上分隔行 |
| 页面出现「示例内容 / 请替换」字样 | 早期脚手架残留 | 在 `/admin` 里删掉那行引用块 |

---

## 10. 待车队确认的占位数据

以下位置的数值目前是**占位值**，上线前请统一替换。`src/lib/site.ts` 中都已用
`PLACEHOLDER` 注释标出，搜索这个关键字即可定位。

| 位置 | 内容 |
| --- | --- |
| `site.ts` → `team.founded` | 建队年份 |
| `site.ts` → `team.seasons` | 参赛赛季数 |
| `site.ts` → `team.members` | 现役成员规模 |
| `site.ts` → `contact.email` | 车队邮箱（当前是 `capu-racing@example.com`） |
| `site.ts` → `contact.phone` | 咨询电话（当前是 `028-0000 0000`） |
| `site.ts` → `contact.channels` | QQ 群号、公众号、B 站账号与二维码 |
| `site.ts` → `systems` | 各组的工作内容与技术栈是否与车队实际一致 |
| `content/news/*.md` | 三条动态目前是按常见场景写的草稿，请核对日期与细节 |
