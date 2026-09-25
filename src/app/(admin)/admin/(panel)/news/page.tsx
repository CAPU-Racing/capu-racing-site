import Link from "next/link";
import { deleteContentAction } from "@/app/(admin)/admin/actions";
import { NEWS_CATEGORIES, getNewsPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const posts = await getNewsPosts();

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="type-h2">赛事动态</h1>
          <p className="mt-3 text-[0.9375rem] text-muted" data-numeric>
            共 {posts.length} 条 · 按发布时间倒序展示
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex h-11 items-center gap-3 rounded-hair bg-cap px-6 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-cap-700"
        >
          新建动态
        </Link>
      </div>

      <div className="border-t border-line">
        {posts.length === 0 && (
          <p className="border-b border-line py-12 text-[0.9375rem] text-muted">
            还没有内容。点右上角「新建动态」开始。
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.slug}
            className="grid grid-cols-1 items-center gap-4 border-b border-line py-5 sm:grid-cols-[7rem_1fr_6rem_auto] sm:gap-6"
          >
            <span
              className="type-label-sm text-faint"
              data-numeric
            >
              {post.date}
            </span>

            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-medium">
                {post.title}
              </p>
              <p className="type-label-sm mt-1.5 text-faint">
                {post.slug}
              </p>
            </div>

            <span className="type-label-sm text-muted">
              {NEWS_CATEGORIES.find((c) => c.id === post.category)?.label}
            </span>

            <div className="flex items-center gap-4">
              <Link
                href={`/news/${post.slug}`}
                target="_blank"
                className="type-label-sm text-faint transition-colors duration-300 hover:text-fg"
              >
                查看 ↗
              </Link>
              <Link
                href={`/admin/news/${post.slug}`}
                className="type-label-sm text-muted transition-colors duration-300 hover:text-cap"
              >
                编辑
              </Link>
              <form action={deleteContentAction}>
                <input type="hidden" name="kind" value="news" />
                <input type="hidden" name="slug" value={post.slug} />
                <button
                  type="submit"
                  className="type-label-sm text-muted transition-colors duration-300 hover:text-signal"
                >
                  删除
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <p className="type-label-sm leading-relaxed text-faint">
        删除操作会直接移除 content/news/ 下对应的 Markdown 文件，且不可撤销。
        如果内容需要留存，建议改用 Git 回滚而不是依赖这里。
      </p>
    </div>
  );
}
