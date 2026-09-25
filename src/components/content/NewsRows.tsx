import Link from "next/link";
import { cx } from "@/lib/motion";
import { formatDate, newsCategoryLabel } from "@/lib/format";
import type { NewsPost } from "@/lib/content";

/**
 * 紧凑新闻列表。
 * 编辑排版：日期 / 标题 / 分类 / 箭头四栏对齐，
 * 悬停时标题右移、整行底部生长出一条成航蓝细线。
 * 用在首页摘要区。
 */
export function NewsRows({
  posts,
  className,
}: {
  posts: NewsPost[];
  className?: string;
}) {
  return (
    <ul className={cx("border-t border-line", className)}>
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-line">
          <Link
            href={`/news/${post.slug}`}
            className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-6 sm:grid-cols-[7rem_1fr_5rem_1.5rem] sm:gap-6 sm:py-7"
          >
            <span
              className="type-label-sm text-faint transition-colors duration-500 group-hover:text-cap"
              data-numeric
            >
              {formatDate(post.date)}
            </span>

            <span className="min-w-0">
              <span className="block text-[1.0625rem] font-medium leading-snug tracking-[-0.005em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 sm:text-[1.125rem]">
                {post.title}
              </span>
              <span className="mt-2 block max-w-[52ch] text-[0.875rem] leading-relaxed text-muted sm:hidden">
                {post.excerpt}
              </span>
            </span>

            <span className="type-label-sm hidden text-muted sm:block">
              {newsCategoryLabel(post.category)}
            </span>

            <span
              aria-hidden
              className="hidden justify-end text-faint transition-colors duration-500 group-hover:text-cap sm:flex"
            >
              <svg viewBox="0 0 16 8" className="h-2 w-4 overflow-visible" fill="none">
                <path
                  d="M0 4h13M10 1l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </svg>
            </span>

            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cap transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
