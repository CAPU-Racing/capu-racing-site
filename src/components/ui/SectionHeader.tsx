import type { ReactNode } from "react";
import { cx } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/Reveal";

/**
 * 章节头：等宽编号 + 英文小标签 + 标题（遮罩揭示）+ 说明 + 右侧操作区。
 * 编号与英文标签的组合是全站的排版骨架，用于建立秩序感。
 */
export function SectionHeader({
  index,
  label,
  title,
  titleLines,
  description,
  action,
  className,
  size = "lg",
}: {
  index: string;
  /** 英文小标签，等宽大写 */
  label: string;
  title?: string;
  /** 需要逐行揭示时传入分行后的标题 */
  titleLines?: string[];
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: "lg" | "md";
}) {
  const lines = titleLines ?? (title ? [title] : []);

  return (
    <div
      className={cx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 text-muted">
          <span className="type-label text-accent" data-numeric>
            {index}
          </span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          <span className="type-label">{label}</span>
        </div>

        <MaskedLines
          as="h2"
          lines={lines}
          className={cx("mt-5", size === "lg" ? "type-h1" : "type-h2")}
        />

        {description && (
          <div className="type-lead mt-5 max-w-[46ch]">{description}</div>
        )}
      </div>

      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  );
}

/** 通用区块容器：统一左右留白与最大宽度 */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        wide ? "max-w-[1680px]" : "max-w-[1320px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** 横向数据条，用于区块之间的分隔与状态展示 */
export function TelemetryRule({ className }: { className?: string }) {
  return <div aria-hidden className={cx("telemetry-rule", className)} />;
}
