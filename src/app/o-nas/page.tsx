import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { BRAND } from "@/lib/landing/brand";
import { aboutPageSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "O nas — zespół i misja agentcv | agentcv",
  description:
    "Kim jesteśmy i dlaczego budujemy agentcv — polski kreator CV z asystentem AI Pracuś. Misja, źródła wiedzy, podejście do prywatności danych kandydatów.",
  keywords: ["o nas agentcv", "zespół agentcv", "misja agentcv", "Pracuś AI", "polski kreator CV"],
  alternates: { canonical: "/o-nas" },
  openGraph: {
    type: "website",
    title: "O nas — agentcv",
    description:
      "Polski kreator CV z asystentem AI Pracuś. Po polsku, pod ATS, z szacunkiem dla Twoich danych.",
    url: "/o-nas",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", title: "O nas — agentcv" },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const schema = [
    aboutPageSchema({
      name: "O nas — agentcv",
      description:
        "Zespół agentcv i misja: dać każdemu Polakowi dostęp do asystenta AI, który napisze CV zgodne z polskimi realiami rynku pracy.",
      slug: "/o-nas",
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "O nas", url: "/o-nas" },
    ]),
  ];

  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:px-8">
        <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "O nas" }]} />

        <header className="mt-8 mb-12 border-b border-[color:var(--ink)]/10 pb-10">
          <div className="flex items-center gap-4">
            <PracusBrandImage variant="icon" size={72} className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]" priority />
            <p className="mono-label text-[color:var(--saffron)]">O projekcie · Pracuś AI</p>
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            Polski kreator CV z asystentem AI, który zna Twoją branżę
          </h1>
          <p className="mt-6 max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
            Budujemy agentcv, bo rynek polskich kreatorów CV w 2026 roku to głównie tłumaczone szablony i
            generyczne AI, które nie rozumie, co to UDT, PRK czy Barometr Zawodów. Chcemy narzędzia, które
            napisze CV jak polski rekruter z 15 latami doświadczeń — nie jak bot po 100 tłumaczonych
            pomocnikach.
          </p>
        </header>

        <div className="prose-agentcv">
          <h2>Co robimy</h2>
          <p>
            {BRAND.name} to darmowy kreator CV z polskim asystentem AI o imieniu Pracuś. Piszemy pod polskie
            realia rynku pracy: 26 branż z uprawnieniami (UDT, SEP, ADR, HACCP, PRK/ZSK), 5 szablonów
            testowanych w parserach ATS (Workday, Greenhouse, Lever, eRecruiter), pełne wsparcie dla
            zawodów fizycznych i technicznych.
          </p>

          <h2>Źródła, na których bazuje Pracuś</h2>
          <p>
            Baza wiedzy naszego agenta jest zbudowana na publicznych, weryfikowalnych standardach HR, nie
            na generycznych danych z internetu:
          </p>
          <ul>
            <li>
              <strong>ESCO</strong> — europejska klasyfikacja umiejętności, kompetencji i zawodów (UE).
            </li>
            <li>
              <strong>PRK / ZSK</strong> — Polska Rama Kwalifikacji, 8 poziomów krajowego systemu
              kwalifikacji.
            </li>
            <li>
              <strong>Barometr Zawodów 2026</strong> — prognoza MRPiPS dotycząca popytu na zawody w Polsce.
            </li>
            <li>
              <strong>BKL PARP</strong> — Bilans Kapitału Ludzkiego, badanie kompetencji pracowników w PL.
            </li>
            <li>
              <strong>O*NET</strong> — amerykańska baza danych zawodowych (US Department of Labor).
            </li>
            <li>
              <strong>KZiS</strong> — Klasyfikacja Zawodów i Specjalności używana na polskim rynku pracy.
            </li>
          </ul>

          <h2>Kim jest Pracuś</h2>
          <p>
            Pracuś to agent AI wzorowany na persona seniorskiego rekrutera z 15 latami doświadczeń na
            polskim rynku pracy. Specjalizuje się w pisaniu konkretów, nie generycznych frazesów. Czyta
            ogłoszenia, porównuje z Twoim CV, proponuje zmiany w formie kart „Zastosuj / Odrzuć&rdquo; — nigdy
            nie nadpisuje niczego bez Twojej decyzji.
          </p>
          <p>
            Pod spodem Pracuś jest powered by Claude od Anthropic — najnowocześniejszym modelem języka
            naturalnego z natywną obsługą polskiego. Model nie uczy się na Twoich danych, rozmowy nie są
            wykorzystywane do trenowania.
          </p>

          <h2>Prywatność i RODO</h2>
          <p>
            Twoje konto jest zabezpieczone OAuth-em (Google albo Facebook) — nie przechowujemy haseł.
            Dane CV w szyfrowanym magazynie w Unii Europejskiej. Nie sprzedajemy danych, nie budujemy
            profili marketingowych, nie wysyłamy do brokerów. Konto i wszystkie CV usuwasz sam z poziomu
            ustawień — bez pisania do supportu.
          </p>
          <p>
            Klauzulę RODO (standardową, przyszłościową albo obie) wybierasz z listy — wstawia się
            automatycznie na końcu Twojego CV. Zero kombinowania ze znajdywaniem poprawnego brzmienia.
          </p>

          <h2>Dlaczego za darmo</h2>
          <p>
            Pierwsze CV w agentcv jest bezpłatne, na zawsze. Pro (19 zł/miesiąc) odblokuje pełnego Pracusia
            z dopasowaniem do ogłoszeń, live ATS score i historią wersji — to wersja dla aktywnie
            szukających. Unlimited (39 zł/miesiąc) dla recruiterów i career coachów, którzy potrzebują
            wielu CV miesięcznie i faktur VAT.
          </p>
          <p>
            Płacisz za rzeczywiste korzyści, nie za sam dostęp do edytora. Rezygnacja jednym kliknięciem,
            bez okresu wypowiedzenia.
          </p>

          <h2>Skontaktuj się</h2>
          <p>
            Pisz na{" "}
            <Link
              href="/kontakt"
              className="font-semibold text-[color:var(--ink)] underline decoration-[color:var(--saffron)]/60 underline-offset-4 hover:decoration-[color:var(--saffron)]"
            >
              /kontakt
            </Link>{" "}
            albo bezpośrednio na{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="font-semibold text-[color:var(--ink)] underline decoration-[color:var(--saffron)]/60 underline-offset-4 hover:decoration-[color:var(--saffron)]"
            >
              {BRAND.email}
            </a>
            . Odpisujemy w ciągu doby, po polsku.
          </p>
        </div>

        <section className="mt-16 overflow-hidden rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)] p-10 text-[color:var(--cream)] sm:p-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
                Sprawdź, jak pisze Pracuś
              </h2>
              <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--cream)]/75">
                Pierwsze CV za darmo, bez karty. Zaloguj się przez Google albo Facebook i startuj.
              </p>
            </div>
            <MagneticButton
              href="/kreator?utm_source=o-nas&utm_medium=closing&utm_campaign=o-nas"
              variant="saffron"
              size="lg"
            >
              Otwórz kreator
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </div>
        </section>
      </div>

      <Script id="o-nas-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
    </main>
    </MarketingShell>
  );
}
