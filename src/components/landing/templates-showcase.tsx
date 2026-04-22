"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { TemplateItem } from "@/lib/landing/content";
import { Section } from "./_shared/section";
import { Eyebrow } from "./_shared/eyebrow";
import { MagneticButton } from "./_shared/magnetic-button";
import { templates } from "@/lib/landing/content";
import { easeOutCraft } from "@/lib/landing/easings";

type TemplateId = TemplateItem["id"];

/**
 * Stylised mini-mockups odzwierciedlające realne style szablonów z kreatora.
 * Pełne renderowanie + edycja w `/kreator`.
 */
function TemplateMockup({ id }: { id: TemplateId }) {
  if (id === "atlas") return <AtlasMock />;
  if (id === "cobalt") return <CobaltMock />;
  return <OrbitMock />;
}

const PHOTO_SRC = "/landing/cv-photo.jpg";

function MockPhoto({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src={PHOTO_SRC}
        alt=""
        fill
        sizes="120px"
        className="object-cover"
      />
    </div>
  );
}

// ─── Sample data — wspólne dla 3 mockupów ────────────────────────────────────

const SAMPLE = {
  name: "Anna Kowalska",
  role: "Product Designer",
  contact: {
    address: "Warszawa, Polska",
    email: "anna.k@example.pl",
    phone: "+48 501 234 567",
    website: "annakowalska.pl",
  },
  profile:
    "Senior Product Designer z 8 latami doświadczenia w fintech i SaaS. Prowadzę projekty od discovery po launch, buduję design systemy i mentoruję juniorów. Lubię produkty B2B z dużą liczbą użytkowników.",
  jobs: [
    {
      date: "2022 — obecnie",
      role: "Senior UX Designer",
      co: "BankoweFinTech S.A.",
      loc: "Warszawa",
      desc: "Prowadzę redesign aplikacji mobilnej dla 1,2 mln użytkowników. Wdrożyłam design system oparty na tokenach — skróciliśmy czas developmentu nowych ekranów o 40%. Koordynuję zespół 4 projektantów i 3 zespoły produktowe.",
    },
    {
      date: "2019 — 2022",
      role: "Product Designer",
      co: "SaaS Logistics",
      loc: "Kraków",
      desc: "Projektowałam dashboardy dla 30+ klientów B2B w branży logistyki. Zmniejszyłam liczbę zgłoszeń do supportu o 35% przez przebudowę flow zakładania przesyłki.",
    },
    {
      date: "2017 — 2019",
      role: "UX Designer",
      co: "Agencja Interaktywna",
      loc: "Kraków",
      desc: "Projektowałam serwisy e-commerce (12 wdrożeń, retail i FMCG). Prowadziłam testy użyteczności i warsztaty discovery z product ownerami.",
    },
  ],
  education: [
    { date: "2018 — 2020", school: "SWPS Uniwersytet", degree: "Magister, UX" },
    { date: "2014 — 2017", school: "ASP w Warszawie", degree: "Licencjat, Wzornictwo" },
  ],
  skillsPro: ["Figma", "Design Systems", "Prototypowanie", "User Research", "Storybook", "Discovery"],
  skillsSoft: ["Komunikacja", "Mentoring", "Praca w zespole"],
  languages: [
    { name: "Polski", level: "Ojczysty" },
    { name: "Angielski", level: "C1 — Biegły" },
  ],
  links: [
    { label: "Strona", url: "annakowalska.pl" },
    { label: "LinkedIn", url: "linkedin.com/in/akowalska" },
    { label: "Behance", url: "behance.net/akowalska" },
  ],
  projects: [
    {
      name: "Design System Orbit",
      url: "github.com/orbit-ds",
      desc: "Open-source design system dla fintech — 120 komponentów, OKLCH tokens, pełna dokumentacja w Storybook.",
    },
    {
      name: "Badanie kart wielowalutowych 2024",
      url: "",
      desc: "Raport z 32 wywiadów pogłębionych. Wnioski wdrożone w aplikacjach mBank i PKO BP.",
    },
  ],
  certifications: [
    { name: "Nielsen Norman Group · UX Master Certification", issuer: "NN/g", year: "2023" },
    { name: "Figma Advanced — Variables & Tokens", issuer: "Figma Academy", year: "2024" },
  ],
  hobbies: ["Wspinaczka skałkowa", "Fotografia analogowa", "Cyfrowy minimalizm"],
};

// ─── ATLAS — navy + blue accent ─────────────────────────────────────────────

