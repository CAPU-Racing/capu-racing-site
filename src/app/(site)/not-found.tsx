import Link from "next/link";
import { Container } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { GridBackdrop } from "@/components/ui/Motion";
import { ClimbMark } from "@/components/ui/BrandMarks";
import { nav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden border-b border-line">
      <GridBackdrop />
      <Container wide className="relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-muted">
              <span className="type-label text-accent" data-numeric>
                404
              </span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span className="type-label">Page Not Found</span>
            </div>

            <h1 className="type-display mt-6 max-w-[16ch]">
              这条赛道不通
            </h1>

            <p className="type-lead mt-7 max-w-[44ch]">
              你要找的页面不存在，或者已经被移动到别处。
              下面是站点的几个主要入口。
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/" size="lg" variant="primary" withArrow>
                回到首页
              </Button>
              <Button href="/qa" size="lg" variant="outline">
                查看 Q&amp;A
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border-t border-line lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
              <p className="type-label-sm text-faint">站点导航</p>
              <ul className="mt-5 space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline gap-3 text-[0.9375rem] text-muted transition-colors duration-300 hover:text-fg"
                    >
                      <span
                        className="type-label-sm text-faint"
                        data-numeric
                      >
                        {item.index}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
                <ClimbMark className="h-7 w-12 shrink-0 text-cap" filled={false} />
                <p className="type-label-sm leading-relaxed text-faint">
                  如果是从旧链接跳转过来的，可以到「联系我们」告诉我们。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
