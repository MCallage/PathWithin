import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { BlogPostMeta, getAllPostsMeta } from "@/lib/blog";
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
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: "Evidence-based reflections, guides, and updates from Paths Within.",
  },
};

function absUrl(pathOrUrl: string) {
  if (!pathOrUrl) return siteConfig.url;
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function BlogJsonLd({ posts }: { posts: BlogPostMeta[] }) {
  const blogUrl = absUrl("/blog");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    name: `Blog | ${siteConfig.name}`,
    url: blogUrl,
    description: "Evidence-based reflections, guides, and updates from Paths Within.",
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${absUrl("/") }#website`,
      name: siteConfig.name,
      url: absUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: `${blogUrl}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      keywords: (tags ?? []).join(", "),

    },
    publisher: {
      "@type": "Organization",
      "@id": `${absUrl("/") }#org`,
      name: siteConfig.name,
      url: absUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absUrl("/apple-touch-icon.png"),
      },
    },
    about: [
      { "@type": "Thing", name: "self-knowledge" },
      { "@type": "Thing", name: "anxiety" },
      { "@type": "Thing", name: "mindfulness" },
      { "@type": "Thing", name: "habits" },
    ],
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/blog/${p.slug}`),
        item: {
          "@type": "BlogPosting",
          "@id": `${absUrl(`/blog/${p.slug}`)}#post`,
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          dateModified: p.date,
          url: absUrl(`/blog/${p.slug}`),
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <BlogJsonLd posts={posts} />

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

