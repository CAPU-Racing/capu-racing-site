"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { NewsCover } from "@/components/content/NewsCover";
import { cx, springSnappy } from "@/lib/motion";
import { formatDate, newsCategoryLabel, readingLabel } from "@/lib/format";
import type { NewsCategory } from "@/lib/content-meta";

export type NewsCard = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  readingMinutes: number;
};

const PAGE_SIZE = 5;

/**
 * 赛事动态列表。
 * 分类筛选与分页都在前端完成：文章数量不大，
 * 这样切换分类是即时的，不需要整页刷新。
 */
export function NewsExplorer({
  posts,
  categories,
}: {
  posts: NewsCard[];
  categories: { id: NewsCategory; label: string }[];
}) {
  const [active, setActive] = useState<NewsCategory | "all">("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const reduced = useReducedMotion();

  const filtered = useMemo(
    () => (active === "all" ? posts : posts.filter((post) => post.category === active)),
    [posts, active],
  );

  const visible = filtered.slice(0, limit);
  const hasMore = filtered.length > visible.length;

  const tabs = [
    { id: "all" as const, label: "全部", count: posts.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.label,
      count: posts.filter((post) => post.category === category.id).length,
    })),
  ];

  return (
    <div>
      {/* 分类筛选 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-line">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActive(tab.id);
                setLimit(PAGE_SIZE);
              }}
              className={cx(
                "relative flex items-center gap-2 px-3 py-3 text-[0.875rem] transition-colors duration-300",
                isActive ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cx("type-label-sm", isActive ? "text-cap" : "text-faint")}
                data-numeric
              >
                {tab.count}
              </span>
              {isActive && (
                <motion.span
                  layoutId="news-tab"
                  className="absolute inset-x-2 -bottom-px h-px bg-cap"
                  transition={springSnappy}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 列表 */}
      {visible.length === 0 ? (
        <p className="border-b border-line py-16 text-muted">
          这个分类下暂时还没有内容。
        </p>
      ) : (
        <ul>
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((post, index) => (
              <motion.li
                key={post.slug}
                layout={reduced ? false : "position"}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduced ? 0 : Math.min(index, 5) * 0.04,
                }}
                className="border-b border-line"
              >
                <Link
                  href={`/news/${post.slug}`}
                  className="group grid grid-cols-1 gap-5 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-8"
                >
                  <NewsCover
                    slug={post.slug}
                    date={post.date}
                    category={post.category}
                    compact
                    className="hidden aspect-[16/9] sm:block"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span
                        className="type-label-sm text-faint transition-colors duration-500 group-hover:text-cap"
                        data-numeric
                      >
                        {formatDate(post.date)}
                      </span>
                      <span aria-hidden className="h-3 w-px bg-line-strong" />
                      <span className="type-label-sm text-muted">
                        {newsCategoryLabel(post.category)}
                      </span>
                      <span aria-hidden className="h-3 w-px bg-line-strong" />
                      <span className="type-label-sm text-faint">
                        {readingLabel(post.readingMinutes)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-[1.25rem] font-medium leading-snug tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 sm:text-[1.375rem]">
                      {post.title}
                    </h2>

                    <p className="mt-3 max-w-[64ch] text-[0.9375rem] leading-relaxed text-muted">
                      {post.excerpt}
                    </p>

                    <span className="type-label-sm mt-5 inline-flex items-center gap-2 text-faint transition-colors duration-500 group-hover:text-cap">
                      阅读全文
                      <svg
                        viewBox="0 0 16 8"
                        className="h-2 w-4 overflow-visible"
                        fill="none"
                      >
                        <path
                          d="M0 4h13M10 1l3 3-3 3"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="square"
                          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* 分页 */}
      {hasMore && (
        <div className="mt-10 flex items-center gap-6">
          <button
            type="button"
            onClick={() => setLimit((value) => value + PAGE_SIZE)}
            className="type-label-sm rounded-hair border border-line-strong px-5 py-3 text-muted transition-colors duration-300 hover:border-cap hover:text-cap"
          >
            加载更多
          </button>
          <span className="type-label-sm text-faint" data-numeric>
            {visible.length} / {filtered.length}
          </span>
        </div>
      )}
    </div>
  );
}
