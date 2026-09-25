import { cx } from "@/lib/motion";
import { newsCategoryLabel } from "@/lib/format";
import type { NewsCategory } from "@/lib/content-meta";

/**
 * 赛事动态封面
 * ---------------------------------------------------------------------------
 * 车队暂时没有稳定的配图来源，与其留一块破图或放占位符，
 * 不如按文章标识生成一张「确定性的技术图表」：
 * 同一篇文章永远得到同一张图，不同文章之间有明显差异。
 */

function hash(input: string) {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/** 由种子生成一条遥测风格的折线 */
function tracePoints(seed: number) {
  const count = 15;
  const step = 400 / (count - 1);
  const points: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const bits = (seed >>> ((i * 5) % 28)) & 0xff;
    const wave = Math.sin((i + (seed % 7)) * 0.9) * 0.5 + 0.5;
    const y = 30 + ((bits / 255) * 0.55 + wave * 0.45) * 165;
    points.push(`${(i * step).toFixed(1)},${y.toFixed(1)}`);
  }

  return points.join(" ");
}

export function NewsCover({
  slug,
  date,
  category,
  className,
  compact = false,
}: {
  slug: string;
  date: string;
  category: NewsCategory;
  className?: string;
  compact?: boolean;
}) {
  const seed = hash(slug);
  const trace = tracePoints(seed);
  const baseline = 60 + (seed % 90);

  return (
    <div
      aria-hidden
      className={cx(
        "relative overflow-hidden rounded-card border border-line bg-surface",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 225"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-cap opacity-60"
        fill="none"
      >
        {/* 基准网格 */}
        {[45, 90, 135, 180].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="1"
          />
        ))}
        {/* 阈值线 */}
        <line
          x1="0"
          y1={baseline}
          x2="400"
          y2={baseline}
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {/* 数据折线 */}
        <polyline
          points={trace}
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        {/* 起点标记 */}
        <circle cx="0" cy={baseline} r="2.5" fill="currentColor" />
      </svg>

      <div
        className={cx(
          "relative flex h-full flex-col justify-between",
          compact ? "p-3" : "p-5",
        )}
      >
        <span className="type-label-sm text-faint">
          {newsCategoryLabel(category)}
        </span>
        <span
          className={cx(
            "type-label text-fg",
            compact && "text-[0.625rem]",
          )}
          data-numeric
        >
          {date.replaceAll("-", ".")}
        </span>
      </div>
    </div>
  );
}
