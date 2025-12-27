import type { MetadataRoute } from "next";
import { getJourneys } from "@/lib/journeys";
import { getAllPostsMeta } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

function toValidDate(input: unknown, fallback: Date) {
  if (typeof input !== "string") return fallback;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function withNoTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const baseUrl = withNoTrailingSlash(siteConfig.url);
  const journeys = getJourneys();
  const posts = getAllPostsMeta();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/journeys`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...journeys.map((j) => ({
      url: `${baseUrl}/journeys/${j.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: toValidDate(p.date, now),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  return routes;
}
