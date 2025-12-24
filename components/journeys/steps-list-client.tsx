"use client";

import { Link } from "next-view-transitions";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { Journey } from "@/lib/journeys";
import { initProgress, loadProgress } from "@/lib/progress";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";

export function StepsListClient({ journey }: { journey: Journey }) {
  const reduce = useReducedMotion();

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  const total = journey.steps.length;

  const percent = useMemo(() => {
    const completed = completedIds.length;
    if (!total) return 0;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [completedIds.length, total]);

  const safeLoad = useCallback(() => {
    try {
      const existing = loadProgress(journey.slug);
      return (
        existing ?? initProgress(journey.slug, journey.steps[0]?.id ?? "1")
      );
    } catch {
      return null;
    }
  }, [journey.slug, journey.steps]);

  const refreshProgress = useCallback(() => {
    const base = safeLoad();
    if (!base) {
      setCompletedIds([]);
      setCurrentStepId(null);
      return;
    }
    setCompletedIds(base.completedStepIds ?? []);
    setCurrentStepId(base.currentStepId ?? null);
  }, [safeLoad]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  // Refresh when returning to the tab/window (helps avoid stale UI)
  useEffect(() => {
    const onFocus = () => refreshProgress();
    const onVis = () => {
      if (document.visibilityState === "visible") refreshProgress();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refreshProgress]);

  const currentIndex = useMemo(() => {
    if (!currentStepId) return -1;
    return journey.steps.findIndex((s) => s.id === currentStepId);
  }, [currentStepId, journey.steps]);

  const currentTitle = useMemo(() => {
    if (currentIndex < 0) return null;
    return journey.steps[currentIndex]?.title ?? null;
  }, [currentIndex, journey.steps]);

  const container = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.03 },
    },
  };

  const fadeUp = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="mt-4"
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        {/* Mini progress */}
        <motion.div
          variants={fadeUp}
          className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Progress</p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={percent}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: reduce ? 0 : 0.14, ease: "easeOut" }}
                className="text-xs font-medium text-[var(--accent)]"
              >
                {percent}%
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-[var(--secondary)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--accent)]"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
            />
          </div>

          <AnimatePresence initial={false}>
            {currentStepId ? (
              <motion.p
                key={currentStepId}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.16, ease: "easeOut" }}
                className="mt-2 text-xs text-[var(--muted-foreground)]"
              >
                Current:{" "}
                <span className="text-[var(--foreground)] font-medium">
                  Step {Math.max(1, currentIndex + 1)} of {total}
                </span>
                {currentTitle ? (
                  <>
                    {" "}
                    · <span className="text-[var(--muted-foreground)]">{currentTitle}</span>
                  </>
                ) : null}
              </motion.p>
            ) : (
              <motion.p
                key="no-progress"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.16, ease: "easeOut" }}
                className="mt-2 text-xs text-[var(--muted-foreground)]"
              >
                No progress yet.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Steps */}
        <motion.div className="grid gap-3" variants={container}>
          {journey.steps.map((s, idx) => {
            const done = completedIds.includes(s.id);
            const isCurrent = currentStepId === s.id;

            return (
              <motion.div
                key={s.id}
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -2 }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              >
                <Link
                  href={`/journeys/${journey.slug}/step/${s.id}`}
                  className={[
                    "block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:opacity-90",
                    isCurrent ? "ring-2 ring-[var(--ring)]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {idx + 1}. {s.title}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <AnimatePresence mode="wait" initial={false}>
                          {done ? (
                            <motion.span
                              key="done"
                              initial={reduce ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                              transition={{
                                duration: reduce ? 0 : 0.14,
                                ease: "easeOut",
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs"
                            >
                              <span className="text-[var(--accent)] font-semibold">
                                ✓
                              </span>
                              Completed
                            </motion.span>
                          ) : (
                            <motion.span
                              key="not"
                              initial={reduce ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                              transition={{
                                duration: reduce ? 0 : 0.14,
                                ease: "easeOut",
                              }}
                              className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]"
                            >
                              Not completed
                            </motion.span>
                          )}
                        </AnimatePresence>

                        <AnimatePresence initial={false}>
                          {isCurrent ? (
                            <motion.span
                              key="current"
                              initial={reduce ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                              transition={{
                                duration: reduce ? 0 : 0.14,
                                ease: "easeOut",
                              }}
                              className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--accent)]"
                            >
                              Current
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>

                    {s.readingTimeMin ? (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        ~{s.readingTimeMin} min
                      </span>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
