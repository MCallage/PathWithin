"use client";

import { Link, useTransitionRouter } from "next-view-transitions";
import { useMemo, useState, useEffect, useRef } from "react";
import type { Journey, JourneyStep } from "@/lib/journeys";
import {
  initProgress,
  loadProgress,
  saveProgress,
  markStepCompleted,
} from "@/lib/progress";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function StepContent({ content }: { content: string }) {
  const reduce = useReducedMotion();

  const blocks = content
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  };

  return (
    <motion.div
      className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted-foreground)]"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: reduce ? 0 : 0.05 }}
    >
      {blocks.map((block, idx) => {
        const lower = block.toLowerCase();
        const isMantra = lower.startsWith("mantra:");
        const isPractice =
          lower.startsWith("practice") ||
          lower.startsWith("try this") ||
          lower.startsWith("pick one") ||
          lower.startsWith("try") ||
          lower.startsWith("try “three good things”") ||
          lower.startsWith("try 'three good things'");

        if (isMantra) {
          const text = block.replace(/^mantra:\s*/i, "");
          return (
            <motion.div
              key={idx}
              variants={item}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
            >
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs">
                <span
                  className="h-2 w-2 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span className="text-[var(--accent)] font-medium">Mantra</span>
              </div>

              <p className="text-base font-medium leading-relaxed text-[var(--foreground)]">
                {text}
              </p>
            </motion.div>
          );
        }

        if (isPractice) {
          return (
            <motion.div
              key={idx}
              variants={item}
              className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Practice
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--muted-foreground)]">
                {block}
              </p>
            </motion.div>
          );
        }

        return (
          <motion.p key={idx} variants={item} className="whitespace-pre-line">
            {block}
          </motion.p>
        );
      })}
    </motion.div>
  );
}

