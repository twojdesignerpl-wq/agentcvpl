import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, FileArrowDown, Palette, ShieldCheck, Cards } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { ClosingCTA } from "@/components/poradniki/closing-cta";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { FeatureGrid } from "@/components/landing/_shared/feature-grid";
import { StatsBar } from "@/components/landing/_shared/stats-bar";
import { templates } from "@/lib/landing/content";
import { breadcrumbSchema, articleSchema } from "@/lib/seo/schema";

type TemplateId = "orbit" | "atlas" | "terra" | "cobalt" | "lumen";

const TEMPLATE_COPY: Record<
  TemplateId,
  {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    positioning: string;
    forWho: string[];
    bestFor: string;
    avoidIf: string;
    compareWith: [TemplateId, TemplateId];
  }
> = {
  orbit: {
    seoTitle: "Szablon CV Orbit — klasyczny minimal pod ATS | agentcv",
    seoDescription:
      "Orbit to minimalistyczny 2-kolumnowy szablon CV testowany w parserach ATS. Uniwersalny, czytelny, idealny dla większości branż. Pobierz darmowy wzór.",
    keywords: ["szablon CV Orbit", "wzór CV minimal", "CV klasyczny", "CV uniwersalny", "CV 2 kolumny"],
    positioning: "Klasyczny 2-kolumnowy minimal — uniwersalny, neutralny, przechodzi każdy parser ATS.",
    forWho: [
      "Każda branża — bezpieczny wybór gdy nie wiesz, co wybrać",
      "Kandydat senior / doświadczony — treść ma pierwszeństwo nad formą",
      "Aplikacje do korporacji i instytucji publicznych",
      "Zawody techniczne (IT, inżynieria, produkcja) — treść > design",
      "Pierwsze CV / CV bez doświadczenia — nie walczy o uwagę z treścią",
    ],
    bestFor: "Uniwersalność. Każda branża, każdy etap kariery, każdy typ pracodawcy.",
    avoidIf: "Szukasz CV, które wyróżni się kolorystyką — wybierz Terra lub Cobalt.",
    compareWith: ["lumen", "atlas"],
  },
  atlas: {
    seoTitle: "Szablon CV Atlas — navy z ikonami kontaktu | agentcv",
    seoDescription:
      "Atlas to eleganckie CV z granatowym akcentem, ikonami kontaktowymi i sekcjami full-width. Dla managerów, sales, finance, HR. Pobierz darmowy wzór pod ATS.",
    keywords: ["szablon CV Atlas", "wzór CV navy", "CV manager", "CV sales", "CV finance", "CV z ikonami"],
    positioning: "Granat z niebieskim akcentem, ikony przy danych kontaktowych, sekcje full-width. Profesjonalnie i klasycznie, ale z lekkim charakterem.",
    forWho: [
      "Manager / kierownik zmiany / team leader",
      "Specjalista sales z doświadczeniem w B2B",
      "Finance / controlling / analityk",
      "HR / BP / rekruter",
      "Konsultant / doradca biznesowy",
    ],
    bestFor: "Role biznesowe, gdzie forma ma znaczenie, ale konserwatywnie.",
    avoidIf: "Aplikujesz do kreatywnej branży (design, media) — Terra lepsza.",
    compareWith: ["cobalt", "orbit"],
  },
  terra: {
    seoTitle: "Szablon CV Terra — editorial z terakotą | agentcv",
    seoDescription:
      "Terra to editorialny szablon CV z akcentem terakoty i italic serif. Dla designerów, marketingu, copywriterów, kreatywnych. Pobierz wzór po polsku.",
    keywords: ["szablon CV Terra", "wzór CV editorial", "CV designer", "CV kreatywny", "CV copywriter", "CV serif"],
    positioning: "Editorialny szablon z terakotowym akcentem i italic serif. CV dla branż, gdzie estetyka to część Twojego portfolio.",
    forWho: [
      "Designer (graficzny, UX/UI, produktowy)",
      "Copywriter, content writer, redaktor",
      "Marketing kreatywny, brand manager",
      "Fotograf, filmowiec, art director",
      "Architekt, scenograf, projektant wnętrz",
    ],
    bestFor: "Branże, gdzie wygląd CV sam jest portfolio.",
    avoidIf: "Aplikujesz do korporacji / finance / administracji — Orbit / Atlas bezpieczniejsze.",
    compareWith: ["cobalt", "lumen"],
  },
  cobalt: {
    seoTitle: "Szablon CV Cobalt — navy na cream + sidebar | agentcv",
    seoDescription:
      "Cobalt to CV z navy headingami na cream background, sidebarem kontaktowym i pastelowymi blobami. Dla product, marketing, UX. Pobierz darmowy wzór.",
    keywords: ["szablon CV Cobalt", "wzór CV z sidebarem", "CV product manager", "CV UX", "CV e-commerce"],
    positioning: "Navy headings na ciepłym cream, sidebar z kontaktem i linkami, dekoracyjne pastelowe kształty w rogach. CV, które się wyróżnia bez ryzyka.",
    forWho: [
      "Product Manager / Product Owner",
      "Marketing digital, performance, growth",
      "UX / UI designer z fokusem na produkt",
      "E-commerce manager, category manager",
      "Junior / mid w firmach produktowych i scale-upach",
    ],
    bestFor: "Firmy produktowe, SaaS, e-commerce, gdzie nowoczesność ma znaczenie.",
    avoidIf: "Aplikujesz do tradycyjnej korporacji / urzędu — Orbit / Atlas lepsze.",
    compareWith: ["terra", "atlas"],
  },
  lumen: {
    seoTitle: "Szablon CV Lumen — editorial monochrom dla seniorów | agentcv",
    seoDescription:
      "Lumen to monochromatyczny CV z etykietami sekcji obok treści. Dla seniorów, managerów z długim doświadczeniem, editorial. Pobierz wzór po polsku.",
    keywords: ["szablon CV Lumen", "wzór CV senior", "CV editorial", "CV monochrom", "CV dla dyrektora"],
    positioning: "Editorialny, monochromatyczny layout z etykietami sekcji ustawionymi obok treści. Minimalistycznie dojrzały — dla seniorów z dużą ilością treści.",
    forWho: [
      "Senior Manager / Director / Head of",
      "Architekt, inżynier senior, konstruktor",
      "Konsultant z 10+ lat doświadczenia",
      "Freelancer / konsultant indywidualny",
      "Doświadczony ekspert (publikacje, konferencje)",
    ],
    bestFor: "Senior role, gdzie treść jest bogata i wymaga przestrzeni na oddech.",
    avoidIf: "Jesteś juniorem z mało doświadczeniem — Orbit pokazuje treść lepiej przy krótkim CV.",
    compareWith: ["orbit", "terra"],
  },
};

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const copy = TEMPLATE_COPY[slug as TemplateId];
  if (!copy) return {};
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    keywords: [...copy.keywords],
    alternates: { canonical: `/szablony/${slug}` },
    openGraph: {
      type: "article",
      title: copy.seoTitle,
      description: copy.seoDescription,
      url: `/szablony/${slug}`,
      siteName: "agentcv",
      locale: "pl_PL",
    },
    twitter: { card: "summary_large_image", title: copy.seoTitle, description: copy.seoDescription },
    robots: { index: true, follow: true },
  };
}

