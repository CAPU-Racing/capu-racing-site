"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { HorizonArc } from "@/components/ui/BrandMarks";
import { CarSchematic } from "@/components/ui/CarSchematic";
import { GridBackdrop, Marquee } from "@/components/ui/Motion";
import { Container } from "@/components/ui/SectionHeader";
import { MaskedLines } from "@/components/ui/Reveal";
import { DUR, EASE_OUT_EXPO, cx } from "@/lib/motion";
import { school, team } from "@/lib/site";

const TECH_KEYWORDS = [
  "VCU",
  "BMS",
  "CAN BUS",
  "SIMULINK",
  "STM32",
  "SUSPENSION GEOMETRY 悬架几何",
  "HIGH VOLTAGE SAFETY 高压安全",
  "DATA LOGGING 数据采集",
  "CARBON FIBRE 碳纤维",
  "VEHICLE INTEGRATION 整车联调",
];

/** 招新状态标记：呼吸点的节奏刻意放慢，避免抢注意力 */
function SeasonStatus() {
  return (
    <span className="type-label-sm inline-flex items-center gap-2.5 text-muted">
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cap opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cap" />
      </span>
      2026 赛季 · 招新进行中
    </span>
  );
}

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const intro = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.slow, ease: EASE_OUT_EXPO, delay },
        };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-10 pt-10 sm:pt-14 lg:pb-14"
    >
      <GridBackdrop />
      {/* 地平线母题：低调地铺在整车制图之后，呼应校徽中的地平线 */}
      <HorizonArc className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px] text-cap opacity-[0.08]" />

      <Container wide className="relative">
        <motion.div
          style={reduced ? undefined : { y: textY, opacity: textOpacity }}
          className="grid gap-10 lg:grid-cols-12 lg:gap-8"
        >
          <div className="lg:col-span-7">
            <motion.div {...intro(0.05)}>
              <SeasonStatus />
            </motion.div>

            <MaskedLines
              as="h1"
              lines={["成航CAPU", "大学生方程式车队"]}
              className="type-display-hero mt-7"
              lineClassName="text-fg"
              delay={0.12}
              stagger={0.1}
            />

            <motion.p
              {...intro(0.4)}
              className="type-label-sm mt-7 text-faint"
            >
              {school.nameEn}
            </motion.p>
          </div>

          <motion.div
            {...intro(0.5)}
            className="flex flex-col justify-end lg:col-span-5 lg:pb-1 lg:pt-14"
          >
            <p className="max-w-[32ch] text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]">
              {team.slogan}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/join" size="lg" variant="primary" withArrow>
                在线报名
              </Button>
              <Button href="/systems" size="lg" variant="outline">
                了解四个组别
              </Button>
            </div>

            <dl className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6">
              {[
                { k: "技术组别", v: "04 个" },
                { k: "基础要求", v: "零基础可报" },
                { k: "专业限制", v: "不限专业年级" },
              ].map((item) => (
                <div key={item.k} className="flex items-baseline gap-2.5">
                  <dt className="type-label-sm text-faint">{item.k}</dt>
                  <dd className="text-[0.875rem] font-medium">{item.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      </Container>

      {/* 整车制图：Hero 的主视觉 */}
      <Container wide className="relative mt-10 sm:mt-14">
        <CarSchematic className="text-fg" />
      </Container>

      {/* 底部技术栈滚动条 */}
      <div className="relative mt-10 border-y border-line sm:mt-14">
        <Container wide className="flex items-center gap-6">
          <span className="type-label-sm hidden shrink-0 py-4 text-faint md:block">
            技术栈
          </span>
          <span
            aria-hidden
            className="hidden h-8 w-px shrink-0 bg-line md:block"
          />
          <Marquee
            items={TECH_KEYWORDS}
            className="flex-1 py-4"
            itemClassName="type-label-sm text-muted"
            duration={48}
          />
          <a
            href="#positions"
            className={cx(
              "type-label-sm hidden shrink-0 items-center gap-2 py-4 text-faint transition-colors duration-300 hover:text-fg lg:flex",
            )}
          >
            向下浏览
            <motion.span
              aria-hidden
              animate={reduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block h-3 w-px bg-current"
            />
          </a>
        </Container>
      </div>
    </section>
  );
}
