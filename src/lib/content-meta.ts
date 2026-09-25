/**
 * 内容分类元数据（纯数据，无副作用）
 * ---------------------------------------------------------------------------
 * 这个模块必须保持「零依赖」：不得引入 node:fs / node:path 等仅服务端可用的模块。
 * 原因：客户端组件（如后台编辑器、列表筛选器）也需要分类常量与类型，
 * 一旦它们从 lib/content.ts 取值，就会把文件系统读取逻辑打进客户端包并导致构建失败。
 *
 * 约定：
 *   - 需要读写 Markdown 内容 → 从 @/lib/content 导入
 *   - 只需要分类常量或分类相关类型 → 从 @/lib/content-meta 导入
 */

/* ============================ Q&A ============================ */

export type QaCategoryId = "basics" | "systems" | "join" | "growth";

export const QA_CATEGORIES: {
  id: QaCategoryId;
  label: string;
  labelEn: string;
  description: string;
}[] = [
  {
    id: "basics",
    label: "基础认知",
    labelEn: "Basics",
    description: "车队是什么、在做什么、和社团有什么区别",
  },
  {
    id: "systems",
    label: "组别详情",
    labelEn: "Systems",
    description: "四个组别分别做什么，各自需要什么基础",
  },
  {
    id: "join",
    label: "加入相关",
    labelEn: "Joining",
    description: "报名条件、时间投入、面试与培养方式",
  },
  {
    id: "growth",
    label: "成长收获",
    labelEn: "Growth",
    description: "能学到什么、对升学与就业有什么帮助",
  },
];

export const QA_CATEGORY_IDS = QA_CATEGORIES.map((category) => category.id);

/* ========================= 赛事动态 ========================= */

export type NewsCategory = "race" | "build" | "test" | "team";

export const NEWS_CATEGORIES: {
  id: NewsCategory;
  label: string;
  labelEn: string;
}[] = [
  { id: "race", label: "赛事", labelEn: "Race" },
  { id: "build", label: "制作", labelEn: "Build" },
  { id: "test", label: "测试", labelEn: "Test" },
  { id: "team", label: "车队", labelEn: "Team" },
];

export const NEWS_CATEGORY_IDS = NEWS_CATEGORIES.map((category) => category.id);
