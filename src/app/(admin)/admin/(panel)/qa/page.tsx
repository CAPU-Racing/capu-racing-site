import Link from "next/link";
import { deleteContentAction } from "@/app/(admin)/admin/actions";
import { QA_CATEGORIES, getQaItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminQaPage() {
  const items = await getQaItems();

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="type-h2">Q&amp;A 内容</h1>
          <p className="mt-3 text-[0.9375rem] text-muted" data-numeric>
            共 {items.length} 条 · 按分类与排序权重展示
          </p>
        </div>
        <Link
          href="/admin/qa/new"
          className="inline-flex h-11 items-center gap-3 rounded-hair bg-cap px-6 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-cap-700"
        >
          新建问答
        </Link>
      </div>

      {QA_CATEGORIES.map((group) => {
        const groupItems = items.filter((item) => item.category === group.id);

        return (
          <section key={group.id}>
            <div className="flex items-center gap-4">
              <h2 className="type-label text-faint">{group.label}</h2>
              <span aria-hidden className="h-px flex-1 bg-line" />
              <span className="type-label-sm text-faint" data-numeric>
                {groupItems.length} 条
              </span>
            </div>

            <div className="mt-5 border-t border-line">
              {groupItems.length === 0 && (
                <p className="border-b border-line py-6 text-[0.875rem] text-faint">
                  这个分类下还没有内容
                </p>
              )}

              {groupItems.map((item) => (
                <div
                  key={item.slug}
                  className="grid grid-cols-1 items-center gap-3 border-b border-line py-4 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-5"
                >
                  <span
                    className="type-label-sm text-faint"
                    data-numeric
                  >
                    {String(item.order).padStart(3, "0")}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[0.9375rem]">{item.question}</p>
                    <p className="type-label-sm mt-1.5 text-faint">
                      {item.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/qa/${item.slug}`}
                      className="type-label-sm text-muted transition-colors duration-300 hover:text-cap"
                    >
                      编辑
                    </Link>
                    <form action={deleteContentAction}>
                      <input type="hidden" name="kind" value="qa" />
                      <input type="hidden" name="slug" value={item.slug} />
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
          </section>
        );
      })}

      <p className="type-label-sm leading-relaxed text-faint">
        排序权重数字越小越靠前。新增的问答建议沿着分类内的序号继续排，
        避免插入后需要整体重排。
      </p>
    </div>
  );
}
