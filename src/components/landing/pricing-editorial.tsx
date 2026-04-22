"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { PricingProCard } from "./pricing-pro-card";
import { pricingPlans, type PricingPlan } from "@/lib/landing/content";

/**
 * Karta planu dla Free i Unlimited (bez toggle). Pro używa `PricingProCard`
 * z radio subscription/pack.
 */
function PlainPlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] p-8 text-[color:var(--ink)] lg:p-9"
    >
      <div className="relative flex items-center justify-between">
        <div className="inline-flex size-[72px] items-center justify-center rounded-2xl bg-[color:var(--cream)]/60 p-1 shadow-sm ring-1 ring-[color:var(--ink)]/8">
          <Image
            src={`/brand/pracus/${plan.pracusVariant}.png`}
            alt="Pracuś AI"
            width={64}
            height={64}
            className="size-16 select-none rounded-xl object-cover"
          />
        </div>
        <span className="mono-label text-[color:var(--ink)]/45">0{index + 1}</span>
      </div>

      <h3 className="relative font-display text-[2rem] font-bold tracking-tight text-[color:var(--ink)]">
        {plan.name}
      </h3>

      <div className="relative flex items-baseline gap-2">
        <span className="font-display text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-tighter text-[color:var(--ink)]">
          {plan.price}
        </span>
        <span className="font-body text-[0.95rem] text-[color:var(--ink)]/60">
          / {plan.cadence}
        </span>
      </div>

      {plan.highlight ? (
        <span className="mono-label inline-flex w-fit rounded-full bg-[color:var(--ink)]/8 px-3 py-1 text-[color:var(--ink)]/70">
          {plan.highlight}
        </span>
      ) : null}

      <p className="relative font-display text-[1.1rem] font-semibold leading-snug text-[color:var(--ink)]/80">
        {plan.tagline}
      </p>

      <ul className="relative flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span aria-hidden className="flex h-[1.5rem] shrink-0 items-center">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)]">
                <Check size={12} weight="bold" />
              </span>
            </span>
            <span className="flex-1 font-body text-[0.95rem] leading-[1.5] text-[color:var(--ink)]/78">
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative pt-2">
        <Link
          href={plan.ctaHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-6 py-4 text-[15px] font-semibold tracking-tight text-[color:var(--ink)] transition-all hover:scale-[1.01] hover:border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--cream)] active:scale-[0.99]"
        >
          {plan.cta}
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </motion.article>
  );
}

export function PricingEditorial() {
  return (
    <Section id="cennik" tone="cream" className="pt-24 lg:pt-32">
      <div className="mb-16 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Eyebrow index="08">Cennik</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
            Pierwsze CV gratis.{" "}
            <span className="editorial-underline">Reszta za cenę kawy.</span>
          </h2>
        </div>
        <p className="max-w-sm font-body text-[0.95rem] leading-relaxed text-[color:var(--ink)]/65">
          Bez karty na start. Bez &bdquo;okresu powitalnego&rdquo;. Rezygnacja jednym kliknięciem — od razu, bez wypowiedzenia.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {pricingPlans.map((plan, i) =>
          plan.popular ? (
            <PricingProCard key={plan.id} plan={plan} index={i} />
          ) : (
            <PlainPlanCard key={plan.id} plan={plan} index={i} />
          ),
        )}
      </div>

      {/* Trust row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
        {[
          "Stripe",
          "BLIK",
          "Przelewy24",
          "Faktura VAT",
          "RODO",
          "Anuluj 1-kliknięciem",
        ].map((badge) => (
          <span
            key={badge}
            className="mono-label text-[color:var(--ink)]/55"
          >
            {badge}
          </span>
        ))}
      </div>

      <p className="mt-3 text-center mono-label text-[color:var(--ink)]/40">
        Płatności obsługuje Stripe (PL) · faktury automatyczne
      </p>
    </Section>
  );
}
