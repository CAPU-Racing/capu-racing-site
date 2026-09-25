"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SystemGlyph } from "@/components/ui/CarSchematic";
import { cx } from "@/lib/motion";
import { systems } from "@/lib/site";

/**
 * 组别速览。
 * 用发丝线栅格替代常见的圆角卡片：每个组别一格，
 * 悬停时蓝色指示线自下而上生长、图标线稿被点亮。
 */
function SystemCell({
  system,
  index,
}: {
  system: (typeof systems)[number];
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative bg-bg"
    >
      <Link
        href={`/systems#${system.slug}`}
        className="flex h-full flex-col p-6 transition-colors duration-500 sm:p-8"
      >
        {/* 悬停时自下而上生长的指示线 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cap transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />

        <div className="flex items-start justify-between gap-4">
          <span className="type-label text-cap" data-numeric>
            {system.code}
          </span>
          <SystemGlyph
            glyph={system.glyph}
            className="h-9 w-12 shrink-0 text-faint transition-colors duration-500 group-hover:text-cap"
          />
        </div>

        <h3 className="mt-8 text-[1.375rem] font-semibold tracking-[-0.01em]">
          {system.name}
        </h3>
        <p className="type-label-sm mt-2 text-faint">{system.nameEn}</p>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
          {system.tagline}
        </p>

        <div className="mt-auto flex items-center justify-between pt-8">
          <span className="type-label-sm rounded-chip border border-line px-2.5 py-1 text-muted">
            {system.role}
          </span>
          <span
            aria-hidden
            className={cx(
              "inline-flex items-center gap-2 text-[0.8125rem] text-faint transition-colors duration-500 group-hover:text-cap",
            )}
          >
            查看
            <svg viewBox="0 0 16 8" className="h-2 w-4 overflow-visible" fill="none">
              <path
                d="M0 4h13M10 1l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function SystemsShowcase() {
  return (
    <div className="grid gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
      {systems.map((system, i) => (
        <SystemCell key={system.slug} system={system} index={i} />
      ))}
    </div>
  );
}
