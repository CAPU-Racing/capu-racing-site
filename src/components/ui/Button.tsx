import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/motion";

type Variant = "primary" | "outline" | "ghost" | "ink";
type Size = "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden rounded-hair font-medium transition-[color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50";

/*
 * ⚠️ 不要用 className 给 Button 传 display 相关类（hidden / block / flex …）。
 * base 里已经写了 inline-flex，两者同属 Tailwind 的 utilities 层，
 * 最终生效的是输出顺序靠后的那个，而不是你写在 className 里的那个，
 * 所以 className="hidden sm:inline-flex" 会让按钮永远显示。
 * 需要响应式显隐时，外面套一层容器，把显隐写在容器上。
 */

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.875rem]",
  lg: "h-14 px-7 text-[0.9375rem]",
};

const variants: Record<Variant, string> = {
  // 实心：成航蓝底，悬停时颜色加深
  primary:
    "bg-cap text-white hover:bg-cap-700 shadow-[0_1px_0_rgba(7,21,35,0.08)]",
  // 描边：默认透明，悬停时底色自下而上填充
  outline:
    "border border-line-strong text-fg hover:text-bg [&_.fill]:bg-fg",
  // 幽灵：仅文字 + 下划线位移
  ghost: "px-0 text-fg hover:text-cap",
  // 深色区段里的反白按钮
  ink: "bg-fg text-bg hover:opacity-90",
};

/** 悬停时自下而上填充的背景层 */
function Fill() {
  return (
    <span
      aria-hidden
      className="fill pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
    />
  );
}

function Inner({
  children,
  variant,
  withArrow = true,
}: {
  children: ReactNode;
  variant: Variant;
  withArrow?: boolean;
}) {
  if (variant === "ghost") {
    return (
      <>
        <span className="relative">{children}</span>
        {withArrow && <Arrow />}
      </>
    );
  }

  return (
    <>
      {variant === "outline" && <Fill />}
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {withArrow && <Arrow />}
      </span>
    </>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 8"
      className="h-2 w-4 shrink-0 overflow-visible"
      fill="none"
    >
      <path
        d="M0 4h13"
        stroke="currentColor"
        strokeWidth="1.25"
        className="origin-left scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-110"
      />
      <path
        d="M10 1l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
      />
    </svg>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  href?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

/**
 * 站点按钮。
 * 悬停用 CSS 过渡（性能更好、无需 JS），因此本组件可以是服务端组件。
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  withArrow,
  className,
  href,
  ...rest
}: ButtonProps) {
  const classes = cx(
    base,
    variant !== "ghost" && sizes[size],
    variants[variant],
    className,
  );

  const showArrow = withArrow ?? variant !== "primary";

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          <Inner variant={variant} withArrow={showArrow}>
            {children}
          </Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        <Inner variant={variant} withArrow={showArrow}>
          {children}
        </Inner>
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      <Inner variant={variant} withArrow={showArrow}>
        {children}
      </Inner>
    </button>
  );
}
