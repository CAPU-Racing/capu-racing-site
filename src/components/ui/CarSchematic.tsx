"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cx, EASE_OUT_EXPO, staggerChildren } from "@/lib/motion";

/**
 * 整车工程制图
 * ---------------------------------------------------------------------------
 * Hero 主视觉。刻意不使用渲染图或照片：
 * 一张按制图规范绘制的整车侧视图更贴近这支车队实际在做的事。
 * 含尺寸标注、零件引线、地面影线与右下角图签栏。
 *
 * 绘制基准（视口 60,16 1140×464）
 *   地面线      y = 400
 *   前轴 / 后轴  x = 880 / x = 330（轴距即两组数字之差）
 *   整车      x ≈ 228 … 1170
 * 车身俯仰轮廓：发动机舱 → 防滚架 → 座舱开口 → 前隔板 → 鼻锥。
 */

/* ============================ 变体 ============================ */

/** 线条绘出：pathLength 只对 path / circle / line 生效 */
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
};

/** 仅淡入：用于虚线（pathLength 会覆盖 strokeDasharray）与文字 */
const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

function Layer({ stagger = 0.04, children }: { stagger?: number; children: ReactNode }) {
  return <motion.g variants={staggerChildren(stagger)}>{children}</motion.g>;
}

/* ============================ 标注数据 ============================ */

/** 地面影线 */
const GROUND_TICKS = Array.from({ length: 30 }, (_, i) => 60 + i * 38);

/** 零件引线标注：dot 落在零件上，end 为文字锚点 */
const CALLOUTS = [
  { index: "01", label: "尾翼 REAR WING", dot: [228, 244], end: [228, 104] },
  { index: "02", label: "防滚架 ROLL HOOP", dot: [516, 240], end: [516, 58] },
  { index: "03", label: "人机保护 HALO", dot: [622, 240], end: [622, 104] },
  { index: "04", label: "前翼 FRONT WING", dot: [1120, 376], end: [1120, 58] },
] as const;

const MONO = { fontFamily: "var(--font-mono)" };

/* ============================ 组件 ============================ */

