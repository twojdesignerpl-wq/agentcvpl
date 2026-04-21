import type { Metadata } from "next";
import Script from "next/script";
import {
  ArrowRight,
  Briefcase,
  Receipt,
  Users,
  Lightning,
  ChartLine,
  Lock,
} from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { ClosingCTA } from "@/components/poradniki/closing-cta";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { StatsBar } from "@/components/landing/_shared/stats-bar";
import { FeatureGrid } from "@/components/landing/_shared/feature-grid";
import { breadcrumbSchema, aboutPageSchema } from "@/lib/seo/schema";
import { BRAND } from "@/lib/landing/brand";

export const metadata: Metadata = {
  title: "agentcv dla firm — coachy, rekruterzy, outplacement | agentcv",
  description:
    "Piszesz CV dla klientów? Plan Unlimited: bez limitu pobrań, priority agent, faktury VAT, dedykowane wsparcie. Dla career coachów, recruiterów zewnętrznych, outplacement.",
  keywords: [
    "agentcv dla firm",
    "agentcv dla rekruterów",
    "career coach narzędzie",
    "outplacement CV",
    "recruiter CV tool",
    "B2B kreator CV",
    "faktury VAT agentcv",
  ],
  alternates: { canonical: "/dla-firm" },
  openGraph: {
    type: "website",
    title: "agentcv dla firm — coachy, rekruterzy, outplacement",
    description:
      "Plan Unlimited dla osób piszących CV dla klientów: bez limitu pobrań, priority agent, faktury VAT.",
    url: "/dla-firm",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", title: "agentcv dla firm" },
  robots: { index: true, follow: true },
};

const STATS = [
  { label: "branże PL w bazie", value: "26" },
  { label: "szablony ATS", value: "5" },
  { label: "parsery testowe", value: "4" },
  { label: "limit pobrań Unlimited", value: "∞" },
] as const;

const FOR_WHO = [
  {
    icon: Users,
    title: "Career coachy",
    body: "Piszesz CV i przygotowujesz klientów do rozmów rekrutacyjnych? Unlimited daje Ci bazę wiedzy 26 branż, historię każdego klienta i priority generowania.",
  },
  {
    icon: Briefcase,
    title: "Agencje rekrutacyjne",
    body: "Tworzysz polskie CV dla kandydatów z portfela? Masz wszystkie 5 szablonów, wklejasz link ogłoszenia, Pracuś wskazuje braki — szybciej niż ręczne poprawki.",
  },
  {
    icon: ChartLine,
    title: "Firmy outplacement",
    body: "Prowadzisz programy transition dla pracowników po zwolnieniach? Konto firmowe z historią CV każdego uczestnika, spójne branżowe bazy wiedzy, faktury VAT miesięcznie.",
  },
];

const UNLIMITED_PERKS = [
  {
    icon: Lightning,
    title: "Priority agent",
    body: "Twoje zapytania do Pracuś AI idą bez kolejki. Szybsze generowanie, krótsze czasy odpowiedzi w chat.",
    accent: "saffron" as const,
  },
  {
    icon: Receipt,
    title: "Faktury VAT automatycznie",
    body: "Faktury VAT generujemy po każdej płatności, pobierzesz z panelu konta. Dla samozatrudnionych (JDG) i spółek.",
    accent: "saffron" as const,
  },
  {
    icon: Users,
    title: "Historia wszystkich CV",
    body: "Bez limitu pobrań, każdy wariant dla każdego klienta zapisany. Przełączasz między wersjami jednym klikiem.",
    accent: "saffron" as const,
  },
  {
    icon: Lock,
    title: "RODO + szyfrowanie",
    body: "Dane klientów w szyfrowanym magazynie w UE. Logowanie OAuth (Google/Facebook), bez haseł u nas.",
    accent: "jade" as const,
  },
  {
    icon: Briefcase,
    title: "Dedykowane wsparcie",
    body: "Pytanie biznesowe albo techniczne? Odpowiadamy w <12h. Dla większych zespołów — dedykowany kanał Slack/e-mail.",
    accent: "jade" as const,
  },
  {
    icon: ChartLine,
    title: "Beta features jako pierwsi",
    body: "Nowe szablony, nowe toole AI, nowe branże — dostajesz wcześniejszy dostęp i możesz wpłynąć na roadmap.",
    accent: "jade" as const,
  },
];

const USE_CASES = [
  {
    title: "Career coach — klient po macierzyńskim",
    body: "Klientka wraca do pracy po 3 latach. Wspólnie wypełniacie kreator, Pracuś przeformułowuje lukę ('prowadzenie domu 3 lata, project management rodziny') w konkretne kompetencje. Eksport PDF na pierwszą rozmowę po 20 minutach sesji.",
  },
  {
    title: "Agencja rekrutacji — kandydat IT senior",
    body: "Rekruter wkleja link ogłoszenia z JustJoin (tech stack, wymagania). Pracuś wyciąga keywords, porównuje z CV kandydata, wskazuje braki. Przepisane CV wraca do rekrutera w 10 minut, ATS score 87/100.",
  },
  {
    title: "Outplacement — 40 uczestników w miesiąc",
    body: "Firma outplacement ma 40 osób pod opieką. Konto Unlimited agentcv obsługuje wszystkich — każdy uczestnik loguje się przez Google/Facebook, konsultant widzi historię wersji, wspiera w iteracjach.",
  },
];

export default function DlaFirmPage() {
  const schema = [
    aboutPageSchema({
      name: "agentcv dla firm",
      description: "Plan Unlimited agentcv dla career coachów, agencji rekrutacyjnych i firm outplacement.",
      slug: "/dla-firm",
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Dla firm", url: "/dla-firm" },
    ]),
  ];

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-24 sm:px-8 lg:px-12">
          <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Dla firm" }]} />

          <header className="mt-8 mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
            <div className="flex items-center gap-4">
              <PracusBrandImage variant="icon" size={72} className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]" priority />
              <p className="mono-label text-[color:var(--saffron)]">Dla firm · Plan Unlimited</p>
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              Piszesz CV dla klientów? Pracuj z asystentem, nie dookoła niego.
            </h1>
            <p className="max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
              Plan Unlimited agentcv dla career coachów, agencji rekrutacyjnych i firm outplacement.
              Bez limitu pobrań, priority agent, historia wszystkich CV, faktury VAT — narzędzie
              zaprojektowane pod profesjonalną pracę z wieloma klientami.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton
                href="/kreator?plan=unlimited&utm_source=dla-firm&utm_medium=hero&utm_campaign=dla-firm"
                variant="ink"
                size="md"
              >
                Aktywuj Unlimited
                <ArrowRight size={16} weight="bold" />
              </MagneticButton>
              <MagneticButton href="/kontakt" variant="ghost-ink" size="md">
                Porozmawiaj z nami
              </MagneticButton>
            </div>
          </header>

          <section className="mb-16">
            <StatsBar items={[...STATS]} />
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Dla kogo Unlimited</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Trzy profile, którym plan Unlimited opłaca się po 2 klientach miesięcznie
              </h2>
            </div>
            <FeatureGrid items={FOR_WHO} />
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Co dostajesz w Unlimited</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Wszystko z Pro, plus narzędzia pod profesjonalną pracę z portfelem klientów
              </h2>
            </div>
            <FeatureGrid items={UNLIMITED_PERKS} />
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Jak wygląda praca z Unlimited</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Trzy realne scenariusze — z praktyki career coachów, rekruterów i outplacement
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {USE_CASES.map((uc, idx) => (
                <article
                  key={uc.title}
                  className="flex flex-col gap-4 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7"
                >
                  <span
                    aria-hidden
                    className="font-display text-[2.5rem] font-black leading-none text-[color:var(--saffron)]"
                  >
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-[1.2rem] font-semibold leading-tight tracking-tight text-[color:var(--ink)]">
                    {uc.title}
                  </h3>
                  <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                    {uc.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-20 overflow-hidden rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)] p-10 text-[color:var(--cream)] sm:p-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="mono-label text-[color:var(--saffron)]">Plan Unlimited</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-tighter">
                    39 zł
                  </span>
                  <span className="mono-label text-[color:var(--cream)]/65">/ miesiąc</span>
                </div>
                <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--cream)]/75">
                  Faktura VAT po każdej płatności. Rezygnacja w jednym kliknięciu, bez okresu wypowiedzenia.
                  Bez limitu pobrań CV, bez limitu klientów. Pierwsze CV w planie Free — testujesz zanim
                  kupisz.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <MagneticButton
                  href="/kreator?plan=unlimited&utm_source=dla-firm&utm_medium=pricing&utm_campaign=dla-firm"
                  variant="saffron"
                  size="lg"
                >
                  Aktywuj Unlimited
                  <ArrowRight size={16} weight="bold" />
                </MagneticButton>
                <p className="mono-label text-[color:var(--cream)]/55">
                  RODO ✓ · Faktury VAT · Bez zobowiązań
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20 rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-10 sm:p-14">
            <div className="max-w-3xl">
              <p className="mono-label text-[color:var(--saffron)]">Potrzebujesz pakietu dla zespołu?</p>
              <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight">
                Większe zespoły — napisz do nas
              </h2>
              <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--ink-soft)]">
                Dla firm outplacement z 20+ uczestnikami miesięcznie, agencji rekrutacyjnych z 5+
                rekruterami, albo działów HR, które chcą dać kreator swoim pracownikom w programach
                career development — mamy pakiet enterprise. Napisz na{" "}
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-semibold text-[color:var(--ink)] underline decoration-[color:var(--saffron)]/60 underline-offset-4 hover:decoration-[color:var(--saffron)]"
                >
                  {BRAND.email}
                </a>{" "}
                z tematem „Enterprise&rdquo; — ustalimy ceny, SLA i proces onboardingu dla Twojego zespołu.
              </p>
            </div>
          </section>

          <ClosingCTA
            headline="Sprawdź Unlimited na swoim pierwszym CV"
            subhead="Free plan daje Ci 1 pobranie CV za darmo — testujesz kreator i asystenta Pracuś AI bez karty. Gdy wiesz, że działa, przechodzisz na Unlimited z fakturą VAT."
            utmCampaign="dla-firm"
            primaryLabel="Zacznij za darmo"
          />
        </div>

        <Script id="dla-firm-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(schema)}
        </Script>
      </main>
      <MobileStickyCta
        href="/kreator?utm_source=dla-firm&utm_medium=sticky&utm_campaign=b2b"
        label="Zobacz kreator na sobie"
        subLabel="Pierwsze CV za darmo"
        storageKey="mobile-cta-dla-firm"
      />
    </MarketingShell>
  );
}
