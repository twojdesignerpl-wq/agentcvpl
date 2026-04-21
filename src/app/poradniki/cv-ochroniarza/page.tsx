import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/poradniki/article-layout";
import { getPoradnik } from "@/lib/poradniki/data";

const SLUG = "cv-ochroniarza";

export function generateMetadata(): Metadata {
  const p = getPoradnik(SLUG);
  if (!p) return {};
  const og = `/api/og?title=${encodeURIComponent(p.title)}&eyebrow=${encodeURIComponent(p.heroEyebrow)}`;
  return {
    title: p.seoTitle,
    description: p.description,
    keywords: [...p.keywords],
    alternates: { canonical: `/poradniki/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.seoTitle,
      description: p.description,
      url: `/poradniki/${p.slug}`,
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
      authors: ["agentcv"],
      siteName: "agentcv",
      locale: "pl_PL",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: p.seoTitle, description: p.description, images: [og] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  const p = getPoradnik(SLUG);
  if (!p) notFound();
  return <ArticleLayout poradnik={p} />;
}
