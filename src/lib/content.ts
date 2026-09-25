import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import {
  NEWS_CATEGORIES,
  NEWS_CATEGORY_IDS,
  QA_CATEGORIES,
  QA_CATEGORY_IDS,
  type NewsCategory,
  type QaCategoryId,
} from "@/lib/content-meta";

/**
 * 内容读取层
 * ---------------------------------------------------------------------------
 * Q&A 与赛事动态以 Markdown 文件存放于 content/ 下，frontmatter 提供元数据。
 * 后台（/admin）的编辑操作直接写入这些文件，因此读取时不做长缓存，
 * 相关页面通过 force-dynamic 保证编辑后立刻生效。
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

/* ============================ Q&A ============================ */

// 分类常量与类型集中定义在 content-meta（零依赖模块），此处仅转出以保持既有引用可用。
// 客户端组件请直接从 @/lib/content-meta 导入，不要经由本模块，否则会引入 node:fs。
export { QA_CATEGORIES, QA_CATEGORY_IDS };
export type { QaCategoryId };

export type QaItem = {
  slug: string;
  question: string;
  category: QaCategoryId;
  order: number;
  /** Markdown 原文，供后台编辑 */
  markdown: string;
  /** 渲染后的 HTML，前端直接注入 */
  html: string;
  /** 纯文本，用于搜索与摘要 */
  plain: string;
};

function readDir(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".md") && !name.startsWith("_"));
  } catch {
    return [];
  }
}

/** 去除 Markdown 标记，得到用于搜索/摘要的纯文本 */
function toPlain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function renderMarkdown(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return String(file);
}

function asCategory(value: unknown): QaCategoryId {
  const raw = String(value ?? "").trim() as QaCategoryId;
  return QA_CATEGORY_IDS.includes(raw) ? raw : "basics";
}

export async function getQaItems(): Promise<QaItem[]> {
  const dir = path.join(CONTENT_ROOT, "qa");
  const files = readDir(dir);

  const items = await Promise.all(
    files.map(async (file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");

      return {
        slug,
        question: String(data.question ?? slug).trim(),
        category: asCategory(data.category),
        order: Number.isFinite(Number(data.order)) ? Number(data.order) : 999,
        markdown: content.trim(),
        html: await renderMarkdown(content.trim()),
        plain: toPlain(content),
      } satisfies QaItem;
    }),
  );

  const categoryRank = (id: QaCategoryId) => QA_CATEGORY_IDS.indexOf(id);

  return items.sort((a, b) => {
    const byCategory = categoryRank(a.category) - categoryRank(b.category);
    if (byCategory !== 0) return byCategory;
    if (a.order !== b.order) return a.order - b.order;
    return a.question.localeCompare(b.question, "zh-Hans-CN");
  });
}

export async function getQaByCategory() {
  const items = await getQaItems();
  return QA_CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0);
}

/** 首页精选：按给定 slug 取，取不到时用前若干条兜底 */
export async function getFeaturedQa(slugs: string[], fallbackCount = 4) {
  const items = await getQaItems();
  const picked = slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is QaItem => Boolean(item));

  if (picked.length >= fallbackCount) return picked.slice(0, fallbackCount);
  const rest = items.filter((item) => !picked.includes(item));
  return [...picked, ...rest].slice(0, fallbackCount);
}

/* ========================= 赛事动态 ========================= */

export { NEWS_CATEGORIES, NEWS_CATEGORY_IDS };
export type { NewsCategory };

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  tags: string[];
  markdown: string;
  html: string;
  plain: string;
  readingMinutes: number;
};

function asNewsCategory(value: unknown): NewsCategory {
  const raw = String(value ?? "").trim() as NewsCategory;
  return NEWS_CATEGORY_IDS.includes(raw) ? raw : "team";
}

function normalizeDate(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const dir = path.join(CONTENT_ROOT, "news");
  const files = readDir(dir);

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      const plain = toPlain(content);
      const tags = Array.isArray(data.tags)
        ? data.tags.map((tag: unknown) => String(tag))
        : [];

      return {
        slug,
        title: String(data.title ?? slug).trim(),
        date: normalizeDate(data.date),
        category: asNewsCategory(data.category),
        excerpt: String(data.excerpt ?? "").trim() || plain.slice(0, 84),
        tags,
        markdown: content.trim(),
        html: await renderMarkdown(content.trim()),
        plain,
        readingMinutes: Math.max(1, Math.round(plain.length / 350)),
      } satisfies NewsPost;
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const posts = await getNewsPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** 详情页上下篇导航 */
export async function getNewsNeighbours(slug: string) {
  const posts = await getNewsPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

/* ============================ 写入 ============================ */

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function assertSafeSlug(slug: string) {
  if (!SAFE_SLUG.test(slug)) {
    throw new Error("标识只能使用小写字母、数字与连字符，且需以字母或数字开头");
  }
  return slug;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export async function writeQaFile(
  slug: string,
  frontmatter: Record<string, unknown>,
  markdown: string,
) {
  assertSafeSlug(slug);
  const dir = path.join(CONTENT_ROOT, "qa");
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, `${slug}.md`),
    matter.stringify(`\n${markdown.trim()}\n`, frontmatter),
    "utf8",
  );
}

export async function writeNewsFile(
  slug: string,
  frontmatter: Record<string, unknown>,
  markdown: string,
) {
  assertSafeSlug(slug);
  const dir = path.join(CONTENT_ROOT, "news");
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, `${slug}.md`),
    matter.stringify(`\n${markdown.trim()}\n`, frontmatter),
    "utf8",
  );
}

export function deleteContentFile(kind: "qa" | "news", slug: string) {
  assertSafeSlug(slug);
  const target = path.join(CONTENT_ROOT, kind, `${slug}.md`);
  if (fs.existsSync(target)) fs.unlinkSync(target);
}

export function contentFileExists(kind: "qa" | "news", slug: string) {
  try {
    assertSafeSlug(slug);
  } catch {
    return false;
  }
  return fs.existsSync(path.join(CONTENT_ROOT, kind, `${slug}.md`));
}

/** 读取单条内容用于后台编辑 */
export async function getQaForEdit(slug: string) {
  const items = await getQaItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getNewsForEdit(slug: string) {
  const posts = await getNewsPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
