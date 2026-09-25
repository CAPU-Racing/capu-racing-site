"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Emblem } from "@/components/ui/BrandMarks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/SectionHeader";
import {
  DUR,
  EASE_OUT_EXPO,
  cx,
  springSnappy,
} from "@/lib/motion";
import { announcement, contact, ctaNav, nav, team } from "@/lib/site";

/**
 * 顶部公告条
 * ---------------------------------------------------------------------------
 * 取代了原来的「航电数据条」。原来那条：
 *   1）内容（校名、校区、SINCE）页脚已经有，属于重复信息；
 *   2）随滚动收缩只有一个 24px 阈值，停在该位置附近时会高频横跳。
 * 公告条不参与任何滚动动画，只在用户点关闭时收起，因此天然不存在抖动。
 *
 * 关闭状态写入 localStorage，并在首帧前由根布局的脚本回填（见 app/layout.tsx），
 * 所以重复访问时不会先看到公告条再消失。
 */
function AnnouncementBar() {
  const [open, setOpen] = useState(true);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(`capu.announcement.${announcement.id}`, "1");
    } catch {
      // 隐私模式等写入失败的场景，本次会话内关掉即可
    }
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          data-announcement-bar
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
          className="overflow-hidden border-b border-line bg-ink text-white"
        >
          <Container wide>
            <div className="flex h-10 items-center gap-4">
              <span className="flex shrink-0 items-center gap-2">
                <span aria-hidden className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cap opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cap" />
                </span>
                <span className="type-label-sm text-white/45">
                  {announcement.label}
                </span>
              </span>

              <Link
                href={announcement.href}
                className="type-label-sm group flex min-w-0 flex-1 items-center gap-2 text-white/85 transition-colors duration-300 hover:text-white"
              >
                <span className="truncate">
                  <span className="hidden sm:inline">{announcement.text}</span>
                  <span className="sm:hidden">{announcement.textShort}</span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={dismiss}
                aria-label="关闭公告"
                className="-mr-2 flex h-8 w-8 shrink-0 items-center justify-center text-white/45 transition-colors duration-300 hover:text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden
                >
                  <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={`${team.name} 首页`}
    >
      <Emblem size={compact ? 32 : 38} priority className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
          CAPU <span className="text-cap">RACING</span>
        </span>
        <span className="type-label-sm mt-1 text-faint">
          成航大学生方程式车队
        </span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="主导航" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group relative flex items-center gap-2 px-3 py-2 text-[0.875rem] transition-colors duration-300",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span
                  className={cx(
                    "type-label-sm transition-colors duration-300",
                    active ? "text-cap" : "text-faint group-hover:text-cap",
                  )}
                  data-numeric
                >
                  {item.index}
                </span>
                <span>{item.label}</span>
              </Link>
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-px h-px bg-cap"
                  transition={springSnappy}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
      className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
    >
      <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-line px-5">
        <Wordmark compact />
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center"
          aria-label="关闭菜单"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path
              d="M3 3l14 14M17 3L3 17"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <nav aria-label="移动端导航" className="flex-1 overflow-y-auto px-5 py-8">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
          }}
        >
          {[...nav, ctaNav].map((item) => (
            <motion.li
              key={item.href}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: DUR.base, ease: EASE_OUT_EXPO },
                },
              }}
              className="border-b border-line"
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline justify-between py-5"
              >
                <span className="flex items-baseline gap-4">
                  <span className="type-label text-cap" data-numeric>
                    {item.index}
                  </span>
                  <span className="text-[1.5rem] font-medium tracking-[-0.01em]">
                    {item.label}
                  </span>
                </span>
                <span className="type-label-sm text-faint">
                  {item.labelEn}
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10 space-y-2">
          <p className="type-label text-faint">联系我们</p>
          <p className="text-sm text-muted">{contact.email}</p>
          <p className="text-sm text-muted">{contact.location}</p>
        </div>
      </nav>
    </motion.div>
  );
}

/** 头部收缩 / 展开的两个阈值，中间区间用于吸收抖动 */
const COLLAPSE_AT = 96;
const EXPAND_AT = 40;

export function SiteHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // 迟滞（hysteresis）：收缩与展开使用不同阈值。
  // 原先只用一个 scrollY > 24 的判断，滚到该位置附近时状态会随微小抖动反复切换；
  // 而头部高度变化又会改变视口内几何、反过来影响滚动量，两者互相反馈，
  // 表现出来就是「在收缩与展开之间横跳」。
  useMotionValueEvent(scrollY, "change", (latest) => {
    setCollapsed((prev) => (prev ? latest > EXPAND_AT : latest > COLLAPSE_AT));
  });

  return (
    <>
      {/* 公告条不吸顶：滚过之后自然让出空间，只保留主导航吸顶 */}
      {announcement.enabled && <AnnouncementBar />}

      <header className="sticky top-0 z-50">
        <div
          className={cx(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            collapsed ? "glass-bar border-line" : "border-transparent bg-transparent",
          )}
        >
          <Container wide>
            <motion.div
              initial={false}
              animate={{ height: collapsed ? 62 : 78 }}
              transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
              className="flex items-center justify-between gap-6"
            >
              <Wordmark compact={collapsed} />
              <DesktopNav />
              <div className="flex items-center gap-3">
                {/*
                  显隐由外层容器控制，不要写在 Button 的 className 上：
                  Button 的 base 里就有 inline-flex，与 hidden 同属 utilities 层，
                  Tailwind 按自身顺序输出，inline-flex 会盖掉 hidden，按钮会永远显示。
                */}
                <div className="hidden sm:block">
                  <Button
                    href={ctaNav.href}
                    size="md"
                    variant="primary"
                    withArrow={false}
                  >
                    招新报名
                    <span className="type-label-sm text-white/60" aria-hidden>
                      {ctaNav.index}
                    </span>
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
                  aria-label="打开菜单"
                  aria-expanded={open}
                >
                  <span className="block h-px w-5 bg-fg" />
                  <span className="block h-px w-5 bg-fg" />
                </button>
              </div>
            </motion.div>
          </Container>
        </div>
      </header>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
