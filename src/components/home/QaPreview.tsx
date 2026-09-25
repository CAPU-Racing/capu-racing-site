import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/ui/PageHero";
import { getFeaturedQa } from "@/lib/content";

/**
 * 首页 Q&A 精选。
 * 直接复用 /qa 的手风琴组件，保持同一套交互语言。
 */
export async function QaPreview() {
  const items = await getFeaturedQa(
    ["join-01", "systems-01", "basics-01", "growth-01"],
    4,
  );

  if (items.length === 0) return null;

  return (
    <Section id="qa">
      <Container wide>
        <SectionHeader
          index="04"
          label="Questions"
          title="你可能想问的"
          description="先把最常被问到的问题放在这里，完整问答在 Q&A 专区。"
          action={
            <Link
              href="/qa"
              className="group inline-flex items-center gap-3 text-[0.9375rem] text-muted transition-colors duration-300 hover:text-fg"
            >
              查看全部问答
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

        <Reveal className="mt-12">
          <Accordion
            items={items.map((item) => ({
              id: item.slug,
              question: item.question,
              html: item.html,
            }))}
            defaultOpenId={items[0]?.slug}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
