import type { MetadataRoute } from "next";
import { getNewsPosts } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getNewsPosts();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/systems", priority: 0.9 },
    { path: "/qa", priority: 0.8 },
    { path: "/news", priority: 0.7 },
    { path: "/join", priority: 0.9 },
    { path: "/contact", priority: 0.5 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/news/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
