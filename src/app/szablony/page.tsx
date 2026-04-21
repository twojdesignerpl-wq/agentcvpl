import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { ClosingCTA } from "@/components/poradniki/closing-cta";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { StatsBar } from "@/components/landing/_shared/stats-bar";
import { TrustBadges } from "@/components/landing/_shared/trust-badges";
import { templates } from "@/lib/landing/content";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Szablony CV — Orbit, Atlas, Terra, Cobalt, Lumen | agentcv",
  description:
    "Pięć darmowych szablonów CV testowanych w parserach ATS. Orbit (klasyczny), Atlas (navy), Terra (editorial), Cobalt (sidebar), Lumen (monochrom). Pobierz PDF/DOCX po polsku.",
  keywords: [
    "szablon CV",
    "szablony CV",
    "darmowe szablony CV",
    "szablon CV online",
    "CV do pobrania",
    "wzór CV",
    "szablon CV 2026",
  ],
  alternates: { canonical: "/szablony" },
  openGraph: {
    type: "website",
    title: "Szablony CV — 5 wzorów pod ATS | agentcv",
    description: "Pięć darmowych szablonów CV po polsku, testowanych w parserach ATS.",
    url: "/szablony",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", title: "Szablony CV — agentcv" },
  robots: { index: true, follow: true },
};

const STATS = [
  { label: "szablony", value: "5" },
  { label: "parsery ATS", value: "4" },
  { label: "branże PL", value: "26" },
  { label: "cena", value: "0 zł" },
] as const;

export default function SzablonyHubPage() {
  const schema = [
    collectionPageSchema({
      name: "Szablony CV — agentcv",
      description: "Pięć szablonów CV testowanych w parserach ATS, dostępnych w kreatorze agentcv.",
      slug: "/szablony",
      items: templates.map((t) => ({
        name: `Szablon CV ${t.name}`,
        url: `/szablony/${t.id}`,
        description: t.description,
      })),
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Szablony CV", url: "/szablony" },
    ]),
  ];

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-24 sm:px-8 lg:px-12">
          <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Szablony CV" }]} />

          <header className="mt-8 mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
            <div className="flex items-center gap-4">
              <PracusBrandImage
                variant="icon"
                size={72}
                priority
                className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]"
              />
              <p className="mono-label text-[color:var(--saffron)]">Szablony CV · 5 wzorów</p>
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              Pięć szablonów CV, każdy testowany w parserach ATS
            </h1>
            <p className="max-w-2xl font-body text-[1.15rem] leading-relaxed text-[color:var(--ink-soft)]">
              Orbit dla każdej branży, Atlas dla managerów, Terra dla kreatywnych, Cobalt dla produktowych, Lumen dla seniorów editorial. Wybierasz jeden klikiem — treść Twojego CV zostaje, zmienia się tylko forma.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton href="/kreator?utm_source=szablony-hub&utm_medium=hero&utm_campaign=hub" variant="ink" size="md">
                Otwórz kreator
                <ArrowRight size={16} weight="bold" />
              </MagneticButton>
              <MagneticButton href="/poradniki/jak-napisac-cv" variant="ghost-ink" size="md">
                Poradnik: jak napisać CV
              </MagneticButton>
            </div>
          </header>

          <section className="mb-16">
            <StatsBar items={[...STATS]} />
          </section>

          <section className="mb-16">
            <TrustBadges
              label="Testowane w parserach ATS"
              items={["Workday", "Greenhouse", "Lever", "eRecruiter"]}
            />
          </section>

          <section className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Link
                key={t.id}
                href={`/szablony/${t.id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-all hover:border-[color:var(--ink)]/30 hover:shadow-[0_32px_64px_-32px_rgba(10,14,26,0.25)]"
              >
                <p className="mono-label text-[color:var(--ink-muted)]">{t.tag}</p>
                <h2 className="font-display text-[1.8rem] font-bold leading-tight tracking-tight text-[color:var(--ink)]">
                  {t.name}
                </h2>
                <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                  {t.description}
                </p>
                <p className="mono-label mt-auto text-[0.7rem] text-[color:var(--ink-muted)]">
                  {t.audience}
                </p>
                <span className="inline-flex items-center gap-1.5 font-body text-[0.9rem] font-semibold text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--saffron)]">
                  Zobacz szablon
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </section>

          <ClosingCTA
            headline="Wybierz szablon i napisz CV"
            subhead="Pierwsze CV za darmo, bez karty. Asystent Pracuś AI prowadzi przez każdą sekcję, ATS score pokazuje brakujące słowa kluczowe."
            utmCampaign="szablony-hub"
            primaryLabel="Otwórz kreator"
          />
        </div>

        <Script id="szablony-hub-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(schema)}
        </Script>
      </main>
      <MobileStickyCta
        href="/kreator?utm_source=szablony&utm_medium=sticky&utm_campaign=hub"
        label="Wybierz szablon i startuj"
        subLabel="5 szablonów · ATS · 0 zł"
        storageKey="mobile-cta-szablony"
      />
    </MarketingShell>
  );
}
