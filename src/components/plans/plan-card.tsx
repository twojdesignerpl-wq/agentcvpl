"use client";

import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { CheckoutButton } from "@/app/subskrypcja/checkout-button";
import type { PlanOffer } from "./offers";
import { cn } from "@/lib/utils";

type Props = {
  offer: PlanOffer;
  /** Wyświetlane gdy user ma już ten plan (blokuje CTA). */
  isCurrent?: boolean;
  /** Wyłącz CTA (Stripe niedostępny). */
  stripeReady?: boolean;
  /** "default" — pełna karta z PracusMark 56px. "compact" — mobile/modal, Pracus 40px. */
  size?: "default" | "compact";
};

/**
 * Reusable PlanCard dla 3 ofert (Pro Pack / Pro / Unlimited).
 * Zachowuje spójność wizualną i identyfikację marki (PracusMark wszędzie).
 *
 * Layout:
 *   [PracusMark]            [Badge]
 *   <Title>
 *   <Price> <cadence>
 *
 *   <tagline>
 *
 *   • feature 1
 *   • feature 2
 *   ... (flex-1 — wypełnia przestrzeń żeby CTA był na dole nawet gdy lista krótsza)
 *
 *   [CheckoutButton]
 */
export function PlanCard({ offer, isCurrent, stripeReady = true, size = "default" }: Props) {
  const reduced = useReducedMotion();
  const isCompact = size === "compact";
  const pracusSize = isCompact ? 40 : 56;

  return (
    <motion.article
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: offer.highlight ? -4 : -2 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-[border-color,box-shadow,transform] duration-300",
        isCompact ? "p-5" : "p-7",
        offer.highlight
          ? "border-[color:var(--ink)] bg-[color:var(--cream-soft)] shadow-[0_24px_64px_-28px_rgba(10,14,26,0.35),inset_0_1px_0_0_rgba(255,255,255,0.5)]"
          : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white hover:border-[color:color-mix(in_oklab,var(--ink)_24%,transparent)] hover:shadow-[0_18px_48px_-24px_rgba(10,14,26,0.22)]",
      )}
    >
      {/* Highlight accent — saffron corner gradient w Pack */}
      {offer.highlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[color:color-mix(in_oklab,var(--saffron)_28%,transparent)] opacity-60 blur-3xl"
        />
      ) : null}

      {/* Header — PracusMark (marka) + badge */}
      <header className="relative flex items-start justify-between gap-3">
        <div className="relative">
          <PracusMark
            size={pracusSize}
            online={offer.highlight}
            variant={isCompact ? "compact" : "compact"}
          />
          {offer.highlight ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[11px] ring-2 ring-[color:var(--saffron)]/40"
              animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </div>
        <span
          className={cn(
            "mono-label shrink-0 rounded-full px-3 py-1 text-[0.58rem]",
            offer.highlight
              ? "bg-[color:var(--saffron)]/28 text-[color:var(--ink)]"
              : "bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] text-[color:var(--ink-muted)]",
          )}
        >
          {offer.badge}
        </span>
      </header>

      {/* Title + price */}
      <div className={cn("relative", isCompact ? "mt-4" : "mt-5")}>
        <h3
          className={cn(
            "font-display font-bold tracking-[-0.02em]",
            isCompact ? "text-[1.35rem]" : "text-[1.75rem]",
          )}
        >
          {offer.label}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cn(
              "font-display font-bold leading-none tracking-[-0.025em]",
              isCompact ? "text-[2rem]" : "text-[2.5rem]",
            )}
          >
            {offer.price}
          </span>
          <span className="text-[13px] text-[color:var(--ink-muted)]">{offer.cadence}</span>
        </div>
      </div>

      {/* Tagline */}
      <p
        className={cn(
          "relative mt-3 leading-relaxed text-[color:var(--ink-soft)]",
          isCompact ? "text-[13px]" : "text-[14px]",
        )}
      >
        {offer.tagline}
      </p>

      {/* Features — flex-1 żeby CTA był na dole */}
      <ul className={cn("relative mt-5 flex flex-1 flex-col", isCompact ? "gap-2" : "gap-2.5")}>
        {offer.features.map((f) => (
          <li
            key={f}
            className={cn(
              "flex items-start gap-2.5",
              isCompact ? "text-[13px]" : "text-[14px]",
            )}
          >
            <CheckCircle
              size={isCompact ? 14 : 16}
              weight="fill"
              className="mt-0.5 shrink-0 text-[color:var(--jade)]"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA — zawsze na dole dzięki flex-1 powyżej */}
      <div className={cn("relative", isCompact ? "mt-5" : "mt-7")}>
        {isCurrent ? (
          <span className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--jade)]/40 bg-[color:var(--jade)]/10 px-4 py-3 text-[14px] font-semibold text-[color:var(--jade)]">
            Twój aktualny plan
          </span>
        ) : (
          <CheckoutButton
            plan={offer.ctaPlan}
            mode={offer.ctaMode}
            label={offer.ctaLabel}
            variant={offer.highlight ? "primary" : "ghost"}
            size={isCompact ? "md" : "lg"}
            disabled={!stripeReady}
          />
        )}
      </div>
    </motion.article>
  );
}