export function JourneyStepClient({
  journey,
  step,
}: {
  journey: Journey;
  step: JourneyStep;
}) {
  const router = useTransitionRouter();
  const reduce = useReducedMotion();

  const index = useMemo(
    () => journey.steps.findIndex((s) => s.id === step.id),
    [journey.steps, step.id]
  );

  const prevStep = index > 0 ? journey.steps[index - 1] : null;
  const nextStep = journey.steps[index + 1] ?? null;
  const percent = Math.round(((index + 1) / journey.steps.length) * 100);

  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const didHydrate = useRef(false);
  const lastSavedText = useRef<string>("");

  function safeLoad() {
    try {
      return loadProgress(journey.slug);
    } catch {
      return null;
    }
  }

  function persist(nextText: string) {
    try {
      const existing = safeLoad();
      const base =
        existing ??
        initProgress(journey.slug, journey.steps[0]?.id ?? step.id);

      const completedStepIds = Array.isArray(base.completedStepIds)
        ? base.completedStepIds
        : [];

      const updated = {
        ...base,
        completedStepIds,
        currentStepId: step.id,
        updatedAt: new Date().toISOString(),
        answersByStepId: {
          ...(base.answersByStepId ?? {}),
          [step.id]: nextText,
        },
      };

      saveProgress(updated);

      setSavedAt(new Date().toLocaleString());
      setCompletedIds(updated.completedStepIds ?? []);
      lastSavedText.current = nextText;

      setSaveState("saved");
      return updated;
    } catch {
      setSaveState("error");
      return null;
    }
  }

  function navigateTo(stepId: string) {
    router.push(`/journeys/${journey.slug}/step/${stepId}`);
  }

  useEffect(() => {
    const existing = safeLoad();
    const base =
      existing ?? initProgress(journey.slug, journey.steps[0]?.id ?? step.id);

    const initialText = base.answersByStepId?.[step.id] ?? "";

    setText(initialText);
    setCompletedIds(base.completedStepIds ?? []);

    lastSavedText.current = initialText;
    didHydrate.current = true;
    setSaveState("idle");
  }, [journey.slug, step.id, journey.steps]);

  useEffect(() => {
    if (!didHydrate.current) return;
    if (text === lastSavedText.current) return;

    setSaveState("saving");
    const t = window.setTimeout(() => {
      persist(text);
    }, 1200);

    return () => window.clearTimeout(t);
  }, [text, journey.slug, step.id]);

  function onSave() {
    setSaveState("saving");
    return persist(text);
  }

  function onPrev() {
    if (!prevStep) return;
    onSave();
    navigateTo(prevStep.id);
  }

  function onNext() {
    if (!nextStep) return;

    const saved = onSave();
    if (!saved) return;

    const completed = markStepCompleted(saved, step.id);

    const moved = {
      ...completed,
      currentStepId: nextStep.id,
      updatedAt: new Date().toISOString(),
    };

    saveProgress(moved);
    setCompletedIds(moved.completedStepIds ?? []);
    navigateTo(nextStep.id);
  }

  function onMarkCompleted() {
    const saved = onSave();
    if (!saved) return;

    const completed = markStepCompleted(saved, step.id);
    saveProgress(completed);
    setCompletedIds(completed.completedStepIds ?? []);
  }

  const isCompleted = completedIds.includes(step.id);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          layout
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
          className="space-y-6 min-h-[60vh]"
        >
          <Link
            href={`/journeys/${journey.slug}`}
            className="text-sm text-[var(--muted-foreground)] hover:underline"
          >
            ← Back to {journey.title}
          </Link>

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-[var(--muted-foreground)]">
                Step {index + 1} of {journey.steps.length}
              </p>
              <p className="text-xs font-medium text-[var(--accent)]">
                {percent}%
              </p>
            </div>

            <div className="h-2 w-full rounded-full bg-[var(--secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[var(--accent)]"
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
              />
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isCompleted ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Completed
              </motion.div>
            ) : null}
          </AnimatePresence>

          <h1 className="mt-2 text-2xl font-semibold">{step.title}</h1>
          <StepContent content={step.content} />

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Journal prompts
              </p>
              <span className="text-xs text-[var(--accent)]">
                pick 2–3 to start
              </span>
            </div>

            <ul className="mt-3 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)] list-disc list-inside">
              {step.prompts.map((p) => (
                <li key={p} className="pl-2 marker:text-[var(--accent)]">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Your notes</label>
            <textarea
              className="mt-2 min-h-[180px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm outline-none focus:ring-2"
              placeholder="Write freely. You can be messy here."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {prevStep ? (
                <button
                  onClick={onPrev}
                  className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                >
                  ← Previous step
                </button>
              ) : (
                <span className="text-xs text-[var(--muted-foreground)]">
                  This is the first step
                </span>
              )}

              <button
                onClick={onSave}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
              >
                Save
              </button>

              {nextStep ? (
                <button
                  onClick={onNext}
                  className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                >
                  Next step →
                </button>
              ) : (
                <>
                  <button
                    onClick={onMarkCompleted}
                    className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                  >
                    Mark as completed ✓
                  </button>

                  <span className="text-sm text-[var(--muted-foreground)]">
                    You reached the last step ✨
                  </span>
                </>
              )}

              {savedAt ? (
                <span className="text-xs text-[var(--muted-foreground)]">
                  Saved: {savedAt}
                </span>
              ) : null}

              <AnimatePresence mode="wait" initial={false}>
                {saveState === "saving" ? (
                  <motion.span
                    key="saving"
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: reduce ? 0 : 0.15 }}
                    className="text-xs text-[var(--muted-foreground)]"
                  >
                    Saving…
                  </motion.span>
                ) : saveState === "saved" ? (
                  <motion.span
                    key="saved"
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: reduce ? 0 : 0.15 }}
                    className="text-xs text-[var(--muted-foreground)]"
                  >
                    Saved
                  </motion.span>
                ) : saveState === "error" ? (
                  <motion.span
                    key="error"
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: reduce ? 0 : 0.15 }}
                    className="text-xs text-red-500"
                  >
                    Couldn’t save
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
