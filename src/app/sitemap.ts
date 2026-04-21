import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/landing/brand";
import { listPoradniki } from "@/lib/poradniki/data";
import { templates } from "@/lib/landing/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const poradniki = listPoradniki();

  return [
    {
      url: BRAND.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BRAND.url}/poradniki`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...poradniki.map((p) => ({
      url: `${BRAND.url}/poradniki/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: `${BRAND.url}/wzor-cv`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BRAND.url}/szablony`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...templates.map((t) => ({
      url: `${BRAND.url}/szablony/${t.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    {
      url: `${BRAND.url}/dla-firm`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BRAND.url}/o-nas`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BRAND.url}/kontakt`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BRAND.url}/#cennik`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BRAND.url}/#szablony`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BRAND.url}/#faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BRAND.url}/regulamin`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BRAND.url}/polityka-prywatnosci`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
