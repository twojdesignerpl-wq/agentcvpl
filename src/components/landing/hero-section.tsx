"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { MagneticButton } from "./_shared/magnetic-button";
import { AgentChip } from "./_shared/agent-chip";
import { hero } from "@/lib/landing/content";

const LiveCvCanvas = dynamic(
  () => import("./hero/live-cv-canvas").then((m) => m.LiveCvCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[1/1.32] w-full animate-pulse rounded-[2px] bg-[color:var(--cream-deep)] ring-ink" />
    ),
  },
);

export function HeroSection() {
  return (
    <Section tone="cream" className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      {/* Decorative editorial grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      {/* Huge editorial watermark number */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-10 select-none font-display text-[18rem] font-black leading-none tracking-tighter text-[color:var(--ink)]/[0.025] lg:text-[26rem]"
      >
        01
      </div>

      <div className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* LEFT — editorial headline */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <AgentChip label={hero.eyebrow.toUpperCase()} />
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.035em] text-[color:var(--ink)]">
            {hero.headlineLines.map((line, i) => {
              const isLast = i === hero.headlineLines.length - 1;
              const rest = isLast ? line.replace(hero.headlineHighlight + ".", "") : line;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block"
                >
                  {isLast ? (
                    <>
                      {rest}
                      <span className="editorial-underline">{hero.headlineHighlight}</span>.
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-8 max-w-[56ch] font-body text-[1.05rem] leading-relaxed text-[color:var(--ink)]/75 sm:text-[1.15rem]"
          >
            {hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/kreator" variant="ink" size="lg">
              {hero.primaryCta}
              <ArrowRight size={18} weight="bold" />
            </MagneticButton>
            <MagneticButton href="#proces" variant="ghost-ink" size="lg">
              <PlayCircle size={18} weight="bold" />
              {hero.ghostCta}
            </MagneticButton>
          </motion.div>

          {/* Stats strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-12 grid max-w-xl grid-cols-2 gap-x-4 gap-y-5 border-t border-[color:var(--ink)]/12 pt-6 sm:mt-14 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-6 md:gap-x-8"
          >
            {hero.stats.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col gap-1.5 sm:gap-2"
              >
                <dt className="mono-label whitespace-normal text-[clamp(0.6rem,2.6vw,0.75rem)] leading-snug text-[color:var(--ink)]/50">
                  {s.label}
                </dt>
                <dd className="font-display text-[clamp(1.1rem,4.8vw,1.5rem)] font-bold leading-none tracking-tight text-[color:var(--ink)] tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* RIGHT — live CV canvas */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <LiveCvCanvas />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
