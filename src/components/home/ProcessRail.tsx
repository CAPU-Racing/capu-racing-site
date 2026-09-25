"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { cx } from "@/lib/motion";
import { processSteps } from "@/lib/site";

/**
 * 工程流程轨道。
 * 左侧标题区吸顶，右侧步骤列表滚动时，左侧的大号步骤编号与
 * 纵向进度线随滚动同步推进——把「流程」这件事讲成可感知的进度。
 */
export function ProcessRail() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 75%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const clamped = Math.min(0.999, Math.max(0, value));
    setActive(Math.floor(clamped * processSteps.length));
  });

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* 吸顶信息区 */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <div className="flex items-center gap-4">
            <span
              className="text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] text-cap"
              data-numeric
            >
              {processSteps[active]?.step ?? "01"}
            </span>
            <div className="flex flex-col">
              <span className="type-label text-faint" data-numeric>
                第 {active + 1} / {processSteps.length} 阶段
              </span>
              <span className="type-h3 mt-1.5">
                {processSteps[active]?.title}
              </span>
            </div>
          </div>

          <p className="mt-6 max-w-[34ch] leading-relaxed text-muted">
            {processSteps[active]?.desc}
          </p>

          {/* 进度轨道 */}
          <div className="relative mt-9 h-px w-full bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 origin-left bg-cap"
              style={{ scaleX: reduced ? 1 : scrollYProgress }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            {processSteps.map((step, i) => (
              <span
                key={step.step}
                className={cx(
                  "type-label-sm transition-colors duration-300",
                  i <= active ? "text-cap" : "text-faint",
                )}
                data-numeric
              >
                {step.step}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 步骤列表 */}
      <ol className="lg:col-span-7">
        {processSteps.map((step, i) => (
          <li
            key={step.step}
            className={cx(
              "group border-t border-line py-8 transition-opacity duration-500 last:border-b",
              i === active ? "opacity-100" : "opacity-45",
            )}
          >
            <div className="flex items-start gap-6">
              <span
                className="type-label mt-1.5 shrink-0 text-cap"
                data-numeric
              >
                {step.step}
              </span>
              <div>
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
