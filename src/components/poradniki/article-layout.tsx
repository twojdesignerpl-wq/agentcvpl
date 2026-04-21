import Script from "next/script";
import type { Poradnik } from "@/lib/poradniki/data";
import { getPoradnik } from "@/lib/poradniki/data";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
} from "@/lib/seo/schema";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { ArticleHero } from "./article-hero";
import { ArticleFaq } from "./article-faq";
import { Breadcrumb } from "./breadcrumb";
import { ClosingCTA } from "./closing-cta";
import { ProseBlocks } from "./prose-blocks";
import { RelatedArticles } from "./related-articles";
import { TableOfContents } from "./table-of-contents";
import { MobileTocOverlay } from "./mobile-toc-overlay";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";

export function ArticleLayout({ poradnik }: { poradnik: Poradnik }) {
  const related = poradnik.relatedSlugs
    .map((slug) => getPoradnik(slug))
    .filter((p): p is Poradnik => Boolean(p));

  const heroCtaHref = `/kreator?utm_source=poradniki&utm_medium=hero&utm_campaign=${encodeURIComponent(poradnik.slug)}`;

  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: poradnik.title,
      description: poradnik.description,
      slug: `/poradniki/${poradnik.slug}`,
      publishedAt: poradnik.publishedAt,
      updatedAt: poradnik.updatedAt,
      wordCount: poradnik.wordCount,
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Poradniki", url: "/poradniki" },
      { name: poradnik.title, url: `/poradniki/${poradnik.slug}` },
    ]),
    faqSchema(poradnik.faq),
  ];
  if (poradnik.howTo) {
    schemas.push(
      howToSchema({
        name: poradnik.howTo.name,
        description: poradnik.howTo.description,
        totalTime: poradnik.howTo.totalTime,
        steps: poradnik.howTo.steps,
      }),
    );
  }

  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 pt-28 pb-16 sm:px-8 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Start", href: "/" },
            { label: "Poradniki", href: "/poradniki" },
            { label: poradnik.title },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_260px]">
          <article>
            <ArticleHero
              eyebrow={poradnik.heroEyebrow}
              title={poradnik.title}
              subtitle={poradnik.heroSubtitle}
              readingTimeMin={poradnik.readingTimeMin}
              updatedAt={poradnik.updatedAt}
              ctaHref={heroCtaHref}
            />

            <ProseBlocks blocks={poradnik.blocks} />

            <ClosingCTA
              headline="Gotowy napisać swoje CV?"
              subhead={`Asystent Pracuś AI przeprowadzi Cię przez każdą sekcję. Pierwsze CV za darmo, bez karty, po polsku. Zaloguj się przez Google albo Facebook i startuj.`}
              utmCampaign={poradnik.slug}
            />

            <ArticleFaq items={poradnik.faq} />
            <RelatedArticles items={related} />
          </article>

          <TableOfContents blocks={poradnik.blocks} />
        </div>
      </div>

      <MobileTocOverlay blocks={poradnik.blocks} />
      <MobileStickyCta
        href={heroCtaHref}
        label="Stwórz CV z Pracusiem"
        subLabel="ATS-friendly · 0 zł · bez karty"
        storageKey={`mobile-cta-${poradnik.slug}`}
      />

      <Script
        id={`poradnik-ld-${poradnik.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(schemas)}
      </Script>
    </main>
    </MarketingShell>
  );
}
