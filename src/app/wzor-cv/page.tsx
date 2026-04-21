import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Cards,
  CheckCircle,
  ShieldCheck,
  Lightning,
  MagnifyingGlass,
  FileArrowDown,
} from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { ClosingCTA } from "@/components/poradniki/closing-cta";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { StatsBar } from "@/components/landing/_shared/stats-bar";
import { FeatureGrid } from "@/components/landing/_shared/feature-grid";
import { TrustBadges } from "@/components/landing/_shared/trust-badges";
import { templates } from "@/lib/landing/content";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Wzory CV — 5 szablonów testowanych w ATS | agentcv",
  description:
    "Darmowe wzory CV pod polski rynek pracy — 5 szablonów testowanych w parserach ATS (Workday, Greenhouse, Lever, eRecruiter). Pobierz PDF albo DOCX po polsku.",
  keywords: [
    "wzór CV",
    "wzory CV",
    "szablon CV",
    "szablony CV",
    "wzór CV do wypełnienia",
    "CV online za darmo",
    "wzór CV 2026",
    "CV PDF wzór",
  ],
  alternates: { canonical: "/wzor-cv" },
  openGraph: {
    type: "website",
    title: "Wzory CV — 5 szablonów ATS-friendly | agentcv",
    description:
      "Pięć darmowych wzorów CV pod polski rynek pracy. Wszystkie testowane w parserach ATS. Kreator prowadzi Cię krok po kroku.",
    url: "/wzor-cv",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", title: "Wzory CV — agentcv" },
  robots: { index: true, follow: true },
};

const STATS = [
  { label: "szablony ATS", value: "5" },
  { label: "polskie branże", value: "26" },
  { label: "czas tworzenia", value: "~5 min" },
  { label: "cena pierwszego CV", value: "0 zł" },
] as const;

const PERKS = [
  {
    icon: ShieldCheck,
    title: "Testowane w parserach ATS",
    body: "Każdy z 5 szablonów (Orbit, Atlas, Terra, Cobalt, Lumen) przeszedł testy w Workday, Greenhouse, Lever i polskim eRecruiter. Żadnych kolumn, które mylą algorytmy.",
    accent: "jade" as const,
  },
  {
    icon: Lightning,
    title: "Uzupełniasz raz, zmieniasz bez utraty treści",
    body: "Wybierasz szablon, wypełniasz sekcje, przełączasz formę jednym kliknięciem. Treść zostaje, zmienia się tylko akcent wizualny.",
  },
  {
    icon: MagnifyingGlass,
    title: "Asystent AI znajdzie luki",
    body: "Pracuś AI czyta Twoje CV i ogłoszenie — mówi punkt po punkcie, czego brakuje i jak przeformułować zdania pod konkretną ofertę.",
  },
  {
    icon: Cards,
    title: "Wariant pod każdą branżę",
    body: "Szablon Orbit dla każdej branży, Atlas dla managerów, Terra dla kreatywnych, Cobalt dla handlu i marketingu, Lumen dla editorial.",
  },
  {
    icon: FileArrowDown,
    title: "Eksport PDF + DOCX",
    body: "PDF gotowy do mejla rekrutera, DOCX pod portale, które żądają Worda. Oba formaty ATS-friendly, bez znaków wodnych.",
  },
  {
    icon: CheckCircle,
    title: "Klauzula RODO automatyczna",
    body: "Wybierasz wersję klauzuli (standardowa, przyszłościowa albo obie) — trafia na koniec CV bez przepisywania.",
  },
];

const AUDIENCE_MATCH: Record<string, { who: string; why: string }> = {
  orbit: {
    who: "Każda branża · bezpieczny wybór",
    why: "Minimalistyczny 2-kolumnowy układ — uniwersalny, przechodzi każdy parser, wygląda poważnie w każdej branży.",
  },
  atlas: {
    who: "Manager · Sales · Finance · HR · Konsulting",
    why: "Navy + niebieski akcent z ikonami kontaktu. Profesjonalnie i klasycznie, ale z lekkim charakterem.",
  },
  terra: {
    who: "Design · Creative · Marketing · Copywriter",
    why: "Editorial z terakotą i serif-italicem. Dla branż, gdzie estetyka jest częścią portfolio.",
  },
  cobalt: {
    who: "Product · Marketing · E-commerce · UX",
    why: "Navy na cream z sidebarem. Wyróżnia się bez ryzyka — pasuje do firm produktowych i nowoczesnych.",
  },
  lumen: {
    who: "Editorial · Senior · Senior Manager",
    why: "Etykiety sekcji obok treści, monochromatyczny. Minimalistycznie dojrzały — dla seniorów z dużą ilością treści.",
  },
};

