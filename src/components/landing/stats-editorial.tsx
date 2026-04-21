"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { InkDivider } from "./_shared/ink-divider";
import { stats } from "@/lib/landing/content";

function NumberTicker({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  const numeric = parseFloat(value.replace(/\s/g, "").replace(",", "."));
  const hasNumber = !Number.isNaN(numeric);
  const shouldAnimate = inView && hasNumber && !reduced;

  const [display, setDisplay] = useState(() => (shouldAnimate ? "0" : value));

  useEffect(() => {
    if (!shouldAnimate) return;
    const controls = animate(0, numeric, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (value.includes("."))
          setDisplay(latest.toFixed(1).replace(".", ","));
        else if (value.includes(" "))
          setDisplay(Math.round(latest).toLocaleString("pl-PL").replace(/,/g, " "));
        else setDisplay(Math.round(latest).toString());
      },
    });
    return () => controls.stop();
  }, [shouldAnimate, numeric, value]);

  return <span ref={ref}>{display}</span>;
}

export function StatsEditorial() {
  return (
    <Section tone="ink" className="py-24 lg:py-32">
      <div className="mb-14">
        <Eyebrow index="06" tone="cream">
          W liczbach
        </Eyebrow>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--cream)]">
          Agent, który{" "}
          <span className="text-[color:var(--saffron)]">dowozi liczby</span>,
          a nie obietnice.
        </h2>
      </div>

      <div className="grid gap-px border border-[color:var(--cream)]/10 bg-[color:var(--cream)]/10 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="relative flex flex-col gap-4 bg-[color:var(--ink)] p-8 lg:p-10"
          >
            <div className="flex items-baseline gap-1 editorial-number whitespace-nowrap text-[clamp(2.5rem,4.2vw,3.75rem)] font-bold text-[color:var(--cream)]">
              <NumberTicker value={stat.value} />
              {stat.unit && (
                <span className="text-[0.5em] font-semibold text-[color:var(--saffron)]">
                  {stat.unit}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-display text-[1rem] font-semibold uppercase tracking-wider text-[color:var(--cream)]">
                {stat.label}
              </p>
              <p className="font-body text-[0.88rem] leading-relaxed text-[color:var(--cream)]/60">
                {stat.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-[color:var(--cream)]/30">
        <InkDivider />
      </div>
    </Section>
  );
}
