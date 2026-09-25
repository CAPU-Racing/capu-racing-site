import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getNewsForEdit } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminNewsEditorPage({ params }: PageProps) {
  const { slug } = await params;
  const isNew = slug === "new";

  const post = isNew ? null : await getNewsForEdit(slug);
  if (!isNew && !post) notFound();

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/news"
          className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
        >
          ← 返回赛事动态列表
        </Link>
        <h1 className="type-h2 mt-5">
          {isNew ? "新建动态" : "编辑动态"}
        </h1>
        {post && (
          <p className="type-label-sm mt-3 text-faint">
            文件位置 content/news/{post.slug}.md
          </p>
        )}
      </div>

      <ContentEditor
        kind="news"
        initial={
          post
            ? {
                slug: post.slug,
                markdown: post.markdown,
                fields: {
                  title: post.title,
                  date: post.date,
                  category: post.category,
                  excerpt: post.excerpt,
                  tags: post.tags.join(", "),
                },
              }
            : undefined
        }
      />
    </div>
  );
}