export function CarSchematic({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // 极轻的视差；透明度保留下限，避免滚动时图形「消失」
  const y = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.5]);

  const animated = !reduced;

  return (
    <motion.div
      ref={ref}
      style={animated ? { y, opacity } : undefined}
      className={cx("text-fg", className)}
    >
      <svg
        viewBox="60 16 1140 464"
        className="h-auto w-full"
        fill="none"
        aria-hidden
        focusable="false"
      >
        <motion.g
          initial={animated ? "hidden" : false}
          animate={animated ? "show" : false}
          variants={staggerChildren(0.1)}
        >
          {/* ============ 基准、地面与尺寸标注 ============ */}
          <Layer stagger={0.02}>
            <motion.path
              variants={draw}
              d="M40 400 L1180 400"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="0.9"
            />
            {GROUND_TICKS.map((x) => (
              <motion.path
                key={x}
                variants={draw}
                d={`M${x} 400 L${x - 9} 409`}
                stroke="currentColor"
                strokeOpacity="0.22"
                strokeWidth="0.75"
              />
            ))}
            <motion.path
              variants={fade}
              d="M300 400 L300 444M950 400 L950 444"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="0.75"
              strokeDasharray="4 5"
            />
            <motion.path
              variants={draw}
              d="M300 428 L950 428"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.75"
            />
            <motion.path
              variants={draw}
              d="M300 424 L308 428 L300 432M950 424 L942 428 L950 432"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.75"
            />
            <motion.path
              variants={draw}
              d="M470 384 L470 400M466 384 L474 384M466 400 L474 400"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.75"
            />
          </Layer>

          {/* ============ 车身主轮廓（开轮式） ============ */}
          {/*
            结构要点，这几条决定了它读起来像不像方程式赛车：
              1）车底极低（y≈380，仅高于地面 20），而不是悬在半空；
              2）车身在轮位置处很薄，两个车轮的上缘与下缘都露在外面（开轮式）；
              3）尾段是细长的尾部锥，而不是延伸盖过车轮的壳体；
              4）鼻锥是一根细梁，不是长车头。
          */}
          <Layer stagger={0.08}>
            <motion.path
              variants={draw}
              d={
                "M205 362 L240 378 L340 384 L700 382 L858 372 L900 364 " +
                "L980 354 L1060 354 L1152 360 L1152 342 L1060 330 L960 318 " +
                "L880 304 L800 292 L722 288 L700 300 L664 312 L580 314 " +
                "L566 296 L546 246 L516 234 L490 246 L430 264 L330 294 " +
                "L255 322 L205 348 Z"
              }
              stroke="currentColor"
              strokeOpacity="0.85"
              strokeWidth="1.6"
              strokeLinejoin="miter"
            />
            {/* 防火墙（座舱后壁） */}
            <motion.path
              variants={draw}
              d="M578 316 L578 382"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            {/* 前悬架：叉臂汇到前轮毂，开轮式的关键特征之一 */}
            <motion.path
              variants={draw}
              d="M878 312 L946 326M872 360 L946 338"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          </Layer>

          {/* ============ 侧箱与底板 ============ */}
          <Layer stagger={0.06}>
            {/* 侧箱顶面（低于座舱沿，形成两层面） */}
            <motion.path
              variants={draw}
              d="M676 322 C762 326 828 330 868 336"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* 侧箱前沿下切（undercut） */}
            <motion.path
              variants={draw}
              d="M868 336 C862 356 846 372 830 380"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* 底板縦线 */}
            <motion.path
              variants={fade}
              d="M436 384 L856 374"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="0.9"
              strokeDasharray="3 4"
            />
            {/* 底板侧缘 */}
            <motion.path
              variants={draw}
              d="M460 383 L850 373 L850 379 L460 389 Z"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          </Layer>

          {/* ============ 扩散器（位于后轮之后，否则会被车轮遮住） ============ */}
          <Layer stagger={0.06}>
            <motion.path
              variants={draw}
              d="M205 350 L300 368 L436 383"
              stroke="currentColor"
              strokeOpacity="0.65"
              strokeWidth="1.1"
            />
            <motion.path
              variants={draw}
              d="M205 350 L205 362"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.1"
            />
            {/* 扩散器内隔板 */}
            <motion.path
              variants={draw}
              d="M212 363 L212 372M221 367 L221 375"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
          </Layer>

          {/* ============ 尾翼 ============ */}
          {/* 弦长按真实比例收窄：原来跨 230 单位（≈1.3 米），所以看着像一叠平板 */}
          <Layer stagger={0.05}>
            {/* 端板：侧视下呈现为一块竖向板 */}
            <motion.path
              variants={draw}
              d="M164 220 L288 220 L288 272 L164 272 Z"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeLinejoin="miter"
            />
            {/* 主翼 */}
            <motion.path
              variants={draw}
              d="M168 246 L288 240 L288 248 L168 254 Z"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.3"
              strokeLinejoin="miter"
            />
            {/* 擦翼 */}
            <motion.path
              variants={draw}
              d="M186 228 L288 224 L288 232 L186 236 Z"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.3"
              strokeLinejoin="miter"
            />
            {/* 支撑立柱：把尾翼接到车尾 */}
            <motion.path
              variants={draw}
              d="M250 322 L250 272M266 320 L266 272"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          </Layer>

          {/* ============ 前翼 ============ */}
          {/* 前翼在鼻锥前方、贴地，翼尖比鼻锥更靠前 */}
          <Layer stagger={0.05}>
            <motion.path
              variants={draw}
              d="M1010 372 L1178 372 L1178 379 L1010 379 Z"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.3"
              strokeLinejoin="miter"
            />
            <motion.path
              variants={draw}
              d="M1026 383 L1178 383 L1178 389 L1026 389 Z"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.3"
              strokeLinejoin="miter"
            />
            <motion.path
              variants={draw}
              d="M1178 364 L1189 364 L1189 393 L1178 393 Z"
              stroke="currentColor"
              strokeOpacity="0.75"
              strokeWidth="1.3"
              strokeLinejoin="miter"
            />
            {/* 鼻锥到前翼的立柱 */}
            <motion.path
              variants={draw}
              d="M1042 354 L1042 372M1102 352 L1102 372"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          </Layer>

          {/* ============ 车轴（位于车轮之后，被轮胎底色压暗） ============ */}
          <Layer stagger={0.05}>
            <motion.path
              variants={draw}
              d="M386 328 L300 328"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.1"
            />
            <motion.path
              variants={draw}
              d="M884 332 L950 332"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.1"
            />
          </Layer>

          {/* ============ 车轮 ============ */}
          {/* 轮胎填充成底色，把车身线条压到「后面」，形成正确的前后关系。
              半径按真实比例收小：原来 r=84、车长/胎径只有 3.3:1，看着像卡丁车 */}
          <Layer stagger={0.07}>
            <motion.circle
              variants={draw}
              cx="300"
              cy="328"
              r="72"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.6"
              style={{ fill: "var(--bg)" }}
              fillOpacity="0.62"
            />
            <motion.circle
              variants={fade}
              cx="300"
              cy="328"
              r="48"
              stroke="currentColor"
              strokeOpacity="0.32"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <motion.circle
              variants={draw}
              cx="300"
              cy="328"
              r="45"
              stroke="currentColor"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
            <motion.circle
              variants={draw}
              cx="300"
              cy="328"
              r="8"
              stroke="currentColor"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
            <motion.circle
              variants={draw}
              cx="950"
              cy="332"
              r="68"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.6"
              style={{ fill: "var(--bg)" }}
              fillOpacity="0.62"
            />
            <motion.circle
              variants={fade}
              cx="950"
              cy="332"
              r="45"
              stroke="currentColor"
              strokeOpacity="0.32"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <motion.circle
              variants={draw}
              cx="950"
              cy="332"
              r="43"
              stroke="currentColor"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
            <motion.circle
              variants={draw}
              cx="950"
              cy="332"
              r="8"
              stroke="currentColor"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
          </Layer>

          {/* ============ 防滚架、座舱与 Halo ============ */}
          <Layer stagger={0.07}>
            {/* 进气箱进气口 */}
            <motion.path
              variants={draw}
              d="M492 250 C512 258 528 266 540 276"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* 头盔：坐在座舱凹口里，顶部高出周围车体 */}
            <motion.circle
              variants={draw}
              cx="622"
              cy="288"
              r="25"
              stroke="currentColor"
              strokeOpacity="0.6"
              strokeWidth="1.2"
            />
            <motion.path
              variants={draw}
              d="M599 285 L645 280"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            {/* Halo：窄弧，弧度压低以与头盔拉开距离，避免看成封闭气泡舱 */}
            <motion.path
              variants={draw}
              d="M568 302 C576 214 668 216 676 312"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="1.2"
            />
          </Layer>

          {/* ============ 尺寸文字 ============ */}
          <motion.g variants={fade}>
            <text
              x="625"
              y="452"
              textAnchor="middle"
              fill="currentColor"
              fillOpacity="0.6"
              fontSize="10"
              letterSpacing="1.1"
              style={MONO}
            >
              轴距 / WHEELBASE
            </text>
            <text
              x="482"
              y="396"
              fill="currentColor"
              fillOpacity="0.6"
              fontSize="9.5"
              letterSpacing="1"
              style={MONO}
            >
              离地间隙
            </text>
          </motion.g>

          {/* ============ 零件引线 ============ */}
          <Layer stagger={0.06}>
            {CALLOUTS.map((c) => (
              <motion.path
                key={c.index}
                variants={draw}
                d={`M${c.dot[0]} ${c.dot[1]} L${c.end[0]} ${c.end[1]}`}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="0.9"
              />
            ))}
            <motion.path
              variants={draw}
              d="M216 366 L170 430"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="0.9"
            />
          </Layer>

          <motion.g variants={fade}>
            <g fill="currentColor" fillOpacity="0.75">
              {CALLOUTS.map((c) => (
                <circle key={c.index} cx={c.dot[0]} cy={c.dot[1]} r="2.6" />
              ))}
              <circle cx="216" cy="366" r="2.6" />
            </g>

            {CALLOUTS.map((c) => (
              <text
                key={c.index}
                x={c.end[0]}
                y={c.end[1] - 10}
                textAnchor="middle"
                fontSize="10"
                letterSpacing="1"
                style={MONO}
              >
                <tspan className="fill-cap" fontWeight="600">
                  {c.index}
                </tspan>
                <tspan fill="currentColor" fillOpacity="0.7" dx="7">
                  {c.label}
                </tspan>
              </text>
            ))}
            <text
              x="162"
              y="444"
              textAnchor="end"
              fontSize="10"
              letterSpacing="1"
              style={MONO}
            >
              <tspan className="fill-cap" fontWeight="600">
                05
              </tspan>
              <tspan fill="currentColor" fillOpacity="0.7" dx="7">
                扩散器 DIFFUSER
              </tspan>
            </text>
          </motion.g>

          {/* ============ 图签栏 ============ */}
          <motion.g variants={fade}>
            <g
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="0.85"
              fill="none"
            >
              <path d="M900 414 L1180 414 L1180 464 L900 464 Z" />
              <path d="M900 434 L1180 434" />
              <path d="M1080 434 L1080 464" />
            </g>
            <text
              x="912"
              y="428"
              fontSize="9.5"
              letterSpacing="1.1"
              fill="currentColor"
              fillOpacity="0.7"
              style={MONO}
            >
              CAPU RACING · FS-01
            </text>
            <text
              x="912"
              y="450"
              fontSize="9"
              letterSpacing="1"
              fill="currentColor"
              fillOpacity="0.5"
              style={MONO}
            >
              SIDE VIEW
            </text>
            <text
              x="912"
              y="461"
              fontSize="9"
              letterSpacing="1"
              fill="currentColor"
              fillOpacity="0.5"
              style={MONO}
            >
              SCALE NTS
            </text>
            <text
              x="1092"
              y="450"
              fontSize="9"
              letterSpacing="1"
              fill="currentColor"
              fillOpacity="0.5"
              style={MONO}
            >
              REV A
            </text>
            <text
              x="1092"
              y="461"
              fontSize="9"
              letterSpacing="1"
              fill="currentColor"
              fillOpacity="0.5"
              style={MONO}
            >
              UNIT MM
            </text>
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

