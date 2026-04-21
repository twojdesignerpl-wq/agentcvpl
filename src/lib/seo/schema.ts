import { BRAND } from "@/lib/landing/brand";

type Schema = Record<string, unknown>;

const ORGANIZATION_REF = {
  "@type": "Organization",
  name: BRAND.name,
  url: BRAND.url,
  logo: `${BRAND.url}/brand/agentcv-logo.svg`,
};

export function articleSchema(args: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  wordCount?: number;
}): Schema {
  const url = `${BRAND.url}${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    inLanguage: "pl-PL",
    datePublished: args.publishedAt,
    dateModified: args.updatedAt,
    author: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: args.imageUrl ?? `${BRAND.url}/brand/agentcv-og.svg`,
    ...(args.wordCount ? { wordCount: args.wordCount } : {}),
  };
}

export function breadcrumbSchema(
  trail: ReadonlyArray<{ name: string; url: string }>,
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${BRAND.url}${crumb.url}`,
    })),
  };
}

export function howToSchema(args: {
  name: string;
  description: string;
  totalTime?: string;
  steps: ReadonlyArray<{ name: string; text: string }>;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    inLanguage: "pl-PL",
    ...(args.totalTime ? { totalTime: args.totalTime } : {}),
    step: args.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function faqSchema(
  items: ReadonlyArray<{ q: string; a: string }>,
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function collectionPageSchema(args: {
  name: string;
  description: string;
  slug: string;
  items: ReadonlyArray<{ name: string; url: string; description?: string }>;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: `${BRAND.url}${args.slug}`,
    inLanguage: "pl-PL",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: args.items.length,
      itemListElement: args.items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${BRAND.url}${item.url}`,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    },
  };
}

export function aboutPageSchema(args: {
  name: string;
  description: string;
  slug: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: args.name,
    description: args.description,
    url: `${BRAND.url}${args.slug}`,
    inLanguage: "pl-PL",
    about: ORGANIZATION_REF,
  };
}

export function contactPageSchema(args: {
  name: string;
  description: string;
  slug: string;
  email: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: args.name,
    description: args.description,
    url: `${BRAND.url}${args.slug}`,
    inLanguage: "pl-PL",
    mainEntity: {
      ...ORGANIZATION_REF,
      contactPoint: {
        "@type": "ContactPoint",
        email: args.email,
        contactType: "customer support",
        availableLanguage: ["Polish"],
      },
    },
  };
}
