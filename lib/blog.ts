import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Callout } from "@/components/mdx/Callout";
import { Card, CardGrid } from "@/components/mdx/Card";


const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];

  cover?: string;
  coverAlt?: string;
  coverAuthor?: string;
  coverAuthorUrl?: string;
  coverPhotoUrl?: string;
};

function getAllMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function extractCoverFields(data: any) {
  const obj =
    data?.cover && typeof data.cover === "object" && !Array.isArray(data.cover)
      ? data.cover
      : null;

  return {
    cover: asString(data?.cover) ?? asString(obj?.src),
    coverAlt: asString(data?.coverAlt) ?? asString(obj?.alt),
    coverAuthor: asString(data?.coverAuthor) ?? asString(obj?.authorName),
    coverAuthorUrl: asString(data?.coverAuthorUrl) ?? asString(obj?.authorUrl),
    coverPhotoUrl: asString(data?.coverPhotoUrl) ?? asString(obj?.photoUrl),
  } satisfies Pick<
    BlogPostMeta,
    "cover" | "coverAlt" | "coverAuthor" | "coverAuthorUrl" | "coverPhotoUrl"
  >;
}

function parseFrontmatterSafe(filename: string, source: string) {
  try {
    return matter(source);
  } catch (err) {
    console.error(`\n❌ Invalid frontmatter in: content/blog/${filename}`);
    console.error(
      "Tip: make sure the '---' block is properly closed, avoid TAB indentation, and wrap any text containing ':' in quotes.\n"
    );
    throw err;
  }
}

function toMeta(slug: string, data: any): BlogPostMeta {
  const covers = extractCoverFields(data);

  return {
    slug,
    title: String(data?.title ?? slug),
    description: String(data?.description ?? ""),
    date: String(data?.date ?? "1970-01-01"),
    tags: Array.isArray(data?.tags) ? data.tags.map(String) : [],
    ...covers,
  };
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const files = getAllMdxFiles();

  const posts: BlogPostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const fullPath = path.join(BLOG_DIR, filename);
    const source = fs.readFileSync(fullPath, "utf8");

    const { data } = parseFrontmatterSafe(filename, source);

    return toMeta(slug, data);
  });

  posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return posts;
}

export function getPostSlugs(): string[] {
  return getAllMdxFiles().map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: content/blog/${slug}.mdx`);
  }

  const source = fs.readFileSync(fullPath, "utf8");

  const { content, data } = parseFrontmatterSafe(`${slug}.mdx`, source);

  const meta = toMeta(slug, data);

  const mdx = await compileMDX({
  source: content,
  options: {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkBreaks],
    },
  },
  components: {
    Callout,
    Card,
    CardGrid,
  },
});

  return { meta, content: mdx.content };

}