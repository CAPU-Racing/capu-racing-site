import Image from "next/image";
import { cx } from "@/lib/motion";
import { school } from "@/lib/site";

/**
 * 品牌母题
 * ---------------------------------------------------------------------------
 * 校徽的构成是「飞机 + 地平线 + 1965」。
 * 这里不复制书法笔触的校徽本身，而是把它拆解成几何化的线条母题，
 * 用于大面积背景与分区过渡，让站点与学校视觉体系同源。
 */

/** 几何化爬升飞机轮廓（致敬校徽中的飞机造型） */
export function ClimbMark({
  className,
  filled = true,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 132 76"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* 主翼：后掠三角 */}
      <path
        d="M118 6 L2 46 L96 46 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="miter"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.08 : 0}
      />
      {/* 尾翼 */}
      <path
        d="M2 46 L18 70 L40 46"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="miter"
      />
      {/* 机身轴线，象征爬升方向 */}
      <path
        d="M118 6 L128 -4"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * 地平线母题：多层浅弧 + 爬升航迹。
 * 用于大区块背景，呼应校徽中的地平线与「上升」语义。
 */
export function HorizonArc({
  className,
  withAircraft = false,
  strokeWidth = 1,
}: {
  className?: string;
  withAircraft?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 1200 320"
      className={cx("w-full", className)}
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      focusable="false"
    >
      {/* 地平线：由实到虚的三层弧 */}
      <path
        d="M-60 268 Q600 96 1260 268"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.55"
      />
      <path
        d="M-60 296 Q600 140 1260 296"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.3"
      />
      <path
        d="M-60 320 Q600 184 1260 320"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.15"
      />

      {withAircraft && (
        <>
          {/* 航迹虚线：从地平线上升 */}
          <path
            d="M232 250 C 320 210, 400 150, 486 82"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="3 6"
            opacity="0.45"
          />
          <g transform="translate(452 52) scale(0.62)">
            <path
              d="M118 6 L2 46 L96 46 Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M2 46 L18 70 L40 46"
              stroke="currentColor"
              strokeWidth="2"
            />
          </g>
          {/* 起点标记 */}
          <circle cx="232" cy="250" r="3" fill="currentColor" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

/**
 * 官方校徽。
 * 环状文字部分缓慢旋转，用于页脚等低调位置。
 */
export function Emblem({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/cap-emblem.png"
      alt={`${school.name}校徽`}
      width={size}
      height={size}
      priority={priority}
      className={cx("object-contain", className)}
    />
  );
}

/**
 * 环形校名（呼应校徽外环的中英文环绕排布）。
 * 需要传入唯一 id，避免同页多处使用时 <textPath> 冲突。
 */
export function EmblemRing({
  id = "capu-emblem-ring",
  className,
  spin = false,
}: {
  id?: string;
  className?: string;
  spin?: boolean;
}) {
  const text = `${school.nameEn} · ${school.name} · `;

  return (
    <svg
      viewBox="0 0 200 200"
      className={cx("h-full w-full", className)}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <path
          id={id}
          d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
        />
      </defs>
      {/* 内外双环，对应校徽的同心圆结构 */}
      <circle
        cx="100"
        cy="100"
        r="96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
      <g
        style={
          spin
            ? { animation: "capu-spin-slow 64s linear infinite", transformOrigin: "50% 50%" }
            : undefined
        }
      >
        <text
          fill="currentColor"
          fontSize="11.5"
          letterSpacing="1.6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <textPath href={`#${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

/** 建校年份标记，作为时间基准点出现在页脚 */
export function SinceMark({ className }: { className?: string }) {
  return (
    <span
      className={cx("type-label inline-flex items-baseline gap-2", className)}
    >
      <span className="text-faint">SINCE</span>
      <span className="text-accent" data-numeric>
        {school.founded}
      </span>
    </span>
  );
}
