import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/SectionHeader";
import { Section } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { NewsCover } from "@/components/content/NewsCover";
import { getNewsNeighbours, getNewsPost } from "@/lib/content";
import { formatDate, newsCategoryLabel, readingLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post) return { title: "动态不存在" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post) notFound();

  const { prev, next } = await getNewsNeighbours(slug);

  return (
    <>
      {/* 文章头 */}
      <header className="border-b border-line pb-12 pt-12 sm:pt-16">
        <Container>
          <Link
            href="/news"
            className="type-label-sm group inline-flex items-center gap-3 text-faint transition-colors duration-300 hover:text-fg"
          >
            <svg
              viewBox="0 0 16 8"
              className="h-2 w-4 rotate-180 overflow-visible"
              fill="none"
            >
              <path
                d="M0 4h13M10 1l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
              />
            </svg>
            返回赛事动态
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="type-label-sm text-cap" data-numeric>
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

          <h1 className="type-h1 mt-6 max-w-[26ch]">{post.title}</h1>

          {post.excerpt && (
            <p className="type-lead mt-6 max-w-[56ch]">{post.excerpt}</p>
          )}

          <NewsCover
            slug={post.slug}
            date={post.date}
            category={post.category}
            className="mt-10 aspect-[21/9] w-full"
          />
        </Container>
      </header>

      {/* 正文 */}
      <Section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article
              className="prose-capu lg:col-span-8"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                {post.tags.length > 0 && (
                  <div>
                    <p className="type-label-sm text-faint">标签</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="type-label-sm rounded-chip border border-line px-2.5 py-1.5 text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 border-t border-line pt-6">
                  <p className="type-label-sm text-faint">发布信息</p>
                  <dl className="mt-4 space-y-2.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[0.8125rem] text-muted">发布时间</dt>
                      <dd className="text-[0.8125rem]" data-numeric>
                        {post.date}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[0.8125rem] text-muted">分类</dt>
                      <dd className="text-[0.8125rem]">
                        {newsCategoryLabel(post.category)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="type-label-sm text-faint">下一步</p>
                  <div className="mt-4">
                    <Button href="/join" variant="primary" withArrow>
                      加入车队
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* 上下篇 */}
      {(prev || next) && (
        <Section className="border-t border-line py-12 sm:py-14">
          <Container>
            <div className="grid gap-px bg-line md:grid-cols-2">
              {[
                { label: "上一篇", post: prev, align: "left" as const },
                { label: "下一篇", post: next, align: "right" as const },
              ].map((item) => (
                <div key={item.label} className="bg-bg">
                  {item.post ? (
                    <Link
                      href={`/news/${item.post.slug}`}
                      className={`group flex h-full flex-col gap-3 p-6 ${
                        item.align === "right" ? "md:items-end md:text-right" : ""
                      }`}
                    >
                      <span className="type-label-sm text-faint">
                        {item.label}
                      </span>
                      <span className="text-[1.0625rem] font-medium leading-snug transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        {item.post.title}
                      </span>
                      <span
                        className="type-label-sm text-faint"
                        data-numeric
                      >
                        {formatDate(item.post.date)}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col gap-3 p-6">
                      <span className="type-label-sm text-faint">
                        {item.label}
                      </span>
                      <span className="text-[0.9375rem] text-faint">
                        已经是第一篇
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
