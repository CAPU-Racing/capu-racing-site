import Link from "next/link";
import { Emblem, EmblemRing, HorizonArc, SinceMark } from "@/components/ui/BrandMarks";
import { Container } from "@/components/ui/SectionHeader";
import { contact, ctaNav, nav, school, systems, team } from "@/lib/site";

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="type-label text-faint">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-ink relative overflow-hidden border-t border-line bg-bg text-fg">
      {/* 地平线母题作为页脚底层图形 */}
      <HorizonArc
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] text-accent opacity-[0.18]"
        withAircraft
      />

      <Container wide className="relative">
        <div className="grid gap-14 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <Emblem size={46} />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-[-0.01em]">
                  CAPU <span className="text-cap-300">RACING</span>
                </span>
                <span className="type-label-sm mt-1.5 text-faint">
                  {team.nameEn}
                </span>
              </div>
            </div>

            <p className="mt-7 max-w-[32ch] text-[1.0625rem] leading-relaxed text-muted">
              {team.slogan}
            </p>

            <div className="mt-8 flex items-center gap-6">
              <SinceMark />
              <span aria-hidden className="h-3 w-px bg-line-strong" />
              <span className="type-label-sm text-faint">
                依托 {school.abbr}航空工程背景
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <Column title="导航">
              <ul className="space-y-3">
                {[...nav, ctaNav].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-baseline gap-2 text-sm text-muted transition-colors duration-300 hover:text-fg"
                    >
                      <span className="type-label-sm text-faint" data-numeric>
                        {item.index}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Column>
          </div>

          <div className="md:col-span-2">
            <Column title="技术组别">
              <ul className="space-y-3">
                {systems.map((system) => (
                  <li key={system.slug}>
                    <Link
                      href={`/systems#${system.slug}`}
                      className="text-sm text-muted transition-colors duration-300 hover:text-fg"
                    >
                      {system.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Column>
          </div>

          <div className="md:col-span-3">
            <Column title="联系">
              <ul className="space-y-3 text-sm text-muted">
                <li>{contact.email}</li>
                <li>{contact.location}</li>
                <li className="type-label-sm pt-2 text-faint">
                  {school.name}
                </li>
              </ul>
            </Column>
          </div>
        </div>

        {/* 页脚底部：环形校名 + 法务信息 */}
        <div className="relative flex flex-col gap-8 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 shrink-0 text-faint">
              <EmblemRing id="capu-footer-ring" spin />
            </div>
            <p className="type-label-sm max-w-[34ch] leading-relaxed text-faint">
              {school.nameEn}
            </p>
          </div>

          <div className="type-label-sm flex flex-wrap items-center gap-x-6 gap-y-2 text-faint">
            <span>© {year} {team.name}</span>
            <span>内容由车队维护</span>
            <span>{school.address}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
