import type { Transition, Variants } from "framer-motion";

/**
 * 动效基元
 * ---------------------------------------------------------------------------
 * 原则：
 * 1. 入场动效统一走 expo-out，短距离位移（8–24px）+ 透明度，不做夸张弹跳。
 * 2. 只对 enter 生效一次（once），避免来回滚动反复播放造成廉价感。
 * 3. 所有动效都尊重 prefers-reduced-motion。
 */

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_QUINT: [number, number, number, number] = [0.83, 0, 0.17, 1];

export const DUR = {
  fast: 0.28,
  base: 0.5,
  slow: 0.8,
  relax: 1.1,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 32,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

/** 视口触发配置：元素露出约 1/3 时触发 */
export const inViewOnce = {
  once: true,
  amount: 0.3,
  margin: "0px 0px -12% 0px",
} as const;

export const inViewEarly = {
  once: true,
  amount: 0.05,
  margin: "0px 0px -8% 0px",
} as const;

/* ============================ 变体 ============================ */

/** 基础上浮 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.relax, ease: EASE_OUT_EXPO } },
};

/** 遮罩内逐行揭示：配合父级 overflow-hidden 使用 */
export const maskedLine: Variants = {
  hidden: { y: "115%" },
  show: {
    y: "0%",
    transition: { duration: DUR.relax, ease: EASE_OUT_EXPO },
  },
};

/** 发丝线横向生长 */
export const ruleGrow: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
  },
};

/** 容器：为子元素排队进场 */
export function staggerChildren(
  stagger = 0.08,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/* ============================ 辅助 ============================ */

/** 组合类名，避免引入额外依赖 */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * 将中文/中英混排标题按语义切成若干行，
 * 用于遮罩逐行揭示。传入显式数组而不是自动断行，
 * 以保证排版结果可控。
 */
export function splitLines(text: string, perLine: number): string[] {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += perLine) {
    lines.push(text.slice(i, i + perLine));
  }
  return lines;
}
