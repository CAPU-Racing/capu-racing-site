"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { DUR, EASE_OUT_EXPO, cx } from "@/lib/motion";

export type AccordionItem = {
  id: string;
  question: string;
  /** 已渲染的 HTML，由内容层提供 */
  html: string;
  meta?: string;
};

/**
 * 手风琴。
 * 高度用 Framer Motion 的 height: auto 过渡，展开/收起都保持平滑且不跳版。
 * 用原生 button + aria-expanded，键盘可操作。
 */
export function Accordion({
  items,
  defaultOpenId,
  className,
  indexOffset = 0,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
  /** 编号起始值，用于跨分组连续编号 */
  indexOffset?: number;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const reduced = useReducedMotion();
  const uid = useId();

  return (
    <div className={cx("border-t border-line", className)}>
      {items.map((item, i) => {
        const open = openId === item.id;
        const panelId = `${uid}-${item.id}`;
        const number = String(indexOffset + i + 1).padStart(2, "0");

        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6"
              >
                <span
                  className={cx(
                    "type-label mt-[0.4em] shrink-0 transition-colors duration-300",
                    open ? "text-cap" : "text-faint group-hover:text-cap",
                  )}
                  data-numeric
                >
                  {number}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cx(
                      "block text-[1.0625rem] font-medium leading-snug tracking-[-0.005em] transition-colors duration-300 sm:text-[1.1875rem]",
                      open ? "text-fg" : "text-fg/90 group-hover:text-fg",
                    )}
                  >
                    {item.question}
                  </span>
                  {item.meta && (
                    <span className="type-label-sm mt-2 block text-faint">
                      {item.meta}
                    </span>
                  )}
                </span>

                {/* 加减号：两条线交叉旋转 */}
                <span
                  aria-hidden
                  className="relative mt-2 h-4 w-4 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={cx(
                      "absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      open ? "scale-y-0" : "scale-y-100",
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  key="content"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: DUR.base, ease: EASE_OUT_EXPO },
                    opacity: { duration: DUR.fast, ease: EASE_OUT_EXPO },
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className="prose-capu pb-8 pl-0 sm:pl-[calc(2.5rem+0.75rem)]"
                    dangerouslySetInnerHTML={{ __html: item.html }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
