"use client";

import * as React from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? undefined : { duration: 0.28, ease: "easeOut" }}
        className="my-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
      >
        {title ? <h3 className="m-0 text-base font-semibold">{title}</h3> : null}
        <div className={title ? "mt-3 text-sm text-[var(--muted-foreground)] leading-6" : "text-sm text-[var(--muted-foreground)] leading-6"}>
          {children}
        </div>
      </motion.section>
    </MotionConfig>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}
