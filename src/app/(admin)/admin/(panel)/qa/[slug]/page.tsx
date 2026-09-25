import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getQaForEdit } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminQaEditorPage({ params }: PageProps) {
  const { slug } = await params;
  const isNew = slug === "new";

  const item = isNew ? null : await getQaForEdit(slug);
  if (!isNew && !item) notFound();

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/qa"
          className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
        >
          ← 返回 Q&amp;A 列表
        </Link>
        <h1 className="type-h2 mt-5">{isNew ? "新建问答" : "编辑问答"}</h1>
        {item && (
          <p className="type-label-sm mt-3 text-faint">
            文件位置 content/qa/{item.slug}.md
          </p>
        )}
      </div>

      <ContentEditor
        kind="qa"
        initial={
          item
            ? {
                slug: item.slug,
                markdown: item.markdown,
                fields: {
                  question: item.question,
                  category: item.category,
                  order: String(item.order),
                },
              }
            : undefined
        }
      />
    </div>
  );
}
