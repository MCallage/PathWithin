"use client";

import { Journey } from "@/lib/journeys";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

export function JourneyCard({ journey }: { journey: Journey }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:opacity-90"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{journey.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {journey.subtitle}
            </p>
          </div>

          {journey.estimatedDays ? (
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
              {journey.estimatedDays} days
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {journey.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {journey.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs text-[var(--secondary-foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </MotionConfig>
  );
}
