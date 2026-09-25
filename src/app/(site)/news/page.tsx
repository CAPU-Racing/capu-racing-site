import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { NewsExplorer } from "@/components/content/NewsExplorer";
import { NEWS_CATEGORIES, getNewsPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "赛事动态",
  description:
    "成航CAPU大学生方程式车队的比赛记录、整车制作进度、测试结果与车队活动动态。",
};

export default async function NewsPage() {
  const posts = await getNewsPosts();

  return (
    <>
      <PageHero
        index="05"
        label="News & Updates"
        titleLines={["赛事动态"]}
        lead="设计冻结、零件加工、整车测试、赛道复盘——每个赛季发生的事都记在这里，包括没做好的部分。"
        aside={
          <div className="flex h-full flex-col justify-end gap-4 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <dl className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">收录动态</dt>
                <dd className="text-[0.9375rem]" data-numeric>
                  {posts.length} 条
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">最新更新</dt>
                <dd className="text-[0.9375rem]" data-numeric>
                  {posts[0]?.date.replaceAll("-", ".") ?? "—"}
                </dd>
              </div>
            </dl>
            <p className="type-label-sm max-w-[30ch] leading-relaxed text-faint">
              按发布时间倒序排列，支持按分类筛选。
            </p>
          </div>
        }
      />

      <Section>
        <Container wide>
          <NewsExplorer
            posts={posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              date: post.date,
              category: post.category,
              excerpt: post.excerpt,
              readingMinutes: post.readingMinutes,
            }))}
            categories={NEWS_CATEGORIES.map((category) => ({
              id: category.id,
              label: category.label,
            }))}
          />
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="type-label text-faint">下一步</p>
              <h2 className="type-h1 mt-4 max-w-[22ch]">
                想成为下一台车的参与者？
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/join" size="lg" variant="primary" withArrow>
                在线报名
              </Button>
              <Button href="/systems" size="lg" variant="outline">
                了解组别
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
