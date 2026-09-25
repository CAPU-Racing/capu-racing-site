import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SpecTable } from "@/components/ui/PageHero";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { ClimbMark, HorizonArc, SinceMark } from "@/components/ui/BrandMarks";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProcessRail } from "@/components/home/ProcessRail";
import { comparison, missionVision, processSteps, school, team, traits } from "@/lib/site";

export const metadata: Metadata = {
  title: "车队介绍",
  description:
    "成航CAPU大学生方程式车队的组建背景、使命愿景、工程实践流程，以及车队与普通兴趣社团的区别。",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="02"
        label="About the Team"
        titleLines={["一支把车", "造出来的队伍"]}
        lead={
          <>
            {team.name}依托{school.name}的航空工程背景组建。
            我们不把知识讲一遍，而是把问题交给你，让你在解决它的过程中变成工程师。
          </>
        }
        aside={
          <div className="flex h-full flex-col justify-end gap-6 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <ClimbMark className="h-8 w-14 text-cap" />
            <p className="type-label-sm max-w-[30ch] leading-relaxed text-muted">
              校徽中的飞机与地平线，是这所学校的起点；
              我们要做的是让另一台机器也动起来。
            </p>
            <SinceMark />
          </div>
        }
      />

      {/* 车队概况 */}
      <Section>
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader
                index="02.1"
                label="Profile"
                title="车队概况"
                description="下面这些是可核对的基本信息。未确认的数据我们不会写进来。"
              />
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <SpecTable
                  rows={[
                    { key: "车队全称", value: team.name },
                    { key: "英文名", value: team.nameEn },
                    { key: "所属院校", value: `${school.name}（${school.abbr}）` },
                    { key: "所在校区", value: `${school.campus} · ${school.address}` },
                    { key: "建队年份", value: `${team.founded} 年` },
                    { key: "参赛赛事", value: "中国大学生方程式汽车大赛（FSAE）" },
                    { key: "技术组别", value: "电控组 / 电池组 / 线束组 / 机械组" },
                    { key: "成员规模", value: `约 ${team.members} 人，跨专业跨年级` },
                  ]}
                />
                <p className="type-label-sm mt-4 leading-relaxed text-faint">
                  建队年份与成员规模以车队实际登记信息为准，可在{' '}
                  <code className="text-muted">src/lib/site.ts</code> 中统一修改。
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 使命与愿景 */}
      <Section theme="ink" className="overflow-hidden">
        <HorizonArc className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] text-cap-300 opacity-[0.16]" />
        <Container wide className="relative">
          <SectionHeader
            index="02.2"
            label="Mission & Vision"
            title="我们要做成什么"
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="type-label text-cap-300">使命 / Mission</p>
              <p className="mt-6 text-[1.375rem] font-medium leading-[1.55] tracking-[-0.01em] sm:text-[1.625rem]">
                {missionVision.mission}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="type-label text-cap-300">愿景 / Vision</p>
              <p className="mt-6 text-[1.375rem] font-medium leading-[1.55] tracking-[-0.01em] sm:text-[1.625rem]">
                {missionVision.vision}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 工程实践流程 */}
      <Section>
        <Container wide>
          <SectionHeader
            index="02.3"
            label="Engineering Process"
            title="设计到赛道之间，隔着六个阶段"
            description="每个赛季完整走一遍这套流程。真正的成长发生在「计划之外」的那部分——出问题、定位问题、修好它。"
          />
          <div className="mt-16">
            <ProcessRail />
          </div>
        </Container>
      </Section>

      {/* 与兴趣社团的区别 */}
      <Section className="border-t border-line">
        <Container wide>
          <SectionHeader
            index="02.4"
            label="Difference"
            title="为什么说这里不是社团"
            description="同样是一群学生聚在一起，但被评价的东西不一样。"
          />

          <Reveal className="mt-12">
            <div className="grid grid-cols-[6rem_1fr_1fr] gap-x-4 border-b border-line pb-3 sm:grid-cols-[8rem_1fr_1fr] sm:gap-x-6">
              <span className="type-label-sm text-faint">维度</span>
              <span className="type-label-sm text-faint">兴趣社团</span>
              <span className="type-label-sm text-cap">方程式车队</span>
            </div>
            {comparison.map((row) => (
              <div
                key={row.topic}
                className="grid grid-cols-[6rem_1fr_1fr] items-baseline gap-x-4 border-b border-line py-4 sm:grid-cols-[8rem_1fr_1fr] sm:gap-x-6 sm:py-5"
              >
                <span className="type-label-sm text-muted">{row.topic}</span>
                <span className="text-[0.875rem] leading-relaxed text-faint">
                  {row.club}
                </span>
                <span className="text-[0.9375rem] font-medium leading-relaxed">
                  {row.team}
                </span>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 适合什么样的人 */}
      <Section className="border-t border-line">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader
                index="02.5"
                label="Who Fits"
                title="适合什么样的人"
                description="我们不筛选已经有技能的人，只看这几件事。"
              />
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-px bg-line sm:grid-cols-2">
                {traits.map((trait, i) => (
                  <Reveal
                    key={trait.title}
                    delay={i * 0.06}
                    className="bg-bg p-6 sm:p-7"
                  >
                    <span
                      className="type-label text-cap"
                      data-numeric
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-[1.0625rem] font-medium">
                      {trait.title}
                    </h3>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                      {trait.desc}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 底部 CTA */}
      <Section className="border-t border-line">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="type-label text-faint">下一步</p>
              <h2 className="type-h1 mt-4 max-w-[20ch]">
                想了解更多？去看每个组具体做什么
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/systems" size="lg" variant="primary" withArrow>
                查看四个组别
              </Button>
              <Button href="/join" size="lg" variant="outline">
                直接报名
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
            <span className="type-label-sm text-faint">
              共 {processSteps.length} 个工程阶段
            </span>
            <span className="type-label-sm text-faint">
              共 {comparison.length} 项差异对比
            </span>
            <Link
              href="/qa"
              className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
            >
              还有疑问？看 Q&amp;A →
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
