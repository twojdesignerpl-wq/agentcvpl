import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/poradniki/article-layout";
import { getPoradnik } from "@/lib/poradniki/data";

const SLUG = "jak-uzywac-kreatora-cv";

export function generateMetadata(): Metadata {
  const p = getPoradnik(SLUG);
  if (!p) return {};
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
    },
    twitter: {
      card: "summary_large_image",
      title: p.seoTitle,
      description: p.description,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  const p = getPoradnik(SLUG);
  if (!p) notFound();
  return <ArticleLayout poradnik={p} />;
}
