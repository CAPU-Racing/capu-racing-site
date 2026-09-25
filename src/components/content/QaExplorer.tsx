"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { cx, springSnappy } from "@/lib/motion";

export type QaGroupView = {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  items: { slug: string; question: string; html: string; plain: string }[];
};

/**
 * Q&A 浏览器。
 * 分类切换 + 关键词过滤在前端完成（数据量在几十条量级，无需请求后端）。
 * 分类指示条用 layoutId 做位移动画，关键词高亮不做，避免把正文切碎。
 */
export function QaExplorer({ groups }: { groups: QaGroupView[] }) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();

  const total = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups],
  );

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const source =
      active === "all" ? groups : groups.filter((group) => group.id === active);

    return source.flatMap((group) =>
      group.items
        .filter((item) => {
          if (!trimmed) return true;
          return (
            item.question.toLowerCase().includes(trimmed) ||
            item.plain.toLowerCase().includes(trimmed)
          );
        })
        .map((item) => ({ ...item, groupLabel: group.label })),
    );
  }, [groups, active, query]);

  const activeGroup = groups.find((group) => group.id === active);

  const tabs = [
    { id: "all", label: "全部", count: total },
    ...groups.map((group) => ({
      id: group.id,
      label: group.label,
      count: group.items.length,
    })),
  ];

  return (
    <div>
      {/* 过滤栏 */}
      <div className="glass-bar sticky top-[62px] z-40 -mx-5 border-y border-line px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="问答分类"
            className="no-scrollbar flex items-center gap-1 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.id)}
                  className={cx(
                    "relative flex shrink-0 items-center gap-2 px-3 py-2 text-[0.875rem] transition-colors duration-300",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cx(
                      "type-label-sm",
                      isActive ? "text-cap" : "text-faint",
                    )}
                    data-numeric
                  >
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="qa-tab"
                      className="absolute inset-x-2 -bottom-px h-px bg-cap"
                      transition={springSnappy}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3 lg:w-72">
            <span className="sr-only">搜索问答</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索关键词，如「零基础」"
              className="h-10 w-full border-b border-line bg-transparent text-[0.875rem] text-fg outline-none transition-colors duration-300 placeholder:text-faint focus:border-cap"
            />
            <span className="type-label-sm shrink-0 text-faint" data-numeric>
              {String(visible.length).padStart(2, "0")}
            </span>
          </label>
        </div>
      </div>

      {/* 当前分类说明 */}
      <AnimatePresence mode="wait" initial={false}>
        {activeGroup && (
          <motion.p
            key={activeGroup.id}
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="type-lead mt-8 max-w-[52ch] text-[0.9375rem]"
          >
            {activeGroup.description}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 列表 */}
      {visible.length > 0 ? (
        <Accordion
          className="mt-8"
          items={visible.map((item) => ({
            id: item.slug,
            question: item.question,
            html: item.html,
            meta: active === "all" ? item.groupLabel : undefined,
          }))}
          defaultOpenId={visible[0]?.slug}
        />
      ) : (
        <div className="mt-12 border-t border-line py-16">
          <p className="type-label text-faint">没有匹配的问答</p>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-muted">
            换一个关键词试试，或者
            <a
              href="/contact"
              className="text-cap underline decoration-cap/40 underline-offset-4"
            >
              直接联系我们
            </a>
            ，问题会在下一轮补充进这里。
          </p>
        </div>
      )}
    </div>
  );
}
