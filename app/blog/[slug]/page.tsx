import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { ArticleProse } from "@/components/blog/ArticleProse";

export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

function stripHtml(s: string) {
  return (s ?? "").replace(/<[^>]*>/g, "").trim();
}

function absUrl(pathOrUrl: string) {
  if (!pathOrUrl) return siteConfig.url;
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function toIsoDateOrUndefined(input: unknown) {
  if (typeof input !== "string") return undefined;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const ogPath = `/blog/${slug}/opengraph-image`;
  const twPath = `/blog/${slug}/twitter-image`;

  try {
    const { meta } = await getPostBySlug(slug);

    const title = meta.title ?? "Blog post";
    const description = meta.description ?? siteConfig.description;

    const urlAbs = absUrl(`/blog/${meta.slug}`);
    const ogAbs = absUrl(ogPath);
    const twAbs = absUrl(twPath);

    const publishedTime = toIsoDateOrUndefined(meta.date);
    const tags = (meta.tags ?? []).filter(Boolean);

    return {
      title,
      description,

      alternates: {
        canonical: `/blog/${meta.slug}`,
      },

      keywords: tags.length ? tags : undefined,

      authors: [{ name: siteConfig.name, url: siteConfig.url }],

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },

      openGraph: {
        type: "article",
        url: urlAbs,
        title,
        description,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        publishedTime: publishedTime,
        modifiedTime: publishedTime,
        authors: [siteConfig.url],
        tags: tags.length ? tags : undefined,
        images: [
          {
            url: ogAbs,
            width: 1200,
            height: 630,
            alt: meta.coverAlt ?? title,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [twAbs],
        creator: siteConfig.twitter.handle || undefined,
        site: siteConfig.twitter.site || undefined,
      },
    };
  } catch {
    return {
      title: "Post | Blog",
      alternates: { canonical: "/blog" },
      robots: { index: false, follow: false },
    };
  }
}

function BlogPostJsonLd({
  title,
  description,
  slug,
  date,
  tags,
  cover,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
  cover?: string;
}) {
  const url = absUrl(`/blog/${slug}`);
  const blogUrl = absUrl("/blog");

  const ogImage = absUrl(`/blog/${slug}/opengraph-image`);
  const images = [ogImage];

  if (cover) images.push(absUrl(cover));

  const dateIso = toIsoDateOrUndefined(date);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: title,
    description: stripHtml(description),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": `${blogUrl}#blog`,
      name: `Blog | ${siteConfig.name}`,
      url: blogUrl,
    },
    inLanguage: "en",
    keywords: (tags ?? []).filter(Boolean).join(", ") || undefined,
    datePublished: dateIso ?? undefined,
    dateModified: dateIso ?? undefined,
    image: images,
    author: {
      "@type": "Organization",
      "@id": `${absUrl("/") }#org`,
      name: siteConfig.name,
      url: absUrl("/"),
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BlogBreadcrumbJsonLd({ slug, title }: { slug: string; title: string }) {
  const blogUrl = `${siteConfig.url}/blog`;
  const postUrl = `${siteConfig.url}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: blogUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: postUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}


export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = data;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <BlogBreadcrumbJsonLd slug={meta.slug} title={meta.title} />
      <BlogPostJsonLd
        title={meta.title}
        description={meta.description}
        slug={meta.slug}
        date={meta.date}
        tags={meta.tags}
        cover={meta.cover}
      />

      <Link
        href="/blog"
        className="text-sm text-[var(--muted-foreground)] hover:opacity-80"
      >
        ← Back to blog
      </Link>

      {meta.cover ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={meta.cover}
              alt={meta.coverAlt ?? meta.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {meta.coverAuthor && meta.coverAuthorUrl && meta.coverPhotoUrl ? (
            <div className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
              Photo by{" "}
              <a
                href={meta.coverAuthorUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-80"
              >
                {meta.coverAuthor}
              </a>{" "}
              on{" "}
              <a
                href={meta.coverPhotoUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-80"
              >
                Unsplash
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <header className="mt-6">
        <h1 className="text-3xl font-semibold">{meta.title}</h1>

        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {formatDate(meta.date)}
        </p>

        {meta.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {meta.description ? (
          <p className="mt-4 text-[var(--muted-foreground)]">
            {meta.description}
          </p>
        ) : null}
      </header>

      <div className="mt-8">
        <ArticleProse>{content}</ArticleProse>
      </div>
    </main>
  );
}
