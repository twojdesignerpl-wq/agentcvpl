"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Target,
  Brain,
  MagicWand,
  HandPointing,
  DownloadSimple,
  Cards,
  ShieldCheck,
  ClockCounterClockwise,
  Lock,
  FilePdf,
  FileDoc,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { bentoFeatures, type BentoFeature, type IconName } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const ICONS: Record<IconName, React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "duotone" | "fill" }>> = {
  Target,
  Brain,
  MagicWand,
  HandPointing,
  DownloadSimple,
  Cards,
  ShieldCheck,
  ClockCounterClockwise,
  Sparkle: Target,
  FileText: Cards,
  Graph: Target,
  Confetti: Target,
};

const sizeClass: Record<BentoFeature["size"], string> = {
  lg: "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
  tall: "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2",
  wide: "sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1",
  sq: "sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1",
};

function FeatureVisual({ kind }: { kind?: BentoFeature["visual"] }) {
  if (kind === "diff") {
    const portals = ["Pracuj.pl", "NoFluffJobs", "JustJoin", "LinkedIn", "OLX"];
    const benefits = [
      "Wyciąga twarde wymagania i kompetencje miękkie",
      "Porównuje gęstość słów kluczowych branży",
      "Proponuje konkretne zdania do zmiany",
    ];
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] p-5 font-mono text-[0.88rem] leading-relaxed">
          <div className="flex gap-2 text-[color:var(--ink)]/40">
            <span>-</span>
            <span className="line-through">odpowiadałem za marketing</span>
          </div>
          <div className="mt-1 flex gap-2 text-[color:var(--jade)]">
            <span>+</span>
            <span className="editorial-underline font-semibold">
              podniosłem MRR o 34% w 6 miesięcy
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {portals.map((p, i) => (
            <motion.span
              key={p}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.4 }}
              className="mono-label rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-3 py-1.5 text-[0.72rem] text-[color:var(--ink)]/80"
            >
              {p}
            </motion.span>
          ))}
        </div>
        <div className="rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream)] p-4">
          <p className="mono-label mb-3 text-[0.7rem] text-[color:var(--ink)]/50">
            CO PRACUŚ ROBI Z OGŁOSZENIEM
          </p>
          <ul className="space-y-2.5">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i + 0.2, duration: 0.4 }}
                className="flex items-start gap-2.5 font-body text-[0.95rem] leading-snug text-[color:var(--ink)]/82"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
                >
                  <Check size={12} weight="bold" />
                </span>
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (kind === "score") {
    const dims = [
      { label: "Kompletność", val: 95 },
      { label: "Słowa kluczowe", val: 82 },
      { label: "Czytelność", val: 90 },
      { label: "Długość A4", val: 81 },
    ];
    const keywords = ["UDT", "ADR", "SEP", "MIG/MAG", "HACCP", "PRK"];
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-2.5">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[clamp(3.25rem,6.5vw,5rem)] font-black leading-[0.9] tracking-tight tabular-nums text-[color:var(--saffron)]"
          >
            87
          </motion.span>
          <span className="mono-label pb-2 text-[0.85rem] text-[color:var(--ink)]/50">/ 100</span>
        </div>
        <div className="space-y-3">
          {dims.map((d, i) => (
            <div key={d.label}>
              <div className="flex justify-between text-[0.8rem]">
                <span className="mono-label text-[color:var(--ink)]/65">{d.label}</span>
                <span className="font-mono font-semibold text-[color:var(--ink)]">{d.val}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--ink)]/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-[color:var(--saffron)]"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((k) => (
            <span
              key={k}
              className="mono-label rounded-full border border-[color:var(--jade)]/30 bg-[color:var(--jade)]/8 px-2.5 py-1 text-[0.72rem] text-[color:var(--ink)]"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "export") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2.5 rounded-xl border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 p-4">
          <FilePdf size={28} weight="duotone" className="text-[color:var(--ink)]" />
          <div>
            <p className="mono-label text-[0.72rem] text-[color:var(--ink)]/50">.PDF</p>
            <p className="font-display text-[1.1rem] font-bold leading-tight text-[color:var(--ink)]">
              Rozmowa
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-xl border border-[color:var(--jade)]/40 bg-[color:var(--jade)]/8 p-4">
          <FileDoc size={28} weight="duotone" className="text-[color:var(--ink)]" />
          <div>
            <p className="mono-label text-[0.72rem] text-[color:var(--ink)]/50">.DOCX</p>
            <p className="font-display text-[1.1rem] font-bold leading-tight text-[color:var(--ink)]">
              Portal
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (kind === "sources") {
    const sources = [
      { name: "ESCO", hint: "Unia Europejska · klasyfikacja kompetencji" },
      { name: "PRK / ZSK", hint: "Polska Rama Kwalifikacji, 8 poziomów" },
      { name: "Barometr Zawodów 2026", hint: "prognoza MRPiPS" },
      { name: "BKL PARP", hint: "Bilans Kapitału Ludzkiego" },
      { name: "O*NET", hint: "US Dept. of Labor · dane branżowe" },
      { name: "KZiS", hint: "Klasyfikacja Zawodów i Specjalności" },
    ];
    return (
      <div className="rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream)] p-4 sm:p-5">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <p className="mono-label text-[0.72rem] text-[color:var(--ink)]/50">
            ŹRÓDŁA BAZY WIEDZY
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--jade)]/12 px-2.5 py-1 text-[0.7rem] font-semibold text-[color:var(--ink)]">
            <span className="size-1.5 rounded-full bg-[color:var(--jade)]" aria-hidden />
            weryfikowane
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sources.map((s) => (
            <div
              key={s.name}
              className="flex flex-col gap-0.5 rounded-lg border border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] px-3.5 py-2.5"
            >
              <span className="font-display text-[0.92rem] font-bold leading-tight text-[color:var(--ink)]">
                {s.name}
              </span>
              <span className="text-[0.74rem] leading-snug text-[color:var(--ink)]/60">
                {s.hint}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "inline") {
    return (
      <div className="rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream)] p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="mono-label text-[0.7rem] text-[color:var(--ink)]/50">
            PROFIL / OPIS STANOWISKA
          </span>
          <motion.span
            whileHover={{ y: -1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--saffron)]/50 bg-[color:var(--saffron)]/15 px-3 py-1.5 text-[0.78rem] font-semibold text-[color:var(--ink)]"
            aria-hidden
          >
            <span className="agent-dot" />
            Pracuś · opis
          </motion.span>
        </div>
        <div className="mb-3 h-11 rounded-lg border border-dashed border-[color:var(--ink)]/20 bg-[color:var(--cream-soft)]/60" />
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Napisz", active: true },
            { label: "Ulepsz", active: false },
            { label: "Skróć", active: false },
          ].map((a) => (
            <span
              key={a.label}
              className={cn(
                "mono-label rounded-md border px-3 py-1.5 text-[0.78rem]",
                a.active
                  ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/15 text-[color:var(--ink)]"
                  : "border-[color:var(--ink)]/15 bg-[color:var(--cream-soft)] text-[color:var(--ink)]/60",
              )}
            >
              {a.label}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "templates") {
    const parsers = ["Workday", "Greenhouse", "Lever", "eRecruiter"];
    const perks = [
      "Semantyczne nagłówki, zero grafiki mylącej parsery",
      "Bez kolumn, które rozjeżdżają opisy w OCR",
      "Eksport PDF i DOCX zgodny z ATS",
    ];
    return (
      <div className="space-y-4">
        <div className="flex gap-2.5">
          {["Orbit", "Terra", "Atlas"].map((t, i) => (
            <div
              key={t}
              className={cn(
                "flex h-24 flex-1 flex-col justify-between rounded-md border border-[color:var(--ink)]/15 bg-[color:var(--cream-soft)] p-2.5",
                i === 1 && "rotate-[-1.5deg] border-[color:var(--saffron)] shadow-md",
              )}
            >
              <div className="h-1.5 w-9 bg-[color:var(--ink)]" />
              <div className="space-y-1.5">
                <div className="h-0.5 w-full bg-[color:var(--ink)]/30" />
                <div className="h-0.5 w-3/4 bg-[color:var(--ink)]/30" />
                <div className="h-0.5 w-5/6 bg-[color:var(--ink)]/30" />
              </div>
              <span className="mono-label text-[0.68rem] text-[color:var(--ink)]/55">{t}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream)] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="mono-label text-[0.7rem] text-[color:var(--ink)]/50">
              TESTOWANE W PARSERACH ATS
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--jade)]/12 px-2.5 py-1 text-[0.68rem] font-semibold text-[color:var(--ink)]">
              <span className="size-1.5 rounded-full bg-[color:var(--jade)]" aria-hidden />
              4 parsery
            </span>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {parsers.map((p) => (
              <span
                key={p}
                className="mono-label rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream-soft)] px-3 py-1.5 text-[0.72rem] text-[color:var(--ink)]/80"
              >
                {p}
              </span>
            ))}
          </div>
          <ul className="space-y-2">
            {perks.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i + 0.15, duration: 0.4 }}
                className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-[color:var(--ink)]/80"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
                >
                  <Check size={12} weight="bold" />
                </span>
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (kind === "swap") {
    return (
      <div className="space-y-2 font-body text-[0.92rem]">
        <div className="rounded-lg border border-dashed border-[color:var(--ink)]/20 px-3 py-2 text-[color:var(--ink)]/50 line-through">
          Byłem odpowiedzialny za marketing
        </div>
        <div className="rounded-lg border border-[color:var(--saffron)] bg-[color:var(--saffron)]/10 px-3 py-2">
          <span className="editorial-underline font-semibold text-[color:var(--ink)]">
            Podniosłem MRR o 34% w 6 miesięcy
          </span>
        </div>
      </div>
    );
  }
  if (kind === "shield") {
    const guarantees = [
      "Zero haseł u nas — logujesz się tylko przez OAuth",
      "Konto i CV usuwasz sam, bez maili do supportu",
      "Klauzula RODO wstawiana automatycznie na końcu CV",
    ];
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-3.5 py-2">
            <SiGoogle size={15} className="text-[#4285F4]" />
            <span className="mono-label text-[0.78rem] text-[color:var(--ink)]/80">Google</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-3.5 py-2">
            <SiFacebook size={15} className="text-[#1877F2]" />
            <span className="mono-label text-[0.78rem] text-[color:var(--ink)]/80">Facebook</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--jade)]/40 bg-[color:var(--jade)]/8 px-3.5 py-2">
            <Lock size={14} weight="fill" className="text-[color:var(--jade)]" />
            <span className="mono-label text-[0.78rem] text-[color:var(--ink)]">OAuth 2.0</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3.5 py-2">
            <span className="mono-label text-[0.78rem] text-[color:var(--ink)]">RODO</span>
            <span className="text-[0.78rem] font-semibold text-[color:var(--ink)]/60">
              klauzula auto
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream)] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="mono-label text-[0.7rem] text-[color:var(--ink)]/50">
              GWARANCJE PRYWATNOŚCI
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--jade)]/12 px-2.5 py-1 text-[0.68rem] font-semibold text-[color:var(--ink)]">
              <span className="size-1.5 rounded-full bg-[color:var(--jade)]" aria-hidden />
              RODO-compliant
            </span>
          </div>
          <ul className="space-y-2">
            {guarantees.map((g, i) => (
              <motion.li
                key={g}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i + 0.15, duration: 0.4 }}
                className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-[color:var(--ink)]/80"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
                >
                  <Check size={12} weight="bold" />
                </span>
                <span>{g}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (kind === "history") {
    const versions = [
      { label: "v3 · Operator CNC", active: true },
      { label: "v2 · Logistyk", active: false },
      { label: "v1 · Magazynier", active: false },
    ];
    return (
      <div className="flex flex-col gap-2">
        {versions.map((v) => (
          <div
            key={v.label}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-2.5 font-mono text-[0.82rem]",
              v.active
                ? "border-[color:var(--saffron)]/50 bg-[color:var(--saffron)]/10 text-[color:var(--ink)]"
                : "border-[color:var(--ink)]/12 bg-[color:var(--cream)] text-[color:var(--ink)]/60",
            )}
          >
            <span className="font-semibold">{v.label}</span>
            {v.active ? (
              <span className="mono-label rounded-full bg-[color:var(--ink)] px-2.5 py-1 text-[0.68rem] text-[color:var(--cream)]">
                aktywna
              </span>
            ) : (
              <span className="mono-label text-[0.68rem] text-[color:var(--ink)]/45">przywróć</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AgentBento() {
  return (
    <Section id="agent" tone="cream" className="pt-24 lg:pt-32">
      <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 items-end gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden shrink-0 sm:block"
          >
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-[color:color-mix(in_oklab,var(--saffron)_18%,transparent)] blur-2xl" />
            <Image
              src="/brand/pracus-ai.png"
              alt="Pracuś AI"
              width={160}
              height={160}
              priority={false}
              className="h-[clamp(96px,12vw,160px)] w-auto select-none"
            />
          </motion.div>
          <div className="max-w-3xl">
            <Eyebrow index="03">Co robi Twój Agent</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
              Pracuś nie jest zwykłym{" "}
              <span className="editorial-underline">kreatorem</span>.
            </h2>
          </div>
        </div>
        <p className="max-w-md font-body text-[1rem] leading-relaxed text-[color:var(--ink)]/70">
          Kreatory składają CV z pól. Agent analizuje ogłoszenie, proponuje konkretne zmiany w kartach Zastosuj/Odrzuć, liczy score ATS na żywo i pisze językiem branży — od magazynu po engineering.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-flow-dense">
        {bentoFeatures.map((f, i) => {
          const Icon = ICONS[f.icon] ?? Target;
          const isHero = f.size === "lg";
          return (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-shadow duration-500 hover:shadow-[0_32px_64px_-32px_rgba(10,14,26,0.28)] sm:p-8",
                sizeClass[f.size],
              )}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[color:var(--saffron)] transition-transform duration-500 group-hover:scale-x-100"
              />

              <div className="flex items-start justify-between gap-3">
                {isHero ? (
                  <motion.div
                    initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                  >
                    <PracusMark size={56} online />
                  </motion.div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream)] text-[color:var(--ink)] transition-colors duration-500 group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--cream)]">
                    <Icon size={22} weight="duotone" />
                  </div>
                )}
                <span className="mono-label text-[0.7rem] text-[color:var(--ink)]/45">
                  {f.eyebrow}
                </span>
              </div>

              <div className="mt-6 flex flex-1 flex-col gap-5">
                <div>
                  <h3
                    className={cn(
                      "font-display font-bold leading-[1.1] tracking-tight text-[color:var(--ink)]",
                      isHero
                        ? "text-[1.65rem] sm:text-[1.95rem] md:text-[2.15rem]"
                        : "text-[1.35rem] sm:text-[1.55rem]",
                    )}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 font-body leading-relaxed text-[color:var(--ink)]/72",
                      isHero ? "text-[1.05rem]" : "text-[0.98rem]",
                    )}
                  >
                    {f.body}
                  </p>
                </div>
                <FeatureVisual kind={f.visual} />
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
