"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { testimonials, type Testimonial } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const spanClass: Record<NonNullable<Testimonial["span"]>, string> = {
  sm: "md:col-span-3 lg:col-span-2",
  md: "md:col-span-6 lg:col-span-3",
  lg: "md:col-span-6 lg:col-span-4",
};

function TestimonialCard({
  t,
  variant = "default",
  delay = 0,
}: {
  t: Testimonial;
  variant?: "featured" | "default";
  delay?: number;
}) {
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex h-full flex-col gap-5 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-all duration-500 hover:shadow-[0_32px_72px_-36px_rgba(10,14,26,0.3)]",
        variant === "featured" && "lg:p-10",
        variant !== "featured" && t.span && spanClass[t.span],
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-6 left-0 w-[2px] origin-top scale-y-0 bg-[color:var(--saffron)] transition-transform duration-500 group-hover:scale-y-100"
      />
      <Quotes
        size={variant === "featured" ? 40 : 28}
        weight="fill"
        className="text-[color:var(--saffron)]/50"
        aria-hidden
      />
      <blockquote
        className={cn(
          "font-display font-semibold leading-snug tracking-tight text-[color:var(--ink)]",
          variant === "featured"
            ? "text-[clamp(1.4rem,2.3vw,1.85rem)]"
            : "text-[1.05rem]",
        )}
      >
        &bdquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-4">
        {t.photoUrl ? (
          <Image
            src={t.photoUrl}
            alt={t.name}
            width={44}
            height={44}
            sizes="44px"
            className="h-11 w-11 rounded-full object-cover"
            loading="lazy"
            unoptimized={false}
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--jade)] font-display font-bold text-[color:var(--cream)]">
            {initials}
          </div>
        )}
        <div>
          <p className="font-body font-semibold text-[color:var(--ink)]">{t.name}</p>
          <p className="mono-label text-[color:var(--ink)]/55">
            {t.role} · {t.company}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function TestimonialsMasonry() {
  const [featured, ...rest] = testimonials;

  return (
    <Section tone="cream-deep" className="pt-24 lg:pt-32">
      <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Eyebrow index="07">Opinie</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
            Dostali pracę.{" "}
            <span className="editorial-underline">Potem napisali.</span>
          </h2>
        </div>
        <p className="max-w-sm font-body text-[0.95rem] leading-relaxed text-[color:var(--ink)]/65">
          Magazyn, produkcja, warsztat, biuro, tech — Pracuś pisze dla każdego, kto szuka pracy.
        </p>
      </div>

      {/* Featured testimonial — full width */}
      <div className="mb-6">
        <TestimonialCard t={featured} variant="featured" delay={0} />
      </div>

      {/* Asymmetric 6-col grid with varied spans + dense flow — zero gaps, natural rhythm */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:[grid-auto-flow:dense]">
        {rest.map((t, i) => (
          <TestimonialCard
            key={t.name}
            t={t}
            delay={0.04 + (i % 3) * 0.07}
          />
        ))}
      </div>
    </Section>
  );
}
