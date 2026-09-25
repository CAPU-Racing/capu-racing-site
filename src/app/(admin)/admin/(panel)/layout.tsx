import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Emblem } from "@/components/ui/BrandMarks";
import { Container } from "@/components/ui/SectionHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminConfigured, isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/app/(admin)/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "内容管理",
  robots: { index: false, follow: false },
};

/**
 * 后台外壳。
 * 鉴权放在布局里：任何进入该分组的页面都会先过这一关。
 */
export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!adminConfigured() || !(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="glass-bar sticky top-0 z-40 border-b border-line">
        <Container wide>
          <div className="flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-3">
                <Emblem size={28} />
                <span className="type-label-sm text-faint">后台</span>
              </Link>
              <AdminNav />
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/"
                target="_blank"
                className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
              >
                查看站点 ↗
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="type-label-sm text-muted transition-colors duration-300 hover:text-signal"
                >
                  退出登录
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10 sm:py-12">
        <Container wide>{children}</Container>
      </main>
    </div>
  );
}
