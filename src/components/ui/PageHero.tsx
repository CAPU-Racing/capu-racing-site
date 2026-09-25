import type { ReactNode } from "react";
import { Container } from "@/components/ui/SectionHeader";
import { GridBackdrop } from "@/components/ui/Motion";
import { MaskedLines } from "@/components/ui/Reveal";
import { cx } from "@/lib/motion";

/**
 * 内页页头。
 * 统一的结构：等宽编号 + 英文标签 → 主标题（遮罩揭示）→ 说明 → 可选右侧信息栏。
 * 顶部铺一层图纸网格，让内页与首页视觉连续。
 */
export function PageHero({
  index,
  label,
  titleLines,
  lead,
  aside,
  className,
}: {
  index: string;
  label: string;
  titleLines: string[];
  lead?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden border-b border-line pb-14 pt-14 sm:pb-20 sm:pt-20",
        className,
      )}
    >
      <GridBackdrop />
      <Container wide className="relative">
        <div className="flex items-center gap-3 text-muted">
          <span className="type-label text-accent" data-numeric>
            {index}
          </span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          <span className="type-label">{label}</span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MaskedLines
              as="h1"
              lines={titleLines}
              className="type-display-page max-w-[20ch]"
            />
            {lead && (
              <div className="type-lead mt-8 max-w-[54ch]">{lead}</div>
            )}
          </div>

          {aside && (
            <div className="lg:col-span-4 lg:pt-2">{aside}</div>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * 数据表（datasheet 风格）。
 * 用于「车队概况」这类键值信息，发丝线分隔，键位为等宽小字。
 */
export function SpecTable({
  rows,
  className,
}: {
  rows: { key: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cx("border-t border-line", className)}>
      {rows.map((row) => (
        <div
          key={row.key}
          className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-line py-3.5 sm:grid-cols-[9rem_1fr]"
        >
          <dt className="type-label-sm text-faint">{row.key}</dt>
          <dd className="text-[0.9375rem] leading-relaxed">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 通用内容区段：统一上下留白 */
export function Section({
  children,
  className,
  id,
  theme,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /** 传入 "ink" 切换到深色区段 */
  theme?: "ink";
}) {
  return (
    <section
      id={id}
      className={cx(
        "relative py-16 sm:py-24 lg:py-28",
        theme === "ink" && "theme-ink bg-bg text-fg",
        className,
      )}
      style={{ scrollMarginTop: "96px" }}
    >
      {children}
    </section>
  );
}
