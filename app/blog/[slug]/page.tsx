import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const { meta } = await getPostBySlug(slug);
    return {
      title: `${meta.title} | Blog`,
      description: meta.description,
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: "article",
      },
    };
  } catch {
    return { title: "Post | Blog" };
  }
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