const PERKS = [
  { icon: ShieldCheck, title: "Testowany w ATS", body: "Workday, Greenhouse, Lever, eRecruiter — wszystkie przechodzą szablon bez błędów parsowania.", accent: "jade" as const },
  { icon: Palette, title: "Treść zostaje, forma się zmienia", body: "Przełączenie na inny szablon jednym klikiem — Twoje doświadczenie, sekcje i kolejność pozostają." },
  { icon: Cards, title: "Auto-fit 1 strona A4", body: "Kreator automatycznie dopasowuje rozmiar czcionki (do min. 8 pt), żeby wszystko zmieściło się na jednej stronie." },
  { icon: FileArrowDown, title: "PDF + DOCX jednym klikiem", body: "Oba formaty ATS-friendly, bez znaków wodnych, bez ograniczeń wersji testowej." },
  { icon: CheckCircle, title: "Klauzula RODO automatycznie", body: "Wybierasz wersję klauzuli (standardowa, przyszłościowa albo obie) — trafia na koniec CV." },
];

export default async function SzablonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((t) => t.id === slug);
  const copy = TEMPLATE_COPY[slug as TemplateId];
  if (!template || !copy) notFound();

  const others = copy.compareWith
    .map((id) => templates.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const schema = [
    articleSchema({
      title: copy.seoTitle,
      description: copy.seoDescription,
      slug: `/szablony/${slug}`,
      publishedAt: "2026-04-21T00:00:00.000Z",
      updatedAt: "2026-04-21T00:00:00.000Z",
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Szablony CV", url: "/szablony" },
      { name: `Szablon ${template.name}`, url: `/szablony/${slug}` },
    ]),
  ];

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-24 sm:px-8 lg:px-12">
          <Breadcrumb
            items={[
              { label: "Start", href: "/" },
              { label: "Szablony CV", href: "/szablony" },
              { label: `Szablon ${template.name}` },
            ]}
          />

          <header className="mt-8 mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
            <div className="flex items-center gap-4">
              <PracusBrandImage
                variant="icon"
                size={72}
                priority
                className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]"
              />
              <p className="mono-label text-[color:var(--saffron)]">{template.tag}</p>
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              Szablon CV {template.name}
            </h1>
            <p className="max-w-2xl font-body text-[1.15rem] leading-relaxed text-[color:var(--ink-soft)]">
              {copy.positioning}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton
                href={`/kreator?template=${slug}&utm_source=szablony&utm_medium=hero&utm_campaign=${slug}`}
                variant="ink"
                size="md"
              >
                Użyj szablonu {template.name}
                <ArrowRight size={16} weight="bold" />
              </MagneticButton>
              <MagneticButton href="/szablony" variant="ghost-ink" size="md">
                Zobacz inne szablony
              </MagneticButton>
            </div>
          </header>

          <section className="mb-16">
            <StatsBar
              items={[
                { label: "rozmiar", value: "1 strona" },
                { label: "testy ATS", value: "4 parsery" },
                { label: "format", value: "PDF + DOCX" },
                { label: "cena", value: "0 zł" },
              ]}
            />
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Dla kogo ten szablon</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                {template.name} najlepiej pasuje do tych profili
              </h2>
              <p className="max-w-2xl font-body text-[1.05rem] leading-relaxed text-[color:var(--ink-soft)]">
                {copy.bestFor}
              </p>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              {copy.forWho.map((who) => (
                <li
                  key={who}
                  className="flex items-start gap-3 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-5"
                >
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
                  >
                    <CheckCircle size={14} weight="fill" />
                  </span>
                  <span className="font-body text-[0.98rem] leading-snug text-[color:var(--ink)]">
                    {who}
                  </span>
                </li>
              ))}
            </ul>
            <aside className="mt-6 rounded-2xl border border-[color:var(--rust)]/30 bg-[color:color-mix(in_oklab,var(--rust)_6%,var(--cream-soft))] p-5">
              <p className="mono-label mb-1.5 text-[color:var(--rust)]">Uważaj</p>
              <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                {copy.avoidIf}
              </p>
            </aside>
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Co dostajesz</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Każdy szablon z pełnym ekosystemem kreatora agentcv
              </h2>
            </div>
            <FeatureGrid items={PERKS} />
          </section>

          <section className="mb-20">
            <div className="mb-10 flex flex-col gap-3">
              <p className="mono-label text-[color:var(--saffron)]">Porównaj z innymi</p>
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
                Inne szablony, jeśli {template.name} nie pasuje do Twojego profilu
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/szablony/${other.id}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-6 transition-all hover:border-[color:var(--ink)]/30"
                >
                  <p className="mono-label text-[color:var(--ink-muted)]">{other.tag}</p>
                  <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-tight text-[color:var(--ink)]">
                    {other.name}
                  </h3>
                  <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                    {other.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-body text-[0.9rem] font-semibold text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--saffron)]">
                    Zobacz szablon
                    <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <ClosingCTA
            headline={`Otwórz kreator z szablonem ${template.name}`}
            subhead="Pierwsze CV za darmo, bez karty. Asystent Pracuś AI prowadzi przez każdą sekcję, ATS score pokazuje brakujące słowa kluczowe."
            utmCampaign={`szablony-${slug}`}
            primaryLabel={`Użyj szablonu ${template.name}`}
          />
        </div>

        <Script id={`szablon-${slug}-ld`} type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(schema)}
        </Script>
      </main>
    </MarketingShell>
  );
}
