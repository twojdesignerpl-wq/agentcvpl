"use client";

import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { MagneticButton } from "./_shared/magnetic-button";
import { finalCta } from "@/lib/landing/content";

export function CtaFinal() {
  return (
    <Section tone="ink" className="relative overflow-hidden py-32 lg:py-44">
      {/* Decorative saffron path */}
      <svg
        aria-hidden
        viewBox="0 0 1600 600"
        className="pointer-events-none absolute inset-0 h-full w-full text-[color:var(--saffron)]/18"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M-100 300 C 300 100, 600 500, 900 280 S 1500 120, 1800 350"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M-50 380 C 400 220, 700 440, 1000 320 S 1500 420, 1700 260"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 12"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 3.5, delay: 0.3 }}
        />
      </svg>

      {/* Watermark number */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]"
      >
        <span className="font-display text-[30rem] font-black leading-none tracking-tighter text-[color:var(--cream)]">
          10
        </span>
      </div>

      <div className="relative flex flex-col items-center text-center">
        <Eyebrow index="10" tone="cream">
          {finalCta.eyebrow}
        </Eyebrow>

        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-[clamp(3.5rem,12vw,10rem)] font-black leading-[0.9] tracking-[-0.045em] text-[color:var(--cream)]"
        >
          {finalCta.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 max-w-xl font-body text-[1.2rem] leading-relaxed text-[color:var(--cream)]/75 sm:text-[1.35rem]"
        >
          {finalCta.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <MagneticButton href={finalCta.primaryHref} variant="saffron" size="lg">
            {finalCta.primary}
            <ArrowRight size={20} weight="bold" />
          </MagneticButton>
        </motion.div>

        <p className="mt-8 mono-label text-[color:var(--cream)]/50">{finalCta.micro}</p>
      </div>
    </Section>
  );
}
