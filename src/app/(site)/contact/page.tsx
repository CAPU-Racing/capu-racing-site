import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/PageHero";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CornerTicks } from "@/components/ui/Motion";
import { contact, school, team } from "@/lib/site";

export const metadata: Metadata = {
  title: "联系我们",
  description:
    "成航CAPU大学生方程式车队的邮箱、微信公众号、QQ 咨询群、B 站账号与工作室位置。",
};

/** 校区示意图：不接第三方地图，用制图语言画一张方位图 */
function LocatorMap() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-line bg-surface">
      <CornerTicks className="z-10" />

      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-cap"
        fill="none"
        aria-hidden
      >
        {/* 路网 */}
        <path
          d="M-20 210 L420 90"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="12"
        />
        <path
          d="M-20 210 L420 90"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="10 12"
        />
        <path
          d="M120 250 L200 -10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="7"
        />
        {/* 网格参照 */}
        {[50, 100, 150, 200].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        ))}
        {/* 标记点 */}
        <circle cx="212" cy="158" r="15" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.2" />
        <circle cx="212" cy="158" r="4" fill="currentColor" fillOpacity="0.9" />
        <path
          d="M212 128 L212 104 M212 188 L212 212 M182 158 L158 158 M242 158 L268 158"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="type-label-sm text-faint">校区方位示意</span>
          <span className="type-label-sm text-cap" data-numeric>
            610100
          </span>
        </div>

        <div>
          <p className="type-label-sm text-faint">
            车城东七路 / CHECHENG EAST 7TH RD.
          </p>
          <p className="mt-2 max-w-[30ch] text-[0.875rem] font-medium">
            {school.campus} · {contact.location.split("·").pop()?.trim()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="06"
        label="Contact"
        titleLines={["联系我们"]}
        lead="咨询招新、合作或赞助，用下面任意一种方式都可以。招新期间公众号消息回复最快。"
        aside={
          <div className="flex h-full flex-col justify-end gap-5 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="type-label-sm text-faint">邮箱</p>
              <p className="mt-2 text-[0.9375rem]">{contact.email}</p>
            </div>
            <div>
              <p className="type-label-sm text-faint">所在校区</p>
              <p className="mt-2 text-[0.9375rem]">{school.address}</p>
            </div>
          </div>
        }
      />

      {/* 联系方式 */}
      <Section>
        <Container wide>
          <SectionHeader
            index="06.1"
            label="Channels"
            title="沟通渠道"
            description="招新咨询、技术交流、合作洽谈分别走不同渠道，能更快找到对的人。"
          />

          <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {contact.channels.map((channel, i) => (
              <Reveal
                key={channel.label}
                delay={i * 0.06}
                className="flex flex-col bg-bg p-6 sm:p-7"
              >
                <span className="type-label text-cap" data-numeric>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-[1.0625rem] font-medium">
                  {channel.label}
                </h3>
                <p className="mt-3 break-all text-[0.9375rem] text-fg">
                  {channel.value}
                </p>
                <p className="mt-auto pt-6 text-[0.8125rem] leading-relaxed text-muted">
                  {channel.note}
                </p>
                {!channel.qr && (
                  <span className="type-label-sm mt-4 text-faint">
                    二维码待补充
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 位置 */}
      <Section className="border-t border-line">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader
                index="06.2"
                label="Location"
                title="工作室位置"
                description={school.districtNote}
              />

              <dl className="mt-10 border-t border-line">
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="type-label-sm text-faint">校区</dt>
                  <dd className="text-[0.9375rem]">{school.campus}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="type-label-sm text-faint">地址</dt>
                  <dd className="text-[0.9375rem]">{school.address}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="type-label-sm text-faint">工作室</dt>
                  <dd className="text-[0.9375rem]">{contact.location}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="type-label-sm text-faint">来访</dt>
                  <dd className="text-[0.875rem] leading-relaxed text-muted">
                    {contact.visitNote}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <LocatorMap />
                <p className="type-label-sm mt-4 leading-relaxed text-faint">
                  示意图仅表示相对方位，不作为实际导航依据。
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 底部信息 */}
      <Section theme="ink" className="border-t border-line">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="type-label text-cap-300">Footer Notes</p>
              <h2 className="type-h2 mt-5 max-w-[28ch]">
                合作与赞助请联系车队邮箱
              </h2>
              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
                我们接受技术指导、加工资源与物料支持。具体需求可以邮件沟通，
                车队会提供完整的方案说明与回执。
              </p>
            </div>

            <dl className="type-label-sm space-y-3 text-faint md:text-right">
              <div>
                <dt className="inline">邮箱 </dt>
                <dd className="inline text-fg">{contact.email}</dd>
              </div>
              <div>
                <dt className="inline">电话 </dt>
                <dd className="inline text-fg" data-numeric>
                  {contact.phone}
                </dd>
              </div>
              <div>
                <dt className="inline">车队 </dt>
                <dd className="inline text-fg">{team.name}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}
