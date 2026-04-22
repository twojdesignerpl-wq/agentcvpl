"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Star } from "@phosphor-icons/react/dist/ssr";
import type { PricingPlan } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

type Mode = "sub" | "pack";

type Props = {
  plan: PricingPlan;
  index: number;
};

/**
 * Pro card z radio sub/pack. Reszta kart pozostaje Server Component.
 * Toggle zmienia wyświetlaną cenę, subtitle i CTA href — kwota 19 zł jest stała.
 */
export function PricingProCard({ plan, index }: Props) {
  const [mode, setMode] = useState<Mode>("sub");
  const hasOneTime = Boolean(plan.oneTime);

  const displayPrice = mode === "pack" && plan.oneTime ? plan.oneTime.price : plan.price;
  const displayCadence = mode === "pack" && plan.oneTime ? plan.oneTime.cadence : plan.cadence;
  const ctaHref = mode === "pack" && plan.oneTime ? plan.oneTime.href : plan.ctaHref;
  const ctaLabel = mode === "pack" && plan.oneTime ? plan.oneTime.cta : plan.cta;
  const subtitle =
    mode === "pack" && plan.oneTime
      ? plan.oneTime.note
      : `odnawia się · anulujesz kiedy chcesz`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-[color:var(--saffron)] bg-[color:var(--ink)] p-8 text-[color:var(--cream)] shadow-[0_48px_96px_-40px_rgba(10,14,26,0.55)] lg:p-9"
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/grain.svg)",
          backgroundSize: "240px 240px",
          mixBlendMode: "screen",
        }}
      />

      {/* Popular badge */}
      {plan.highlight ? (
        <div className="absolute -right-2 top-6 rotate-[8deg] rounded-full bg-[color:var(--saffron)] px-4 py-1.5 shadow-lg">
          <span className="mono-label flex items-center gap-1.5 text-[color:var(--ink)]">
            <Star size={12} weight="fill" />
            {plan.highlight}
          </span>
        </div>
      ) : null}

      {/* Pracuś podobizna */}
      <div className="relative flex items-center justify-between">
        <div className="inline-flex size-[72px] items-center justify-center rounded-2xl bg-[color:var(--cream)]/8 p-1">
          <Image
            src={`/brand/pracus/${plan.pracusVariant}.png`}
            alt="Pracuś AI"
            width={64}
            height={64}
            className="size-16 select-none rounded-xl object-cover"
          />
        </div>
        <span className="mono-label text-[color:var(--cream)]/50">0{index + 1}</span>
      </div>

      <h3 className="relative font-display text-[2rem] font-bold tracking-tight text-[color:var(--cream)]">
        {plan.name}
      </h3>

      {/* Dynamic price */}
      <div className="relative">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-tighter text-[color:var(--cream)]">
            {displayPrice}
          </span>
          <span className="font-body text-[0.95rem] text-[color:var(--cream)]/65">
            / {displayCadence}
          </span>
        </div>
        <p className="mt-2 font-body text-[13px] leading-snug text-[color:var(--saffron-soft,#F4C794)]/90">
          {subtitle}
        </p>
      </div>

      <p className="relative font-display text-[1.1rem] font-semibold leading-snug text-[color:var(--saffron)]">
        {plan.tagline}
      </p>

      {/* Radio sub/pack — only if oneTime exists */}
      {hasOneTime ? (
        <fieldset className="relative rounded-2xl border border-[color:var(--cream)]/15 bg-[color:var(--ink)]/60 p-1.5">
          <legend className="sr-only">Wybierz sposób płatności</legend>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setMode("sub")}
              className={cn(
                "rounded-xl px-3 py-2.5 text-left text-[12.5px] font-semibold transition-colors",
                mode === "sub"
                  ? "bg-[color:var(--saffron)] text-[color:var(--ink)]"
                  : "text-[color:var(--cream)]/80 hover:bg-[color:var(--cream)]/5",
              )}
              aria-pressed={mode === "sub"}
            >
              <span className="block">Miesięcznie</span>
              <span
                className={cn(
                  "mono-label mt-0.5 block text-[0.54rem]",
                  mode === "sub" ? "text-[color:var(--ink)]/65" : "text-[color:var(--cream)]/50",
                )}
              >
                Odnawia się
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode("pack")}
              className={cn(
                "rounded-xl px-3 py-2.5 text-left text-[12.5px] font-semibold transition-colors",
                mode === "pack"
                  ? "bg-[color:var(--saffron)] text-[color:var(--ink)]"
                  : "text-[color:var(--cream)]/80 hover:bg-[color:var(--cream)]/5",
              )}
              aria-pressed={mode === "pack"}
            >
              <span className="block">Jednorazowo</span>
              <span
                className={cn(
                  "mono-label mt-0.5 block text-[0.54rem]",
                  mode === "pack" ? "text-[color:var(--ink)]/65" : "text-[color:var(--cream)]/50",
                )}
              >
                10 CV, bez odnowień
              </span>
            </button>
          </div>
        </fieldset>
      ) : null}

      <ul className="relative flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span aria-hidden className="flex h-[1.5rem] shrink-0 items-center">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)]">
                <Check size={12} weight="bold" />
              </span>
            </span>
            <span className="flex-1 font-body text-[0.95rem] leading-[1.5] text-[color:var(--cream)]/90">
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative pt-2">
        <Link
          href={ctaHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--saffron)] px-6 py-4 text-[15px] font-semibold tracking-tight text-[color:var(--ink)] transition-all hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
        >
          {ctaLabel}
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </motion.article>
  );
}
