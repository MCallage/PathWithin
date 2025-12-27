"use client";

import * as React from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

export function ArticleProse({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? undefined : { duration: 0.35, ease: "easeOut" }}
        className={[
          "prose prose-neutral dark:prose-invert max-w-none",
          "prose-p:my-5 prose-p:leading-7",
          "prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24",
          "prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-24",
          "prose-ul:my-5 prose-ol:my-5 prose-li:my-1",
          "prose-hr:my-10",
          "prose-hr:border-0 prose-hr:h-px",
          "prose-hr:bg-[var(--border)] prose-hr:opacity-60",
          "prose-blockquote:my-6 prose-blockquote:border-l-[3px] prose-blockquote:border-[var(--border)]",
          "prose-blockquote:pl-4 prose-blockquote:text-[var(--muted-foreground)]",
          "prose-a:underline prose-a:decoration-[var(--border)] prose-a:underline-offset-4",
          "prose-a:hover:opacity-80",
          "prose-strong:text-[var(--foreground)]",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-ul:pl-6 prose-ol:pl-6",
          "prose-li:my-1",
          "prose-li:marker:text-[var(--muted-foreground)]",
        ].join(" ")}
      >
        {children}
      </motion.article>
    </MotionConfig>
  );
}
