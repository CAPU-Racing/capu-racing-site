import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/PageHero";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SystemGlyph } from "@/components/ui/CarSchematic";
import { systems } from "@/lib/site";

export const metadata: Metadata = {
  title: "组别介绍",
  description:
    "电控组、电池组、线束组、机械组的工作内容、技术栈、学习路径与常见疑问，帮助你判断适合自己的方向。",
};

/** 组间协作：谁交付什么、和谁对接、依赖什么 */
const interfaces = [
  {
    code: "SYS-01",
    name: "电控组",
    deliverable: "整车控制逻辑、报文矩阵、数据记录",
    peer: "电池组（BMS 报文）、线束组（针脚定义）、机械组（传感器安装点）",
    depends: "依赖各组提供准确的接口定义",
  },
  {
    code: "SYS-02",
    name: "电池组",
    deliverable: "电池箱体、模组、高压回路与安全策略",
    peer: "电控组（采集与均衡）、线束组（高压与低压走线）、机械组（箱体固定）",
    depends: "依赖机械组给出的整车载荷与安装空间",
  },
  {
    code: "SYS-03",
    name: "线束组",
    deliverable: "整车线束、连接器定义表、走线路径",
    peer: "全部组别——所有电气连接都要经过线束组",
    depends: "依赖各组冻结接口后才进入制作",
  },
  {
    code: "SYS-04",
    name: "机械组",
    deliverable: "车架、悬架、转向、制动与整车装配",
    peer: "各组的安装点需求、电池箱体、线束路径",
    depends: "依赖各组尽早提出安装与空间需求",
  },
] as const;

