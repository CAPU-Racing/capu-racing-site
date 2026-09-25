import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui/PageHero";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { JoinForm } from "@/components/join/JoinForm";
import { Reveal } from "@/components/ui/Reveal";
import { ClimbMark } from "@/components/ui/BrandMarks";
import { contact, joinSteps, school, team } from "@/lib/site";

export const metadata: Metadata = {
  title: "招新报名",
  description:
    "在线填写报名表加入成航CAPU大学生方程式车队。不限专业与年级，零基础可报，意向组别可暂不确定。",
};

export default function JoinPage() {
  return (
    <>
      <PageHero
        index="07"
        label="Join Us"
        titleLines={["加入车队"]}
        lead="整个流程不设笔试，也不要求你已经会什么。填张表，我们用一次见面交流来判断彼此是否合适。"
        aside={
          <div className="flex h-full flex-col justify-end gap-5 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <ClimbMark className="h-8 w-14 text-cap" />
            <dl className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">开放组别</dt>
                <dd className="text-[0.9375rem]">电控 / 电池 / 线束 / 机械</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">基础要求</dt>
                <dd className="text-[0.9375rem]">零基础可报</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="type-label-sm text-faint">专业限制</dt>
                <dd className="text-[0.9375rem]">无</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section>
        <Container wide>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* 左侧：流程与须知 */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeader
                  index="07.1"
                  label="Process"
                  size="md"
                  title="报名之后会发生什么"
                />

                <ol className="mt-8 border-t border-line">
                  {joinSteps.map((step) => (
                    <Reveal
                      key={step.step}
                      className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-5"
                    >
                      <span className="type-label text-cap" data-numeric>
                        {step.step}
                      </span>
                      <span>
                        <span className="block text-[1rem] font-medium">
                          {step.title}
                        </span>
                        <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted">
                          {step.desc}
                        </span>
                      </span>
                    </Reveal>
                  ))}
                </ol>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="type-label-sm text-faint">报名须知</p>
                  <ul className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-muted">
                    <li>
                      填写的信息只用于招新联系，不会对外公开，也不会用于其他用途。
                    </li>
                    <li>
                      以学业为主。任务安排会避开你的上课与考试时间，忙的时候提前说一声即可。
                    </li>
                    <li>
                      如果一周内没有收到联系，可以到
                      <Link
                        href="/contact"
                        className="text-cap underline decoration-cap/40 underline-offset-4"
                      >
                        联系我们
                      </Link>
                      页面催一下，可能是漏了。
                    </li>
                  </ul>
                </div>

                <p className="type-label-sm mt-8 leading-relaxed text-faint">
                  {team.name} · {school.campus}
                  <br />
                  {contact.location}
                </p>
              </div>
            </div>

            {/* 右侧：表单 */}
            <div className="lg:col-span-8">
              <div className="mb-8 flex items-center gap-4">
                <span className="type-label text-faint">报名表</span>
                <span aria-hidden className="h-px flex-1 bg-line" />
                <span className="type-label-sm text-faint">
                  带 <span className="text-cap">*</span> 为必填
                </span>
              </div>
              <JoinForm />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="ink" className="border-t border-line">
        <Container wide>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="type-h2 max-w-[26ch]">
                还没决定要不要报名？
              </h2>
              <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">
                先把 Q&amp;A 里关于时间投入、零基础、各组别工作内容的问题看一遍，
                再决定也不迟。报名表随时可以重新提交。
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
              <Link
                href="/qa"
                className="type-label-sm inline-flex h-12 items-center gap-3 rounded-hair border border-line-strong px-5 text-muted transition-colors duration-300 hover:border-cap-300 hover:text-cap-300"
              >
                查看 Q&amp;A
              </Link>
              <Link
                href="/systems"
                className="type-label-sm inline-flex h-12 items-center gap-3 rounded-hair border border-line-strong px-5 text-muted transition-colors duration-300 hover:border-cap-300 hover:text-cap-300"
              >
                了解四个组别
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
