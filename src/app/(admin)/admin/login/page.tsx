import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/ui/BrandMarks";
import { Container } from "@/components/ui/SectionHeader";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/auth";
import { team } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "后台登录",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = adminConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3">
          <Emblem size={36} />
          <div className="flex flex-col leading-none">
            <span className="text-[0.9375rem] font-semibold">
              CAPU <span className="text-cap">RACING</span>
            </span>
            <span className="type-label-sm mt-1 text-faint">
              {team.name}
            </span>
          </div>
        </div>

        <h1 className="type-h2 mt-10">内容管理后台</h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
          用于维护赛事动态与 Q&amp;A 内容。内容以 Markdown 文件形式保存在仓库的
          <code className="mx-1 text-fg">content/</code>
          目录下，改动会直接写入文件。
        </p>

        {!configured && (
          <div className="mt-8 border-l-2 border-amber bg-amber/5 px-4 py-3">
            <p className="type-label-sm text-amber-dim">尚未配置</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
              复制
              <code className="mx-1 text-fg">.env.example</code>
              为
              <code className="mx-1 text-fg">.env.local</code>
              ，填写
              <code className="mx-1 text-fg">ADMIN_PASSWORD</code>
              与
              <code className="mx-1 text-fg">ADMIN_SESSION_SECRET</code>
              后重启开发服务器。
            </p>
          </div>
        )}

        <LoginForm configured={configured} />

        <div className="mt-12 border-t border-line pt-6">
          <Link
            href="/"
            className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
          >
            ← 返回站点首页
          </Link>
        </div>
      </div>
    </div>
  );
}
