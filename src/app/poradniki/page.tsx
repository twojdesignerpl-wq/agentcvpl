import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { listPoradniki } from "@/lib/poradniki/data";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Poradniki — jak napisać CV, ATS, tutorial kreatora | agentcv",
  description:
    "Poradniki CV po polsku: jak napisać CV krok po kroku, co to jest ATS, tutorial kreatora agentcv. Wiedza oparta na realnych źródłach HR, bez zgadywania.",
  keywords: [
    "poradniki CV",
    "jak napisać CV",
    "ATS poradnik",
    "kreator CV tutorial",
    "wzór CV",
    "CV po polsku",
  ],
  alternates: { canonical: "/poradniki" },
  openGraph: {
    type: "website",
    title: "Poradniki CV — jak napisać CV, ATS, tutorial | agentcv",
    description:
      "Praktyczne poradniki: jak napisać CV, co to jest ATS, jak używać kreatora agentcv. Po polsku, dla 26 branż.",
    url: "/poradniki",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poradniki CV — jak napisać CV, ATS, tutorial | agentcv",
    description:
      "Praktyczne poradniki: jak napisać CV, co to jest ATS, jak używać kreatora agentcv.",
  },
  robots: { index: true, follow: true },
};

export default function PoradnikiPage() {
  const items = listPoradniki();
  const schema = [
    collectionPageSchema({
      name: "Poradniki agentcv",
      description: "Przewodniki po tworzeniu CV, ATS i obsłudze kreatora agentcv.",
      slug: "/poradniki",
      items: items.map((p) => ({
        name: p.title,
        url: `/poradniki/${p.slug}`,
        description: p.description,
      })),
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Poradniki", url: "/poradniki" },
    ]),
  ];

  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-20 sm:px-8 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Start", href: "/" },
            { label: "Poradniki" },
          ]}
        />

        <header className="mt-8 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
          <div className="flex items-center gap-4">
            <PracusBrandImage variant="icon" size={72} className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]" priority />
            <p className="mono-label text-[color:var(--saffron)]">Poradniki · Wiedza</p>
          </div>
          <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.025em]">
            Jak napisać CV, które dostaje rozmowy
          </h1>
          <p className="max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
            Trzy pillar-poradniki: podstawy tworzenia CV, wiedza o systemach ATS, tutorial kreatora agentcv. Wszystko po polsku, oparte na realnych źródłach HR (ESCO, PRK/ZSK, Barometr Zawodów 2026, BKL PARP, O*NET, KZiS). Bez zgadywania, bez marketingowego pustosłowia.
          </p>
          <div className="pt-2">
            <MagneticButton href="/kreator?utm_source=poradniki&utm_medium=hub&utm_campaign=hub-hero" variant="ink" size="md">
              Otwórz kreator
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </div>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/poradniki/${p.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-all hover:border-[color:var(--ink)]/30 hover:shadow-[0_32px_64px_-32px_rgba(10,14,26,0.25)]"
            >
              <p className="mono-label text-[color:var(--ink-muted)]">{p.heroEyebrow}</p>
              <h2 className="font-display text-[1.45rem] font-semibold leading-tight tracking-tight text-[color:var(--ink)]">
                {p.title}
              </h2>
              <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                {p.heroSubtitle.split(".")[0]}.
              </p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="mono-label inline-flex items-center gap-1.5 text-[color:var(--ink-muted)]">
                  <Clock size={12} weight="regular" />
                  {p.readingTimeMin} min
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-[0.9rem] font-semibold text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--saffron)]">
                  Czytaj
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-16 overflow-hidden rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)] p-10 text-[color:var(--cream)] sm:p-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mono-label text-[color:var(--saffron)]">Kolejne poradniki</p>
              <h2 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
                Pracujemy nad kolejnymi przewodnikami dla 26 polskich branż
              </h2>
              <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--cream)]/75">
                CV magazyniera, operatora CNC, kierowcy C+E, mechanika, product managera, designerki UX —
                po jednym szczegółowym poradniku na każdą z branż, które zna Pracuś AI. Zacznij od tych trzech, reszta już w drodze.
              </p>
            </div>
            <MagneticButton
              href="/kreator?utm_source=poradniki&utm_medium=hub&utm_campaign=hub-closing"
              variant="saffron"
              size="lg"
            >
              Stwórz CV teraz
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </div>
        </section>
      </div>

      <Script id="poradniki-hub-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
    </main>
    </MarketingShell>
  );
}
