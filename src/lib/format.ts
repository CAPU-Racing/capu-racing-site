import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/content-meta";

/** 2026-08-18 → 2026.08.18（等宽数字下的稳定排版） */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

/** 2026-08-18 → 08 / 18 */
export function formatDateParts(date: string) {
  const [year, month, day] = date.split("-");
  return { year, month, day };
}

const CATEGORY_LABEL = new Map(
  NEWS_CATEGORIES.map((category) => [category.id, category.label]),
);

export function newsCategoryLabel(id: NewsCategory) {
  return CATEGORY_LABEL.get(id) ?? "动态";
}

/** 中文按字符数估算阅读时长更贴近实际 */
export function readingLabel(minutes: number) {
  return `${minutes} 分钟阅读`;
}
