"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { cx } from "@/lib/motion";

/**
 * 数字滚动。
 * 数值通过 MotionValue 直接写入 DOM，不触发 React 重渲染，
 * 因此数据条滚动经过时不会掉帧。
 */
export function Counter({
  value,
  duration = 1.5,
  className,
  suffix,
  prefix,
  pad = 0,
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  pad?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  const count = useMotionValue(0);
  const text = useTransform(count, (latest) => {
    const rounded = Math.round(latest);
    const body = pad > 0 ? String(rounded).padStart(pad, "0") : String(rounded);
    return `${prefix ?? ""}${body}${suffix ?? ""}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced || duration === 0) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced, count]);

  return (
    <motion.span ref={ref} data-numeric className={className}>
      {text}
    </motion.span>
  );
}

/** 滚动进度条：页面顶端 1px 细线，随阅读进度增长 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 40,
    restDelta: 0.001,
  });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-cap"
    />
  );
}

/**
 * 无限横向滚动条。
 * 内容复制两份并整体位移 -50% 实现无缝循环；
 * 位移用 CSS 动画跑在合成层上，不占用主线程。
 */
export function Marquee({
  items,
  duration = 42,
  reverse = false,
  className,
  itemClassName,
  separator = "/",
}: {
  items: readonly string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items];

  return (
    <div
      className={cx("relative overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
      }}
    >
      <div
        className="flex w-max will-change-transform"
        style={
          reduced
            ? undefined
            : {
                animation: `capu-marquee ${duration}s linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
              }
        }
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={cx(
              "flex shrink-0 items-center gap-5 pr-5 sm:gap-6 sm:pr-6",
              itemClassName,
            )}
          >
            <span>{item}</span>
            <span aria-hidden className="text-cap">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 图纸网格背景。
 * 细网格 + 粗网格双层叠加，并用径向遮罩从中心向外淡出，
 * 避免整屏网格带来的机械压迫感。
 */
export function GridBackdrop({
  className,
  fade = true,
  fine = true,
}: {
  className?: string;
  fade?: boolean;
  fine?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute inset-0", className)}
      style={
        fade
          ? {
              maskImage:
                "radial-gradient(120% 90% at 50% 0%, black 18%, transparent 76%)",
              WebkitMaskImage:
                "radial-gradient(120% 90% at 50% 0%, black 18%, transparent 76%)",
            }
          : undefined
      }
    >
      {fine && <div className="absolute inset-0 bg-blueprint-fine opacity-40" />}
      <div className="absolute inset-0 bg-blueprint" />
    </div>
  );
}

/** 制图角标：四角直角标记，强化工程图纸的观感 */
export function CornerTicks({ className }: { className?: string }) {
  const tick = "absolute h-2.5 w-2.5 border-line-strong";
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute inset-0", className)}
    >
      <span className={cx(tick, "left-0 top-0 border-l border-t")} />
      <span className={cx(tick, "right-0 top-0 border-r border-t")} />
      <span className={cx(tick, "bottom-0 left-0 border-b border-l")} />
      <span className={cx(tick, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}