export default function WzorCvPage() {
  const schema = [
    collectionPageSchema({
      name: "Wzory CV — agentcv",
      description: "Pięć darmowych wzorów CV po polsku, testowanych w parserach ATS.",
      slug: "/wzor-cv",
      items: templates.map((t) => ({
        name: `Wzór CV — ${t.name}`,
        url: `/wzor-cv#${t.id}`,
        description: t.description,
      })),
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Wzory CV", url: "/wzor-cv" },
    ]),
  ];

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-24 sm:px-8 lg:px-12">
          <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Wzory CV" }]} />

          <header className="mt-8 mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
            <div className="flex items-center gap-4">
              <PracusBrandImage variant="icon" size={72} className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]" priority />
              <p className="mono-label text-[color:var(--saffron)]">Wzory CV · 2026</p>
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              Pięć wzorów CV, każdy testowany w parserach ATS
            </h1>
            <p className="max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
              Nie wybierasz spośród 60 kolorystycznych wariantów. Wybierasz jeden z pięciu układów, które
              przechodzą przez Workday, Greenhouse, Lever i eRecruiter — i pasują do wszystkich 26
              polskich branż. Pobierasz PDF albo DOCX, bez znaków wodnych, za darmo przy pierwszym CV.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton
                href="/kreator?utm_source=wzor-cv&utm_medium=hero&utm_campaign=wzor-cv"
                variant="ink"
                size="md"
              >
                Wybierz wzór i napisz CV
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

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Pięć szablonów</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Wybierz układ. Treść jest Twoja — forma zmienia się jednym kliknięciem.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => {
                const match = AUDIENCE_MATCH[t.id] ?? {
                  who: t.audience,
                  why: t.description,
                };
                return (
                  <article
                    key={t.id}
                    id={t.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-all hover:border-[color:var(--ink)]/25 hover:shadow-[0_24px_48px_-28px_rgba(10,14,26,0.22)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="mono-label text-[color:var(--ink-muted)]">{t.tag}</p>
                      <span
                        aria-hidden
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--ink)]/12 bg-[color:var(--cream)] text-[color:var(--ink)]"
                      >
                        <Cards size={16} weight="duotone" />
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-tight text-[color:var(--ink)]">
                        {t.name}
                      </h3>
                      <p className="mt-1 font-body text-[0.9rem] text-[color:var(--ink-muted)]">
                        {t.subtitle}
                      </p>
                    </div>
                    <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                      {match.why}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <p className="mono-label text-[0.7rem] text-[color:var(--ink-muted)]">
                        {match.who}
                      </p>
                      <Link
                        href={`/kreator?utm_source=wzor-cv&utm_medium=template-card&utm_campaign=${t.id}`}
                        className="inline-flex items-center gap-1.5 font-body text-[0.9rem] font-semibold text-[color:var(--ink)] transition-colors hover:text-[color:var(--saffron)]"
                      >
                        Użyj
                        <ArrowRight
                          size={14}
                          weight="bold"
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Co daje darmowy wzór z agentcv</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Nie tylko układ. Cały ekosystem pod pisanie CV.
              </h2>
            </div>
            <FeatureGrid items={PERKS} />
          </section>

          <section className="mb-20 rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-10 sm:p-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <p className="mono-label text-[color:var(--saffron)]">Dlaczego nie Word, nie Canva</p>
                <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight">
                  Word wygląda nieprofesjonalnie. Canva nie przechodzi ATS.
                </h2>
                <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--ink-soft)]">
                  Wzory CV z Worda to najczęściej dwie kolumny i dekoracyjne czcionki, które rozjeżdżają się w
                  parserach. Canva dodaje grafikę z tekstem — ATS jej nie widzi. W agentcv dostajesz szablon
                  projektowany pod rzeczywistość rekrutacji 2026 — czyta go rekruter i parser.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <MagneticButton
                  href="/poradniki/co-to-jest-ats"
                  variant="ghost-ink"
                  size="md"
                >
                  Co to jest ATS
                </MagneticButton>
                <p className="mono-label text-[color:var(--ink-muted)]">
                  4 parsery · 10 testów · 0 błędów
                </p>
              </div>
            </div>
          </section>

          <ClosingCTA
            headline="Wybierz wzór i napisz CV w 5 minut"
            subhead="Pierwsze CV za darmo, bez karty. Zaloguj się przez Google albo Facebook i startuj — asystent Pracuś AI prowadzi przez każdą sekcję."
            utmCampaign="wzor-cv"
            primaryLabel="Otwórz kreator"
          />
        </div>

        <Script id="wzor-cv-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(schema)}
        </Script>
      </main>
      <MobileStickyCta
        href="/kreator?utm_source=wzor-cv&utm_medium=sticky&utm_campaign=wzor"
        label="Stwórz swoje CV"
        subLabel="Szablon w 5 minut"
        storageKey="mobile-cta-wzor-cv"
      />
    </MarketingShell>
  );
}
