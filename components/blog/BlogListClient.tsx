"use client";

import Image from "next/image";
import * as React from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import type { BlogPostMeta } from "@/lib/blog";

const MotionLink = motion.create(Link);

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

function normalizeText(s: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Soft pastel colors derived from tag hash (stable per tag)
function tagColors(tag: string) {
  const h = hashString(tag) % 360;
  const bg = `hsla(${h}, 70%, 92%, 0.85)`;
  const border = `hsla(${h}, 55%, 70%, 0.9)`;
  return { bg, border };
}

// Pulls `tag:xxx` tokens out of the raw query and returns { query, tags }
function extractTagTokens(raw: string) {
  const tokens = (raw ?? "").split(/\s+/).filter(Boolean);
  const tags: string[] = [];
  const rest: string[] = [];

  for (const t of tokens) {
    const m = /^tag:(.+)$/i.exec(t);
    if (m?.[1]) tags.push(m[1]);
    else rest.push(t);
  }

  return { query: rest.join(" "), tags };
}

export function BlogListClient({ posts }: { posts: BlogPostMeta[] }) {
  const reduceMotion = useReducedMotion();

  // Text query (no tag tokens, those become chips)
  const [q, setQ] = React.useState("");

  // Selected tag filters (chips)
  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  // Used to force-remount the input on clear (prevents ghost filters)
  const [inputResetKey, setInputResetKey] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const allTags = React.useMemo(() => {
    const tags = posts
      .flatMap((p) => p.tags ?? [])
      .map((t) => (t ?? "").trim())
      .filter(Boolean);

    return uniqSorted(tags);
  }, [posts]);

  const allTagsNormSet = React.useMemo(() => {
    return new Set(allTags.map((t) => normalizeText(t)));
  }, [allTags]);

  const canonicalTagByNorm = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const t of allTags) m.set(normalizeText(t), t);
    return m;
  }, [allTags]);

  function addTag(tag: string) {
    const raw = (tag ?? "").trim();
    if (!raw) return;

    const norm = normalizeText(raw);
    const canonical = canonicalTagByNorm.get(norm) ?? raw;

    setActiveTags((prev) => {
      const prevNorm = new Set(prev.map((x) => normalizeText(x)));
      if (prevNorm.has(norm)) return prev;
      return [...prev, canonical];
    });
  }

  function removeTag(tag: string) {
    const norm = normalizeText(tag);
    setActiveTags((prev) => prev.filter((t) => normalizeText(t) !== norm));
  }

  function toggleTag(tag: string) {
    const raw = (tag ?? "").trim();
    if (!raw) return;

    const norm = normalizeText(raw);

    setActiveTags((prev) => {
      const prevNorm = new Set(prev.map((x) => normalizeText(x)));
      if (prevNorm.has(norm)) return prev.filter((t) => normalizeText(t) !== norm);

      const canonical = canonicalTagByNorm.get(norm) ?? raw;
      return [...prev, canonical];
    });
  }

  function clearAll() {
    setQ("");
    setActiveTags([]);

    // Force-remount the input to kill any pending composition / stale DOM value
    setInputResetKey((k) => k + 1);

    requestAnimationFrame(() => inputRef.current?.focus());
  }

  // If tags in content change (renamed/removed), drop invalid active tags
  React.useEffect(() => {
    setActiveTags((prev) =>
      prev.filter((t) => allTagsNormSet.has(normalizeText(t)))
    );
  }, [allTagsNormSet]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const isCmdK = (e.metaKey || e.ctrlKey) && isK;

      if (isCmdK) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (e.key === "Escape") {
        const active = document.activeElement;
        const focusedOnSearch = active === inputRef.current;

        if (q || activeTags.length) {
          e.preventDefault();
          clearAll();
          if (focusedOnSearch) inputRef.current?.blur();
          return;
        }

        if (focusedOnSearch) {
          e.preventDefault();
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [q, activeTags.length]);

  function handleSearchChange(value: string) {
    const { query, tags } = extractTagTokens(value);

    if (tags.length) {
      for (const t of tags) {
        const norm = normalizeText(t);
        if (allTagsNormSet.has(norm)) addTag(t);
      }
    }

    setQ((query ?? "").trim());
  }

  const activeTagsNorm = React.useMemo(() => {
    return new Set(activeTags.map((t) => normalizeText(t)));
  }, [activeTags]);

  const isFiltering = (q ?? "").trim().length > 0 || activeTags.length > 0;

  const filtered = React.useMemo(() => {
    if (!isFiltering) return posts;

    const query = normalizeText(q);

    return posts.filter((p) => {
      const textHay = normalizeText(
        [p.title, p.description, (p.tags ?? []).join(" ")].join(" ")
      );

      const matchesText = !query || textHay.includes(query);

      const postTagsNorm = new Set((p.tags ?? []).map((t) => normalizeText(t)));

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((t) => postTagsNorm.has(normalizeText(t)));

      return matchesText && matchesTags;
    });
  }, [posts, q, activeTags, isFiltering]);

  const filtersKey = React.useMemo(() => {
    const qKey = normalizeText(q);
    const tagsKey = activeTags.map(normalizeText).sort().join("|");
    return `${qKey}__${tagsKey}`;
  }, [q, activeTags]);

  const container = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? {}
        : { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 },
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="mb-6">
        <div
          className="
            rounded-2xl border border-[var(--border)] bg-[var(--card)]
            px-3 py-2
            focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2
            focus-within:ring-offset-[var(--background)]
          "
          onClick={() => inputRef.current?.focus()}
          role="search"
          aria-label="Blog search"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)]">
              <FiSearch
                aria-hidden="true"
                size={16}
                className="text-[var(--muted-foreground)]"
              />
            </span>

            {activeTags.map((t) => {
              const { bg, border } = tagColors(t);
              return (
                <span
                  key={normalizeText(t)}
                  style={{ backgroundColor: bg, borderColor: border }}
                  className="
                    inline-flex items-center gap-2
                    rounded-full border
                    px-3 py-1 text-xs
                  "
                >
                  <span className="text-[var(--muted-foreground)]">tag:</span>
                  <span className="text-[var(--foreground)]">{t}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(t);
                    }}
                    aria-label={`Remove tag ${t}`}
                    className="
                      inline-flex h-6 w-6 items-center justify-center rounded-full
                      hover:opacity-80 transition-opacity
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                      focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                    "
                  >
                    <FiX size={12} />
                  </button>
                </span>
              );
            })}

            <input
              key={inputResetKey}
              ref={inputRef}
              value={q}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && q.length === 0 && activeTags.length) {
                  removeTag(activeTags[activeTags.length - 1]);
                }
              }}
              placeholder="Search articles… (Ctrl+K / ⌘K). Try tag:anxiety"
              aria-label="Search blog posts"
              className="
                min-w-[180px] flex-1 bg-transparent px-2 py-2 text-sm
                outline-none
              "
            />

            {q || activeTags.length ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                aria-label="Clear filters"
                className="
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-full border border-[var(--border)]
                  bg-[var(--background)]
                  hover:opacity-80 transition-opacity
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                "
                title="Clear (Esc)"
              >
                <FiX size={16} />
              </button>
            ) : null}
          </div>
        </div>

        {allTags.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.map((t) => {
              const active = activeTagsNorm.has(normalizeText(t));
              const { bg, border } = tagColors(t);

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  style={active ? { backgroundColor: bg, borderColor: border } : undefined}
                  className={[
                    "rounded-full border px-3 py-1 text-xs",
                    "transition-opacity hover:opacity-90",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]",
                    active
                      ? "text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]",
                  ].join(" ")}
                  aria-pressed={active}
                  title={active ? "Tag selected (click to remove)" : "Click to filter by tag"}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--muted-foreground)]">
          <span>
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            {q || activeTags.length ? " found" : ""}
          </span>

          {q || activeTags.length ? (
            <span className="truncate">
              {q ? (
                <>
                  Query: <span className="text-[var(--foreground)]">{q}</span>
                </>
              ) : null}
              {q && activeTags.length ? <span> · </span> : null}
              {activeTags.length ? (
                <>
                  Tags:{" "}
                  <span className="text-[var(--foreground)]">
                    {activeTags.join(", ")}
                  </span>
                </>
              ) : null}
            </span>
          ) : (
            <span className="truncate">Press Ctrl+K / ⌘K to search. Esc clears filters.</span>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          key={`empty_${filtersKey}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <p className="text-[var(--muted-foreground)]">
            No posts found. Try another keyword or clear filters.
          </p>

          {q || activeTags.length ? (
            <button
              type="button"
              onClick={clearAll}
              className="
                mt-4 inline-flex items-center justify-center
                rounded-xl border px-4 py-2 text-sm font-medium
                border-[var(--border)] bg-[var(--background)]
                hover:opacity-80 transition-opacity
                min-h-[44px]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
              "
            >
              Clear filters
            </button>
          ) : null}
        </motion.div>
      ) : (
        <motion.div
          key={`grid_${filtersKey}`}
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((p) => (
            <motion.div key={p.slug} variants={item}>
              <MotionLink
                href={`/blog/${p.slug}`}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { y: 0 }}
                className="
                  group block rounded-2xl border border-[var(--border)] bg-[var(--card)]
                  p-5 transition-opacity hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                "
              >
                {p.cover ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={p.cover}
                        alt={p.coverAlt ?? p.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>

                    {p.coverAuthor && p.coverAuthorUrl && p.coverPhotoUrl ? (
                      <div className="px-3 py-2 text-[11px] text-[var(--muted-foreground)]">
                        Photo by{" "}
                        <a
                          href={p.coverAuthorUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:opacity-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.coverAuthor}
                        </a>{" "}
                        on{" "}
                        <a
                          href={p.coverPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:opacity-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Unsplash
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug">{p.title}</h2>
                  <span className="shrink-0 text-xs text-[var(--muted-foreground)] pt-1">
                    {formatDate(p.date)}
                  </span>
                </div>

                {p.description ? (
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    {p.description}
                  </p>
                ) : null}

                {p.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((t) => {
                      const { bg, border } = tagColors(t);
                      return (
                        <button
                          key={`${p.slug}-${t}`}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(t);
                          }}
                          style={{ backgroundColor: bg, borderColor: border }}
                          className="
                            rounded-full border px-3 py-1 text-xs
                            text-[var(--foreground)]
                            hover:opacity-90 transition-opacity
                          "
                          title="Filter by tag"
                        >
                          {t}
                        </button>
                      );
                    })}

                    {p.tags.length > 4 ? (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        +{p.tags.length - 4}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </MotionLink>
            </motion.div>
          ))}
        </motion.div>
      )}
    </MotionConfig>
  );
}