export default function SystemsPage() {
  return (
    <>
      <PageHero
        index="03"
        label="Four Systems"
        titleLines={["四个组别", "一台整车的四个方向"]}
        lead="选组别之前不必先决定人生方向。先看每个组实际在做什么、需要什么基础，再挑一个你愿意为之花时间的。"
        aside={
          <nav
            aria-label="组别快速导航"
            className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            <p className="type-label-sm text-faint">快速定位</p>
            <ul className="mt-4 space-y-2.5">
              {systems.map((system) => (
                <li key={system.slug}>
                  <a
                    href={`#${system.slug}`}
                    className="group flex items-baseline gap-3 text-[0.9375rem] text-muted transition-colors duration-300 hover:text-fg"
                  >
                    <span className="type-label-sm text-faint" data-numeric>
                      {system.code.slice(-2)}
                    </span>
                    <span>{system.name}</span>
                    <span className="type-label-sm text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {system.role}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {/* 总览 */}
      <Section>
        <Container wide>
          <SectionHeader
            index="03.1"
            label="Overview"
            title="先看整体，再看细节"
            description="四个组不是并列的四个社团：它们在同一个赛季里互相交付，最后装到同一台车上。"
          />

          <Reveal className="mt-12">
            <div className="grid grid-cols-[5.5rem_1fr_1fr] gap-x-4 border-b border-line pb-3 sm:grid-cols-[6rem_7rem_1fr] sm:gap-x-6">
              <span className="type-label-sm text-faint">代号</span>
              <span className="type-label-sm text-faint">组别</span>
              <span className="type-label-sm text-faint">定位与一句话说明</span>
            </div>
            {systems.map((system) => (
              <a
                key={system.slug}
                href={`#${system.slug}`}
                className="group grid grid-cols-[5.5rem_1fr_1fr] items-baseline gap-x-4 border-b border-line py-5 transition-colors duration-300 hover:bg-surface sm:grid-cols-[6rem_7rem_1fr] sm:gap-x-6"
              >
                <span className="type-label text-cap" data-numeric>
                  {system.code}
                </span>
                <span className="text-[1.0625rem] font-medium">
                  {system.name}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-muted">
                  <span className="text-fg">{system.role}</span>
                  <span aria-hidden className="mx-2 text-faint">
                    /
                  </span>
                  {system.tagline}
                </span>
              </a>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 各组详情 */}
      {systems.map((system, index) => (
        <section
          key={system.slug}
          id={system.slug}
          className="relative border-t border-line py-16 sm:py-20"
          style={{ scrollMarginTop: "96px" }}
        >
          <Container wide>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* 固定信息栏 */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <div className="flex items-center justify-between gap-4">
                    <span className="type-label text-cap" data-numeric>
                      {system.code}
                    </span>
                    <SystemGlyph
                      glyph={system.glyph}
                      className="h-10 w-14 shrink-0 text-faint"
                    />
                  </div>

                  <h2 className="type-h2 mt-6">{system.name}</h2>
                  <p className="type-label-sm mt-2.5 text-faint">
                    {system.nameEn}
                  </p>

                  <p className="type-label-sm mt-5 inline-block rounded-chip border border-line px-2.5 py-1 text-muted">
                    {system.role}
                  </p>

                  <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
                    {system.intro}
                  </p>

                  <div className="mt-8 border-t border-line pt-5">
                    <p className="type-label-sm text-faint">所需基础</p>
                    <ul className="mt-3.5 space-y-2.5">
                      {system.basics.map((item) => (
                        <li
                          key={item}
                          className="relative pl-4 text-[0.875rem] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className="absolute left-0 top-[0.7em] h-px w-2 bg-cap"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* 详情 */}
              <div className="space-y-14 lg:col-span-8">
                <div>
                  <h3 className="type-label text-faint">工作内容</h3>
                  <div className="mt-6 grid gap-px bg-line sm:grid-cols-2">
                    {system.work.map((item) => (
                      <div key={item.title} className="bg-bg p-5 sm:p-6">
                        <h4 className="text-[1rem] font-medium">
                          {item.title}
                        </h4>
                        <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="type-label text-faint">技术栈</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {system.stack.map((item) => (
                      <li
                        key={item}
                        className="type-label-sm rounded-chip border border-line px-2.5 py-1.5 text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="type-label text-faint">学习路径</h3>
                  <ol className="mt-6 border-t border-line">
                    {system.path.map((step) => (
                      <li
                        key={step.step}
                        className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[3rem_1fr]"
                      >
                        <span className="type-label text-cap" data-numeric>
                          {step.step}
                        </span>
                        <div>
                          <h4 className="text-[1rem] font-medium">
                            {step.title}
                          </h4>
                          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                            {step.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="type-label text-faint">常见疑问</h3>
                  <dl className="mt-6 space-y-7">
                    {system.faq.map((item) => (
                      <div
                        key={item.q}
                        className="border-l-2 border-cap pl-5"
                      >
                        <dt className="text-[1rem] font-medium">{item.q}</dt>
                        <dd className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                          {item.a}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <p className="type-label-sm text-faint">
                  {String(index + 1).padStart(2, "0")} / {String(systems.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* 组间协作 */}
      <Section theme="ink" className="border-t border-line">
        <Container wide>
          <SectionHeader
            index="03.3"
            label="Interfaces"
            title="四组怎么拼到同一台车上"
            description="车队的多数返工都出在接口上，所以我们把接口关系写成表，随时可查。"
          />

          <Reveal className="mt-12">
            <div className="hidden grid-cols-[6rem_1fr_1.4fr_1fr] gap-6 border-b border-line pb-3 lg:grid">
              <span className="type-label-sm text-faint">代号</span>
              <span className="type-label-sm text-faint">主要交付物</span>
              <span className="type-label-sm text-faint">对接组别 / 接口</span>
              <span className="type-label-sm text-faint">关键依赖</span>
            </div>
            {interfaces.map((row) => (
              <div
                key={row.code}
                className="grid gap-3 border-b border-line py-5 lg:grid-cols-[6rem_1fr_1.4fr_1fr] lg:gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="type-label text-cap-300" data-numeric>
                    {row.code}
                  </span>
                  <span className="text-[0.9375rem] font-medium">
                    {row.name}
                  </span>
                </div>
                <p className="text-[0.875rem] leading-relaxed text-muted">
                  {row.deliverable}
                </p>
                <p className="text-[0.875rem] leading-relaxed text-muted">
                  {row.peer}
                </p>
                <p className="text-[0.875rem] leading-relaxed text-faint">
                  {row.depends}
                </p>
              </div>
            ))}
          </Reveal>

          <p className="type-label-sm mt-8 flex items-center gap-3 leading-relaxed text-faint">
            <span aria-hidden className="h-px w-6 shrink-0 bg-line-strong" />
            接口定义表由线束组统一维护，任何改动需在组内同步后更新。
          </p>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="border-t border-line">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h2 className="type-h1 max-w-[22ch]">
              不确定选哪个？报名时可以填「暂不确定」
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button href="/join" size="lg" variant="primary" withArrow>
                在线报名
              </Button>
              <Button href="/qa" size="lg" variant="outline">
                查看 Q&amp;A
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
