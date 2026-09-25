import Link from "next/link";
import { getNewsPosts, getQaItems, QA_CATEGORIES } from "@/lib/content";
import { listApplications } from "@/lib/store";
import { intentOptions } from "@/lib/site";

export const dynamic = "force-dynamic";

const intentLabel = new Map<string, string>(
  intentOptions.map((option) => [option.value as string, option.label]),
);

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const body = (
    <>
      <span className="type-label-sm text-faint">{label}</span>
      <span
        className="mt-4 block text-[2rem] font-semibold leading-none tracking-[-0.03em]"
        data-numeric
      >
        {value}
      </span>
    </>
  );

  return href ? (
    <Link href={href} className="block bg-bg p-6 transition-colors duration-300 hover:bg-surface">
      {body}
    </Link>
  ) : (
    <div className="bg-bg p-6">{body}</div>
  );
}

export default async function AdminDashboardPage() {
  const [posts, qaItems, applications] = await Promise.all([
    getNewsPosts(),
    getQaItems(),
    Promise.resolve(listApplications()),
  ]);

  const recent = applications.slice(0, 8);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="type-h2">概览</h1>
        <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
          内容以 Markdown 文件保存在
          <code className="mx-1 text-fg">content/</code>
          目录，报名数据保存在
          <code className="mx-1 text-fg">data/applications.jsonl</code>。
          建议把这两处一起纳入版本管理与定期备份。
        </p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="赛事动态" value={posts.length} href="/admin/news" />
        <Stat label="Q&A 条目" value={qaItems.length} href="/admin/qa" />
        <Stat label="招新报名" value={applications.length} />
        <Stat label="问答分类" value={QA_CATEGORIES.length} />
      </div>

      {/* 最近报名 */}
      <section>
        <div className="flex items-center gap-4">
          <h2 className="type-label text-faint">最近的报名</h2>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="type-label-sm text-faint" data-numeric>
            共 {applications.length} 条
          </span>
        </div>

        {recent.length === 0 ? (
          <p className="glass-panel rounded-card mt-6 border border-line p-6 text-[0.9375rem] text-muted">
            还没有报名记录。表单提交后会出现在这里。
          </p>
        ) : (
          <div className="glass-panel rounded-card mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[52rem] border-collapse text-left">
              <thead>
                <tr>
                  {["提交时间", "姓名", "年级 / 专业", "联系方式", "意向组别", "编号"].map(
                    (head) => (
                      <th
                        key={head}
                        className="type-label-sm border-b border-line px-5 py-3 text-faint"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td
                      className="border-b border-line px-5 py-3.5 text-[0.8125rem] text-muted"
                      data-numeric
                    >
                      {item.createdAt.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="border-b border-line px-5 py-3.5 text-[0.875rem]">
                      {item.name}
                    </td>
                    <td className="border-b border-line px-5 py-3.5 text-[0.8125rem] text-muted">
                      {item.grade} / {item.college}
                    </td>
                    <td
                      className="border-b border-line px-5 py-3.5 text-[0.8125rem] text-muted"
                      data-numeric
                    >
                      {item.phone}
                      <br />
                      {item.wechat}
                    </td>
                    <td className="border-b border-line px-5 py-3.5 text-[0.8125rem]">
                      {intentLabel.get(item.intent) ?? item.intent}
                    </td>
                    <td
                      className="type-label-sm border-b border-line px-5 py-3.5 text-faint"
                      data-numeric
                    >
                      {item.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="type-label-sm mt-4 text-faint">
          完整数据请直接读取 data/applications.jsonl，每行一条 JSON。
        </p>
      </section>

      {/* 内容速览 */}
      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="type-label text-faint">最新动态</h2>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <Link
              href="/admin/news"
              className="type-label-sm text-muted transition-colors duration-300 hover:text-cap"
            >
              管理
            </Link>
          </div>
          <ul className="mt-5 border-t border-line">
            {posts.slice(0, 5).map((post) => (
              <li key={post.slug} className="border-b border-line py-3.5">
                <Link
                  href={`/admin/news/${post.slug}`}
                  className="flex items-baseline justify-between gap-5"
                >
                  <span className="text-[0.875rem]">{post.title}</span>
                  <span
                    className="type-label-sm shrink-0 text-faint"
                    data-numeric
                  >
                    {post.date}
                  </span>
                </Link>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="border-b border-line py-3.5 text-[0.875rem] text-muted">
                暂无内容
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <h2 className="type-label text-faint">Q&A 条目</h2>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <Link
              href="/admin/qa"
              className="type-label-sm text-muted transition-colors duration-300 hover:text-cap"
            >
              管理
            </Link>
          </div>
          <ul className="mt-5 border-t border-line">
            {qaItems.slice(0, 5).map((item) => (
              <li key={item.slug} className="border-b border-line py-3.5">
                <Link
                  href={`/admin/qa/${item.slug}`}
                  className="flex items-baseline justify-between gap-5"
                >
                  <span className="text-[0.875rem]">{item.question}</span>
                  <span className="type-label-sm shrink-0 text-faint">
                    {QA_CATEGORIES.find((c) => c.id === item.category)?.label}
                  </span>
                </Link>
              </li>
            ))}
            {qaItems.length === 0 && (
              <li className="border-b border-line py-3.5 text-[0.875rem] text-muted">
                暂无内容
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
