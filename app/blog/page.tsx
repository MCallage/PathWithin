import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPostsMeta } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Evidence-based reflections, guides, and updates from Paths Within.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description: "Evidence-based reflections, guides, and updates from Paths Within.",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Paths Within Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: "Evidence-based reflections, guides, and updates from Paths Within.",
    images: ["/twitter-image.png"],
  },
};

function BlogJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    url: `${siteConfig.url}/blog`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: ["self-knowledge", "anxiety", "mindfulness", "habits"],
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <BlogJsonLd />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Evidence-based reflections, guides, and updates from Paths Within.
        </p>
      </header>

      <BlogListClient posts={posts} />
    </main>
  );
}

