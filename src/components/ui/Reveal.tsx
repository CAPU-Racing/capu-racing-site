"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  DUR,
  EASE_OUT_EXPO,
  cx,
  inViewEarly,
  maskedLine,
} from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 延迟（秒） */
  delay?: number;
  /** 初始位移距离（px） */
  y?: number;
  /** 初始横向位移（px），用于左右交错进场 */
  x?: number;
  /** 触发阈值，默认整块露出 1/3 */
  amount?: number;
  /** 是否只播放一次 */
  once?: boolean;
};

/**
 * 滚动入场容器。
 * 默认短距离上浮 + 淡入，节奏由 expo-out 控制。
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  x = 0,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount, margin: inViewEarly.margin }}
      transition={{ duration: DUR.slow, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 遮罩逐行揭示标题。
 * 每行文本位于一个 overflow-hidden 容器内，内容自下而上推入。
 *
 * 注意：IntersectionObserver 会把祖先的裁剪计算在内，
 * 因此触发器必须放在「未被裁剪」的外层容器上，
 * 由它向被裁剪的行传变体；否则初始位移到遮罩外的行
 * 交集比例恒为 0，动画永远不会启动。
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName ?? ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {lines.map((line, i) => (
          <span key={i} className="reveal-mask">
            <motion.span
              className={cx("block", lineClassName)}
              variants={maskedLine}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * 单行文字，逐个字符淡入。
 * 仅用于短句（如 Hero 的副标题），中文按字拆分。
 */
export function CharFade({
  text,
  className,
  delay = 0,
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DUR.base,
            ease: EASE_OUT_EXPO,
            delay: delay + i * stagger,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