/**
 * 组别图标：四个子系统的线稿符号。
 * 同样使用制图语言，不引入通用图标库。
 */
export function SystemGlyph({
  glyph,
  className,
}: {
  glyph: "ecu" | "battery" | "harness" | "chassis";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
      focusable="false"
    >
      {glyph === "ecu" && (
        <g strokeWidth="1">
          <rect x="12" y="8" width="40" height="32" />
          <path d="M4 14h8M4 24h8M4 34h8M52 14h8M52 24h8M52 34h8" />
          <path d="M18 30l6-8 5 6 5-10 5 12 7-14" strokeLinejoin="miter" />
        </g>
      )}
      {glyph === "battery" && (
        <g strokeWidth="1">
          <rect x="8" y="12" width="48" height="26" />
          <path d="M20 12v26M32 12v26M44 12v26" />
          <path d="M14 8h6M44 8h6" />
          <path d="M8 42h48" strokeDasharray="3 3" />
          <path d="M14 38v8M32 38v8M50 38v8" strokeOpacity="0.5" />
        </g>
      )}
      {glyph === "harness" && (
        <g strokeWidth="1">
          <path d="M6 24h12l8-12h14" />
          <path d="M18 24l8 12h14" />
          <path d="M18 24h12" />
          <rect x="40" y="6" width="10" height="12" />
          <rect x="40" y="24" width="10" height="12" />
          <path d="M50 12h8M50 30h8" />
          <circle cx="6" cy="24" r="2.5" />
        </g>
      )}
      {glyph === "chassis" && (
        <g strokeWidth="1">
          <circle cx="46" cy="28" r="12" />
          <path d="M46 28h-8" />
          <path d="M14 18l24 10M14 34l24-4" />
          <path d="M14 18v16" />
          <path d="M22 12l-8 6 8 10" strokeOpacity="0.55" />
          <path d="M6 26h8" />
        </g>
      )}
    </svg>
  );
}
