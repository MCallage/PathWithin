import { getAllPostsMeta } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const runtime = "nodejs";

export const metadata = {
  title: "Blog | Paths Within",
  description: "Evidence-based reflections, guides, and updates from Paths Within.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
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
