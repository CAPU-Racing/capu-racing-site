import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { StatsBand } from "@/components/home/StatsBand";
import { HomeHero } from "@/components/home/HomeHero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { SystemsShowcase } from "@/components/home/SystemsShowcase";
import { QaPreview } from "@/components/home/QaPreview";
import { JoinBanner, NewsPreview } from "@/components/home/HomeSections";
import { systems } from "@/lib/site";

// 首页包含 Q&A 与动态摘要，后台改完内容需要立刻生效，因此不做静态化
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsBand />
      <AboutPreview />

      {/* 03 组别速览 */}
      <Section id="positions">
        <Container wide>
          <SectionHeader
            index="03"
            label="Four Systems"
            title="四个组别，一台整车的四个方向"
            description="选组别之前不必先决定人生方向：先看每个组实际在做什么，再挑一个你愿意为之花时间的。"
          />
        </Container>
        <div className="mt-14">
          <Container wide>
            <SystemsShowcase />
          </Container>
          <div className="mt-8">
            <Container wide>
              <Reveal className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <p className="type-label-sm text-faint">
                  共 {systems.length} 个技术组别 · 均接受零基础报名
                </p>
                <p className="type-label-sm text-faint">
                  报名时可选择「暂不确定」，由车队协助判断
                </p>
              </Reveal>
            </Container>
          </div>
        </div>
      </Section>

      <QaPreview />
      <NewsPreview />
      <JoinBanner />
    </>
  );
}
