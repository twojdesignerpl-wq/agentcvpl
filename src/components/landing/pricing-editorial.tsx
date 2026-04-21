"use client";

import { motion } from "motion/react";
import { Check, Star, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { MagneticButton } from "./_shared/magnetic-button";
import { pricingPlans, type PricingPlan } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const popular = !!plan.popular;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-7 overflow-hidden rounded-3xl border p-8 lg:p-9",
        popular
          ? "border-[color:var(--saffron)] bg-[color:var(--ink)] text-[color:var(--cream)] shadow-[0_48px_96px_-40px_rgba(10,14,26,0.55)]"
          : "border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] text-[color:var(--ink)]",
      )}
    >
      {popular && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "url(/grain.svg)",
              backgroundSize: "240px 240px",
              mixBlendMode: "screen",
            }}
          />
          <div className="absolute -right-2 top-6 rotate-[8deg] rounded-full bg-[color:var(--saffron)] px-4 py-1.5">
            <span className="mono-label flex items-center gap-1.5 text-[color:var(--ink)]">
              <Star size={12} weight="fill" />
              {plan.highlight}
            </span>
          </div>
        </>
      )}

      <div className="relative flex items-baseline justify-between">
        <h3
          className={cn(
            "font-display text-[2rem] font-bold tracking-tight",
            popular ? "text-[color:var(--cream)]" : "text-[color:var(--ink)]",
          )}
        >
          {plan.name}
        </h3>
        <span
          className={cn(
            "mono-label",
            popular ? "text-[color:var(--cream)]/50" : "text-[color:var(--ink)]/45",
          )}
        >
          0{index + 1}
        </span>
      </div>

      <div className="relative flex items-baseline gap-2">
        <span
          className={cn(
            "font-display text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-tighter",
            popular ? "text-[color:var(--cream)]" : "text-[color:var(--ink)]",
          )}
        >
          {plan.price}
        </span>
        <span
          className={cn(
            "font-body text-[0.95rem]",
            popular ? "text-[color:var(--cream)]/65" : "text-[color:var(--ink)]/60",
          )}
        >
          / {plan.cadence}
        </span>
      </div>

      <p
        className={cn(
          "relative font-display text-[1.1rem] font-semibold leading-snug",
          popular ? "text-[color:var(--saffron)]" : "text-[color:var(--ink)]/80",
        )}
      >
        {plan.tagline}
      </p>

      <ul className="relative flex flex-1 flex-col gap-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-[1.5rem] shrink-0 items-center"
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full",
                  popular
                    ? "bg-[color:var(--saffron)] text-[color:var(--ink)]"
                    : "bg-[color:var(--ink)] text-[color:var(--cream)]",
                )}
              >
                <Check size={12} weight="bold" />
              </span>
            </span>
            <span
              className={cn(
                "flex-1 font-body text-[0.95rem] leading-[1.5]",
                popular ? "text-[color:var(--cream)]/90" : "text-[color:var(--ink)]/78",
              )}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative pt-2">
        <MagneticButton
          href={plan.ctaHref}
          variant={popular ? "saffron" : "ghost-ink"}
          size="md"
          className="w-full"
        >
          {plan.cta}
          <ArrowRight size={16} weight="bold" />
        </MagneticButton>
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
        {pricingPlans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} index={i} />
        ))}
      </div>

      <p className="mt-10 text-center mono-label text-[color:var(--ink)]/50">
        Wszystkie plany · VAT w cenie · płatności obsługuje Stripe (PL) · faktury automatyczne
      </p>
    </Section>
  );
}
