import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { NewsRows } from "@/components/content/NewsRows";
import { getNewsPosts } from "@/lib/content";
import { joinSteps, team } from "@/lib/site";
import { HorizonArc, ClimbMark } from "@/components/ui/BrandMarks";
import { Section } from "@/components/ui/PageHero";

/** 首页：赛事动态摘要 */
export async function NewsPreview() {
  const posts = (await getNewsPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Section id="news">
      <Container wide>
        <SectionHeader
          index="05"
          label="News & Updates"
          title="赛事动态"
          description="比赛记录、整车测试与车队活动的第一手信息。"
          action={
            <Link
              href="/news"
              className="group inline-flex items-center gap-3 text-[0.9375rem] text-muted transition-colors duration-300 hover:text-fg"
            >
              查看全部动态
              <svg viewBox="0 0 16 8" className="h-2 w-4 overflow-visible" fill="none">
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

        <Reveal className="mt-12">
          <NewsRows posts={posts} />
        </Reveal>
      </Container>
    </Section>
  );
}

/** 首页：招新转化区（深色区段，复用校徽的地平线母题） */
export function JoinBanner() {
  return (
    <Section theme="ink" className="overflow-hidden">
      <HorizonArc
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] text-cap-300 opacity-25"
        withAircraft
      />

      <Container wide className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-muted">
              <span className="type-label text-cap-300" data-numeric>
                07
              </span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span className="type-label">Join Us</span>
            </div>

            <h2 className="type-h1 mt-6">想加入车队？</h2>

            <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-muted">
              报名不看已有技能，只看你愿不愿意学、愿不愿意做。
              整个流程不设笔试，我们更想在交流里听你说说想做什么。
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/join"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-hair bg-cap-300 px-7 text-[0.9375rem] font-medium text-ink transition-colors duration-300 hover:bg-white"
              >
                <span className="relative z-10">在线报名</span>
                <svg
                  viewBox="0 0 16 8"
                  className="relative z-10 h-2 w-4 overflow-visible"
                  fill="none"
                >
                  <path
                    d="M0 4h13M10 1l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="square"
                    className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  />
                </svg>
              </Link>
              <Link
                href="/qa"
                className="type-label-sm inline-flex h-14 items-center px-2 text-muted transition-colors duration-300 hover:text-fg"
              >
                还有疑问？先看 Q&amp;A
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
              <ClimbMark className="h-7 w-12 shrink-0 text-cap-300" />
              <p className="type-label-sm max-w-[38ch] leading-relaxed text-faint">
                {team.name} · {joinSteps.length} 步完成加入流程
              </p>
            </div>
          </div>

          {/* 流程时间线 */}
          <div className="lg:col-span-6 lg:pl-8">
            <ol className="border-t border-line">
              {joinSteps.map((step, i) => (
                <Reveal
                  key={step.step}
                  delay={i * 0.08}
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-6"
                >
                  <span className="type-label text-cap-300" data-numeric>
                    {step.step}
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] font-medium">
                      {step.title}
                    </span>
                    <span className="mt-2 block max-w-[42ch] text-[0.875rem] leading-relaxed text-muted">
                      {step.desc}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
