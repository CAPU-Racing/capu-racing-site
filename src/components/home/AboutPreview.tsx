import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/ui/PageHero";
import { ClimbMark } from "@/components/ui/BrandMarks";
import { comparison, missionVision, processSteps, school } from "@/lib/site";
import { ProcessRail } from "@/components/home/ProcessRail";

/**
 * 首页：车队定位区。
 * 用一个对比表把「车队 ≠ 兴趣社团」讲清楚，
 * 再用滚动的工程流程轨道说明这支队伍实际在做什么。
 */
export function AboutPreview() {
  return (
    <Section id="about">
      <Container wide>
        <SectionHeader
          index="02"
          label="About the Team"
          titleLines={["不是兴趣社团", "是一支工程团队"]}
          description={
            <>
              {school.name}的{/* 车队全称由页脚与页头呈现，此处只讲定位 */}
              <strong className="font-medium text-fg">CAPU 车队</strong>
              ，每个赛季的目标只有一个：把一台能上赛道的车做出来。
            </>
          }
          action={
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-[0.9375rem] text-muted transition-colors duration-300 hover:text-fg"
            >
              了解车队
              <svg viewBox="0 0 16 8" className="h-4 w-4 overflow-visible" fill="none">
                <path
                  d="M0 4h13M10 1l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </svg>
            </Link>
          }
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* 使命陈述 */}
          <div className="lg:col-span-5">
            <Reveal>
              <ClimbMark className="h-8 w-14 text-cap" />
              <p className="mt-7 text-[1.375rem] font-medium leading-[1.5] tracking-[-0.01em] sm:text-[1.5rem]">
                {missionVision.mission}
              </p>
              <p className="mt-7 border-t border-line pt-7 text-[0.9375rem] leading-relaxed text-muted">
                {missionVision.vision}
              </p>
            </Reveal>
          </div>

          {/* 对比表 */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-[7rem_1fr_1fr] gap-x-5 border-b border-line pb-3 sm:grid-cols-[8rem_1fr_1fr]">
                <span className="type-label-sm text-faint">维度</span>
                <span className="type-label-sm text-faint">兴趣社团</span>
                <span className="type-label-sm text-cap">车队</span>
              </div>

              {comparison.map((row, i) => (
                <div
                  key={row.topic}
                  className="grid grid-cols-[7rem_1fr_1fr] items-baseline gap-x-5 border-b border-line py-4 sm:grid-cols-[8rem_1fr_1fr]"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span className="type-label-sm text-muted">{row.topic}</span>
                  <span className="text-[0.875rem] leading-relaxed text-faint">
                    {row.club}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed font-medium">
                    {row.team}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* 工程流程 */}
        <div className="mt-24">
          <div className="mb-12 flex items-center gap-4">
            <span className="type-label text-faint">工程流程</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <span className="type-label-sm text-faint">
              每个赛季走完 {processSteps.length} 个阶段
            </span>
          </div>
          <ProcessRail />
        </div>
      </Container>
    </Section>
  );
}
