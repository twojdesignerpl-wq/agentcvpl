"use client";

import type { ComponentType } from "react";
import { motion } from "motion/react";
import { FileText, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { processSteps } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

type PhosphorIcon = ComponentType<{ size?: number; weight?: "regular" | "bold" | "duotone" | "fill" }>;

const ICONS: (PhosphorIcon | null)[] = [FileText, null, DownloadSimple];

export function ProcessTimeline() {
  return (
    <Section id="proces" tone="cream-deep" className="pt-24 lg:pt-32">
      <div className="mb-16 flex flex-col gap-5">
        <Eyebrow index="04">Jak działa agent</Eyebrow>
        <h2 className="max-w-4xl font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
          Trzy kroki. Pięć minut.{" "}
          <span className="editorial-underline">Jedno CV, które działa.</span>
        </h2>
      </div>

      {/* Zig-zag timeline */}
      <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
        {/* Animated connector */}
        <svg
          aria-hidden
          viewBox="0 0 1200 40"
          className="absolute left-0 right-0 top-28 hidden h-10 w-full text-[color:var(--ink)]/30 lg:block"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 20 Q 300 -10, 600 20 T 1200 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 8"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {processSteps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={step.index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className={cn(
                "relative flex flex-col gap-5",
                i === 1 && "lg:mt-20",
                i === 2 && "lg:mt-10",
              )}
            >
              {/* Oversized number */}
              <div className="relative">
                <span
                  aria-hidden
                  className="font-display text-[9rem] font-black leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--saffron)]"
                >
                  {step.index}
                </span>
                <div
                  className={cn(
                    "absolute right-6 top-4 flex items-center justify-center rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream-soft)] text-[color:var(--ink)]",
                    i === 1
                      ? "h-16 w-16 shadow-[0_8px_24px_-12px_rgba(10,14,26,0.25)] ring-1 ring-[color:var(--saffron)]/25"
                      : "h-14 w-14",
                  )}
                >
                  {i === 1 ? (
                    <PracusMark size={44} online />
                  ) : Icon ? (
                    <Icon size={22} weight="duotone" />
                  ) : null}
                </div>
              </div>

              <div className="max-w-sm">
                <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-tight text-[color:var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-[0.98rem] leading-relaxed text-[color:var(--ink)]/72">
                  {step.body}
                </p>
                <p className="mt-4 mono-label inline-flex items-center gap-2 rounded-full border border-[color:var(--ink)]/12 px-3 py-1 text-[color:var(--ink)]/55">
                  <span className="agent-dot" />
                  {step.caption}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
