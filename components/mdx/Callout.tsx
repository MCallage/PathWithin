"use client";

import * as React from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

type CalloutProps = {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
};

const styles: Record<NonNullable<CalloutProps["type"]>, string> = {
  note: "border-[var(--border)] bg-[var(--card)]",
  tip: "border-[var(--border)] bg-[var(--card)]",
  warning: "border-[var(--border)] bg-[var(--card)]",
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.aside
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? undefined : { duration: 0.25, ease: "easeOut" }}
        className={[
          "my-6 rounded-2xl border p-5",
          styles[type],
        ].join(" ")}
      >
        {title ? (
          <div className="mb-2 text-sm font-semibold">{title}</div>
        ) : null}
        <div className="text-sm text-[var(--muted-foreground)] leading-6">
          {children}
        </div>
      </motion.aside>
    </MotionConfig>
  );
}