function AtlasMock() {
  const ink = "#1a2332";
  const accent = "#2563eb";
  const muted = "#6b7280";
  const line = "#e5e7eb";

  return (
    <div className="h-full w-full bg-white p-8 text-[10px] leading-[1.45]" style={{ color: ink }}>
      <div className="flex items-start gap-5">
        <MockPhoto className="h-[78px] w-[78px] shrink-0 overflow-hidden rounded-full" />
        <div className="min-w-0 flex-1 pt-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {SAMPLE.role}
          </p>
          <p className="mt-1.5 font-bold leading-[1.04] tracking-[-0.02em]" style={{ fontSize: 26, color: ink }}>
            {SAMPLE.name}
          </p>
          <ul className="mt-2.5 flex flex-col gap-[5px]" style={{ color: ink, fontSize: 9.5 }}>
            {[SAMPLE.contact.address, SAMPLE.contact.email, SAMPLE.contact.phone].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="inline-flex h-[12px] w-[12px] shrink-0 items-center justify-center rounded-full border" style={{ borderColor: accent }}>
                  <span className="h-[3px] w-[3px] rounded-full" style={{ background: accent }} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[36%_1fr] gap-x-5">
        <div>
          <p className="text-[12px] font-bold tracking-[-0.005em]" style={{ color: ink }}>Profil</p>
          <div className="mt-1.5 h-px" style={{ background: line }} />
          <p className="mt-2 leading-[1.55]" style={{ color: muted }}>{SAMPLE.profile}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold tracking-[-0.005em]" style={{ color: ink }}>Umiejętności</p>
          <div className="mt-1.5 h-px" style={{ background: line }} />
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-[5px]" style={{ color: ink }}>
            {SAMPLE.skillsPro.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-[5px] w-[5px] shrink-0 rounded-full border" style={{ borderColor: accent, borderWidth: 1.2 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-bold tracking-[-0.005em]" style={{ color: ink }}>Doświadczenie zawodowe</p>
        <div className="mt-1.5 h-px" style={{ background: line }} />
        <div className="mt-2.5 flex flex-col gap-2.5">
          {SAMPLE.jobs.slice(0, 2).map((j) => (
            <div key={j.role} className="grid grid-cols-[20%_1fr_14%] gap-3">
              <p className="font-medium tabular-nums leading-[1.35]" style={{ color: accent }}>{j.date}</p>
              <div>
                <p className="font-semibold leading-[1.3]" style={{ color: ink, fontSize: 10.5 }}>
                  {j.role} <span className="font-normal" style={{ color: muted }}>w {j.co}</span>
                </p>
                <p className="mt-[3px] leading-[1.55]" style={{ color: muted }}>{j.desc}</p>
              </div>
              <p className="text-right leading-[1.35]" style={{ color: muted }}>{j.loc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-bold tracking-[-0.005em]" style={{ color: ink }}>Edukacja</p>
        <div className="mt-1.5 h-px" style={{ background: line }} />
        <div className="mt-2 flex flex-col gap-2">
          {SAMPLE.education.map((e) => (
            <div key={e.school} className="grid grid-cols-[20%_1fr] gap-3">
              <p className="font-medium tabular-nums" style={{ color: accent }}>{e.date}</p>
              <div>
                <p className="font-semibold" style={{ color: ink }}>{e.school}</p>
                <p style={{ color: muted }}>{e.degree}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-bold tracking-[-0.005em]" style={{ color: ink }}>Projekty</p>
        <div className="mt-1.5 h-px" style={{ background: line }} />
        <div className="mt-2 flex flex-col gap-2">
          {SAMPLE.projects.slice(0, 1).map((p) => (
            <div key={p.name}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold" style={{ color: ink }}>{p.name}</p>
                {p.url ? <p style={{ color: muted, fontSize: 9 }}>{p.url}</p> : null}
              </div>
              <p className="mt-[2px] leading-[1.55]" style={{ color: muted }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COBALT — navy + cream + decorative blobs ────────────────────────────────

function CobaltMock() {
  const bg = "#faf6ec";
  const ink = "#1f3a5f";
  const muted = "#5a6b7e";
  const blobNavy = "#1f3a5f";
  const blobPink = "#f4cfc4";
  const blobBlue = "#cdd9ed";

  return (
    <div className="relative h-full w-full overflow-hidden p-8 text-[10px] leading-[1.45]" style={{ background: bg, color: ink }}>
      {/* Top-right blob cluster */}
      <svg className="absolute -right-[8%] -top-[12%]" style={{ width: "38%", height: "38%" }} viewBox="0 0 200 200">
        <path d="M150 18 C 175 28, 192 50, 188 80 C 184 110, 158 124, 138 116 C 116 108, 108 84, 118 60 C 124 44, 138 22, 150 18 Z" fill={blobBlue} opacity="0.92" />
        <path d="M82 32 C 110 28, 138 46, 144 70 C 148 92, 130 108, 108 102 C 84 96, 70 78, 70 60 C 70 48, 76 36, 82 32 Z" fill={blobPink} opacity="0.88" />
        <path d="M178 92 C 194 100, 200 122, 188 138 C 174 154, 152 150, 144 132 C 138 116, 152 96, 168 92 C 172 91, 175 91, 178 92 Z" fill={blobNavy} opacity="0.95" />
      </svg>
      {/* Bottom-left + right blobs */}
      <svg className="absolute -bottom-[10%] -left-[12%]" style={{ width: "38%", height: "38%" }} viewBox="0 0 200 200">
        <path d="M30 110 C 22 86, 36 60, 64 56 C 92 52, 116 70, 118 96 C 120 124, 100 144, 72 142 C 50 140, 36 128, 30 110 Z" fill={blobPink} opacity="0.86" />
        <path d="M104 138 C 130 128, 158 138, 162 162 C 166 184, 144 200, 122 192 C 98 184, 88 162, 96 148 C 98 144, 100 140, 104 138 Z" fill={blobNavy} opacity="0.95" />
      </svg>
      <svg className="absolute -bottom-[14%] -right-[14%]" style={{ width: "44%", height: "44%" }} viewBox="0 0 200 200">
        <path d="M138 78 C 168 70, 196 90, 194 122 C 192 154, 162 174, 134 168 C 104 162, 92 132, 104 108 C 112 92, 124 82, 138 78 Z" fill={blobNavy} opacity="0.95" />
        <path d="M70 130 C 96 124, 122 142, 124 168 C 126 192, 102 208, 78 200 C 54 192, 46 168, 56 148 C 60 140, 64 134, 70 130 Z" fill={blobPink} opacity="0.88" />
      </svg>

      <div className="relative z-10 flex items-start gap-4">
        <MockPhoto className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-md" />
        <div className="pt-1 min-w-0 max-w-[58%]">
          <p className="font-extrabold leading-[1.0] tracking-[-0.02em]" style={{ fontSize: 28, color: ink }}>
            {SAMPLE.name}
          </p>
          <p className="mt-1.5 font-bold" style={{ fontSize: 13, color: ink }}>
            {SAMPLE.role}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 max-w-[58%] leading-[1.55]" style={{ color: muted }}>
        {SAMPLE.profile}
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-[58%_38%] gap-x-5">
        <div>
          <p className="font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Doświadczenie</p>
          <div className="mt-2 flex flex-col gap-2.5">
            {SAMPLE.jobs.slice(0, 2).map((j) => (
              <div key={j.co}>
                <p className="font-bold" style={{ color: ink, fontSize: 10.5 }}>{j.co}</p>
                <p className="font-semibold" style={{ color: ink }}>{j.role}</p>
                <p style={{ color: muted, fontSize: 9.5 }}>{j.date} · {j.loc}</p>
                <p className="mt-[3px] leading-[1.55]" style={{ color: ink }}>{j.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Edukacja</p>
          <div className="mt-2 flex flex-col gap-2">
            {SAMPLE.education.map((e) => (
              <div key={e.school}>
                <p className="font-bold" style={{ color: ink, fontSize: 10.5 }}>{e.school}</p>
                <p style={{ color: muted }}>{e.degree} · {e.date}</p>
              </div>
            ))}
          </div>

        </div>

        <aside className="flex flex-col gap-4">
          <div>
            <p className="font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Kontakt</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {[
                ["Adres", SAMPLE.contact.address],
                ["Email", SAMPLE.contact.email],
                ["Telefon", SAMPLE.contact.phone],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="font-bold" style={{ color: ink }}>{label}</p>
                  <p style={{ color: muted }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Umiejętności</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {SAMPLE.skillsPro.slice(0, 5).map((s) => (
                <div key={s}>
                  <p style={{ color: ink }}>{s}</p>
                  <div className="mt-[2px] h-[2px] rounded-sm" style={{ background: `linear-gradient(to right, ${ink} 0%, ${ink} 62%, ${blobBlue} 100%)` }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Języki</p>
            <div className="mt-2 flex flex-col gap-1">
              {SAMPLE.languages.map((l) => (
                <div key={l.name} className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold" style={{ color: ink }}>{l.name}</span>
                  <span style={{ color: muted, fontSize: 9 }}>{l.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-extrabold tracking-[-0.02em]" style={{ fontSize: 15, color: ink }}>Linki</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {SAMPLE.links.map((l) => (
                <div key={l.label}>
                  <p className="font-bold" style={{ color: ink }}>{l.label}</p>
                  <p style={{ color: muted }}>{l.url}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── ORBIT — minimalistyczny mono 2-col ──────────────────────────────────────

function OrbitMock() {
  const ink = "#1a1a1a";
  const muted = "#7a7a7a";
  const line = "#d9d9d9";

  return (
    <div className="h-full w-full bg-white p-8 text-[10px] leading-[1.45]" style={{ color: ink }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <MockPhoto className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full" />
          <div className="pt-1">
            <p className="font-bold leading-[1.0] tracking-[-0.01em]" style={{ fontSize: 26, color: ink }}>
              Anna<br />Kowalska
            </p>
            <p className="mt-1.5" style={{ fontSize: 11, color: muted }}>{SAMPLE.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-[3px] pt-1 text-right" style={{ color: ink, fontSize: 9.5 }}>
          <p>{SAMPLE.contact.address}</p>
          <p>{SAMPLE.contact.email}</p>
          <p>{SAMPLE.contact.phone}</p>
        </div>
      </div>

      <div className="my-4 h-px" style={{ background: line }} />

      <div className="grid grid-cols-[38%_4%_58%]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Profil</p>
            <p className="mt-1.5 leading-[1.55]" style={{ color: muted }}>{SAMPLE.profile}</p>
          </div>
          <div>
            <p className="font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Edukacja</p>
            <div className="mt-1.5 flex flex-col gap-2">
              {SAMPLE.education.map((e) => (
                <div key={e.school} className="grid grid-cols-[34%_1fr] gap-2">
                  <p style={{ color: muted }}>{e.date}</p>
                  <div>
                    <p className="font-semibold" style={{ color: ink }}>{e.school}</p>
                    <p style={{ color: muted }}>{e.degree}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Umiejętności</p>
            <p className="mt-1 font-semibold uppercase tracking-[0.1em]" style={{ fontSize: 8.5, color: muted }}>Zawodowe</p>
            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-[3px]" style={{ color: ink }}>
              {SAMPLE.skillsPro.map((s) => (
                <p key={s}>· {s}</p>
              ))}
            </div>
            <p className="mt-2 font-semibold uppercase tracking-[0.1em]" style={{ fontSize: 8.5, color: muted }}>Osobiste</p>
            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-[3px]" style={{ color: ink }}>
              {SAMPLE.skillsSoft.map((s) => (
                <p key={s}>· {s}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Języki</p>
            <div className="mt-1.5 flex flex-col gap-1">
              {SAMPLE.languages.map((l) => (
                <div key={l.name} className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold" style={{ color: ink }}>{l.name}</span>
                  <span style={{ color: muted, fontSize: 9 }}>{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden />
        <div className="flex flex-col gap-3">
          <p className="font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Doświadczenie</p>
          {SAMPLE.jobs.slice(0, 2).map((j) => (
            <div key={j.role} className="grid grid-cols-[20%_1fr] gap-2.5">
              <p className="tabular-nums leading-[1.35]" style={{ color: muted }}>{j.date}</p>
              <div>
                <p className="font-semibold" style={{ color: ink, fontSize: 10.5 }}>{j.role}</p>
                <p style={{ color: muted }}>{j.co} · {j.loc}</p>
                <p className="mt-[2px] leading-[1.55]" style={{ color: ink }}>{j.desc}</p>
              </div>
            </div>
          ))}

          <p className="mt-2 font-bold tracking-[-0.005em]" style={{ fontSize: 12.5, color: ink }}>Projekty</p>
          {SAMPLE.projects.slice(0, 1).map((p) => (
            <div key={p.name}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold" style={{ color: ink }}>{p.name}</p>
                {p.url ? <p style={{ color: muted, fontSize: 9 }}>{p.url}</p> : null}
              </div>
              <p className="mt-[2px] leading-[1.55]" style={{ color: muted }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function TemplatePreview({ id, active }: { id: TemplateId; active: boolean }) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        rotate: active ? 0 : -2,
        scale: active ? 1 : 0.95,
        opacity: active ? 1 : 0.55,
      }}
      transition={{ duration: 0.75, ease: easeOutCraft }}
      className="relative mx-auto w-full max-w-full sm:max-w-[540px]"
    >
      <div
        className="relative w-full overflow-hidden rounded-[2px] bg-white ring-ink shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]"
        style={{ aspectRatio: "794 / 1123" }}
      >
        <TemplateMockup id={id} />
      </div>
    </motion.div>
  );
}

export function TemplatesShowcase() {
  const [active, setActive] = useState(0);

  return (
    <Section id="szablony" tone="cream" className="pt-24 lg:pt-32">
      <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Eyebrow index="05">Szablony</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--ink)]">
            Pięć szablonów. <span className="editorial-underline">Trzy najczęściej wybierane.</span>
          </h2>
          <p className="mt-5 max-w-xl font-body text-[1rem] leading-relaxed text-[color:var(--ink)]/70">
            Atlas (klasyczny biznes), Cobalt (designerski z charakterem) i Orbit (czysty minimal pod ATS).
            W kreatorze dostępne też Terra (editorial serif) i Lumen (centrowany hero) — łącznie 5 archetypów na każdą rekrutację.
          </p>
        </div>
        <div className="hidden lg:block">
          <MagneticButton href="/kreator" variant="ghost-ink" size="md">
            Wypróbuj w kreatorze
            <ArrowRight size={16} weight="bold" />
          </MagneticButton>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7">
          <div className="relative mx-auto max-w-full px-2 sm:max-w-[540px] sm:px-0">
            <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="agent-dot" />
                <span className="mono-label text-[color:var(--cream)]">
                  {templates[active].tag}
                </span>
              </div>
              <span className="mono-label text-[color:var(--ink)]/50">
                PODGLĄD · A4
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={templates[active].id}
                initial={{ opacity: 0, scale: 0.94, rotate: -1.2, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.04, rotate: 1.2, filter: "blur(6px)" }}
                transition={{ duration: 0.75, ease: easeOutCraft }}
              >
                <TemplatePreview id={templates[active].id} active />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-5">
          {templates.map((t, i) => {
            const isActive = i === active;
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                whileHover={{ y: -2 }}
                animate={{ scale: isActive ? 1.02 : 0.98 }}
                transition={{ duration: 0.5, ease: easeOutCraft }}
                className="group relative flex flex-1 flex-col gap-3 overflow-hidden rounded-2xl border border-[color:var(--ink)]/10 bg-transparent p-7 text-left transition-colors duration-500 hover:border-[color:var(--ink)]/25"
              >
                {isActive && (
                  <motion.div
                    layoutId="template-active-marker"
                    className="absolute inset-0 -z-10 rounded-2xl border-2 border-[color:var(--saffron)] bg-[color:var(--cream-soft)] shadow-[0_24px_48px_-32px_rgba(232,182,76,0.4)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="template-active-bar"
                    className="absolute inset-y-0 left-0 w-1 bg-[color:var(--saffron)]"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}

                <div className="relative flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[1.65rem] font-bold leading-none tracking-tight text-[color:var(--ink)]">
                    {t.name}
                  </h3>
                  <span className="mono-label text-[color:var(--ink)]/45">
                    {t.tag}
                  </span>
                </div>
                <p className="relative font-body text-[0.95rem] leading-relaxed text-[color:var(--ink)]/75">
                  {t.description}
                </p>
                <p className="relative mono-label mt-auto flex flex-wrap items-center gap-1 text-[color:var(--ink)]/55">
                  <span className="text-[color:var(--saffron)]">▸</span>
                  {t.audience}
                </p>
              </motion.button>
            );
          })}

          <p className="mt-1 text-[0.85rem] text-[color:var(--ink)]/55">
            <span className="text-[color:var(--saffron)]">+ </span>
            <strong className="font-semibold text-[color:var(--ink)]/75">Terra</strong> (editorial serif z terakotowym akcentem) i{" "}
            <strong className="font-semibold text-[color:var(--ink)]/75">Lumen</strong> (centrowany hero, mono editorial)
            — wszystkie 5 dostępne w kreatorze.
          </p>

          <div className="lg:hidden pt-4">
            <MagneticButton
              href="/kreator"
              variant="ink"
              size="md"
              className="w-full"
            >
              Otwórz wszystkie w kreatorze
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
