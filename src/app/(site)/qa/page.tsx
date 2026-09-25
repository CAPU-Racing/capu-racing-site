import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { QaExplorer } from "@/components/content/QaExplorer";
import { getQaByCategory, getQaItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Q&A 问答专区",
  description:
    "关于成航CAPU大学生方程式车队的常见问题：车队在做什么、零基础能不能加入、各组别的工作内容与学习路径、能获得什么成长。",
};

export default async function QaPage() {
  const [groups, items] = await Promise.all([getQaByCategory(), getQaItems()]);

  return (
    <>
      <PageHero
        index="04"
        label="Questions & Answers"
        titleLines={["常见问题"]}
        lead="这里收录了报名前最常被问到的内容。按分类筛选，或直接搜关键词。"
        aside={
          <div className="flex h-full flex-col justify-end gap-4 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <dl className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">收录问题</dt>
                <dd className="text-[0.9375rem]" data-numeric>
                  {items.length} 条
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">分类</dt>
                <dd className="text-[0.9375rem]" data-numeric>
                  {groups.length} 类
                </dd>
              </div>
            </dl>
            <p className="type-label-sm max-w-[32ch] leading-relaxed text-faint">
              内容持续补充。没找到答案的问题，欢迎通过「联系我们」提交。
            </p>
          </div>
        }
      />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Container wide>
          <div className="pt-10">
            <QaExplorer
              groups={groups.map((group) => ({
                id: group.id,
                label: group.label,
                labelEn: group.labelEn,
                description: group.description,
                items: group.items.map((item) => ({
                  slug: item.slug,
                  question: item.question,
                  html: item.html,
                  plain: item.plain,
                })),
              }))}
            />
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h2 className="type-h1 max-w-[24ch]">还有疑问？直接来问我们</h2>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" size="lg" variant="primary" withArrow>
                联系我们
              </Button>
              <Button href="/join" size="lg" variant="outline">
                直接报名
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
