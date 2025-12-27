import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = await getPostBySlug(slug);

    const title = meta.title ?? "Blog post";
    const description = meta.description ?? siteConfig.description;

    const url = `${siteConfig.url}/blog/${meta.slug}`;
    const ogImage = meta.cover ?? "/opengraph-image.png";
    const ogImageAbs = ogImage.startsWith("http")
      ? ogImage
      : `${siteConfig.url}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

    return {
      title: title,
      description,

      alternates: {
        canonical: `/blog/${meta.slug}`,
      },

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
        url,
        title,
        description,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        images: [
          {
            url: ogImageAbs,
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
        images: [ogImageAbs],
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
  cover,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  cover?: string;
}) {
  const url = `${siteConfig.url}/blog/${slug}`;
  const image = cover
    ? cover.startsWith("http")
      ? cover
      : `${siteConfig.url}${cover.startsWith("/") ? "" : "/"}${cover}`
    : `${siteConfig.url}/opengraph-image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: stripHtml(description),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: date,
    dateModified: date,
    image: [image],
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/apple-touch-icon.png`,
      },
    },
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
      <BlogPostJsonLd
        title={meta.title}
        description={meta.description}
        slug={meta.slug}
        date={meta.date}
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

      <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        {content}
      </article>
    </main>
  );
}
