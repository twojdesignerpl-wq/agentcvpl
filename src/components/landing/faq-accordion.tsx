"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { faqItems } from "@/lib/landing/content";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" tone="cream-deep" className="pt-24 lg:pt-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow index="09">FAQ</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
            Zanim{" "}
            <span className="editorial-underline">zapytasz.</span>
          </h2>
          <p className="mt-6 font-body text-[0.95rem] leading-relaxed text-[color:var(--ink)]/65">
            Nie ma na liście Twojego pytania?{" "}
            <a
              href="mailto:hej@agentcv.pl"
              className="editorial-underline font-semibold text-[color:var(--ink)]"
            >
              hej@agentcv.pl
            </a>
            — odpowiadamy w 24h.
          </p>
        </div>

        <ul className="lg:col-span-8 flex flex-col">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.03 }}
                className="border-b border-[color:var(--ink)]/15"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[color:var(--ink)]"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="mono-label shrink-0 text-[color:var(--ink)]/45">
                      0{i + 1}
                    </span>
                    <span className="font-display text-[1.15rem] font-semibold leading-snug tracking-tight text-[color:var(--ink)] sm:text-[1.35rem]">
                      {item.q}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--ink)]/15 text-[color:var(--ink)] transition-colors group-hover:border-[color:var(--saffron)] group-hover:bg-[color:var(--saffron)]"
                  >
                    {isOpen ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-7 pl-10 font-body text-[0.98rem] leading-relaxed text-[color:var(--ink)]/72">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
