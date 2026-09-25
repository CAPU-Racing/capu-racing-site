import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { announcement, school, siteMeta } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteMeta.title}｜${school.name}`,
    template: `%s｜${siteMeta.title}`,
  },
  description: siteMeta.description,
  keywords: [...siteMeta.keywords],
  applicationName: siteMeta.title,
  authors: [{ name: siteMeta.title }],
  icons: {
    icon: [{ url: "/brand/cap-emblem.png", type: "image/png" }],
    apple: [{ url: "/brand/cap-emblem.png" }],
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: siteMeta.title,
    title: `${siteMeta.title}｜${school.name}`,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMeta.title}｜${school.name}`,
    description: siteMeta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#071523" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * 根布局只负责文档骨架与字体。
 * 站点外壳（页头/页脚）在 (site) 分组里，后台 (admin) 分组使用自己的外壳。
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        {/*
          首帧前恢复「公告已关闭」状态：命中时给 <html> 打上标记，
          由 CSS 直接隐藏公告条，重复访客就不会看到它一闪而过。
          beforeInteractive 只允许放在根布局。
        */}
        <Script id="announcement-dismissal" strategy="beforeInteractive">
          {`try { if (window.localStorage.getItem("capu.announcement.${announcement.id}") === "1") { document.documentElement.setAttribute("data-announcement", "dismissed"); } } catch {}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
