import { Counter } from "@/components/ui/Motion";
import { Reveal } from "@/components/ui/Reveal";
import { teamStats } from "@/lib/site";

/**
 * 数据条。
 * 通栏发丝线栅格（格间留 1px 露出分隔线色），
 * 像仪表读数一样排列，强化「可被核对」的观感。
 */
export function StatsBand() {
  return (
    <section className="border-y border-line">
      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {teamStats.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 0.07}
            className="bg-bg px-5 py-9 sm:px-8 sm:py-11 lg:px-12"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-label text-muted">{item.label}</span>
              <span className="type-label-sm text-faint">{item.labelEn}</span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              {item.animated ? (
                <Counter
                  value={item.value}
                  className="text-[clamp(2.5rem,4.2vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]"
                  duration={1.4}
                />
              ) : (
                <span
                  data-numeric
                  className="text-[clamp(2.5rem,4.2vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]"
                >
                  {item.value}
                </span>
              )}
              <span className="text-sm text-muted">{item.unit}</span>
            </div>

            <p className="mt-4 max-w-[26ch] text-[0.8125rem] leading-relaxed text-muted">
              {item.note}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
