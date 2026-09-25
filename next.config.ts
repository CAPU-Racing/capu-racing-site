import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 内容（Q&A / 赛事动态）写在 content/ 下的 Markdown 里，
  // 后台编辑后需要让 Node 进程重新读取，因此不做激进的构建期缓存。
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
    // 构建期的「收集页面数据 / 生成静态页面」阶段会按 CPU 核数派生 worker 进程，
    // Next 默认用 核数-1 个。在 32 核机器上就是 31 个 Node 进程同时提交内存，
    // 一旦系统提交量（Commit）接近上限，构建会以
    // "Zone Allocation failed - process out of memory" 直接崩掉。
    // 本项目页面数量有限，4 个 worker 已足够，可用 NEXT_BUILD_CPUS 覆盖。
    cpus: Math.max(1, Number(process.env.NEXT_BUILD_CPUS) || 4),
  },
};

export default nextConfig;
