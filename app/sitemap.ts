import type { MetadataRoute } from "next";
import { getJourneys } from "@/lib/journeys";
import { getAllPostsMeta } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const journeys = getJourneys();
  const posts = getAllPostsMeta();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/journeys`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...journeys.map((j) => ({
      url: `${siteConfig.url}/journeys/${j.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    ...posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.date || now),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  return routes;
}
