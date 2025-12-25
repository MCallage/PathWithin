"use client";

import { Link } from "next-view-transitions";
import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { getJourneys, getJourneyBySlug, type Journey } from "@/lib/journeys";
import {
  canUseStorage,
  initProgress,
  loadProgress,
  saveProgress,
} from "@/lib/progress";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type ContinueItem = {
  slug: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  currentStepId: string;
  currentStepIndex: number;
  totalSteps: number;
  percent: number;
};

type RecentNote = {
  slug: string;
  journeyTitle: string;
  stepId: string;
  stepTitle: string;
  preview: string;
};

type JourneyStatus = "not_started" | "in_progress" | "completed";

type JourneyRow = {
  slug: string;
  title: string;
  subtitle: string;
  status: JourneyStatus;
  percent: number;
  totalSteps: number;

  updatedAt?: string;
  currentStepId?: string;
  currentStepIndex?: number;

  lastCompletedStepId?: string;
  lastCompletedStepIndex?: number;
  lastCompletedStepTitle?: string;
};

type Summary = {
  totalProgress: number;
  activeCount: number;
  completedCount: number;
  updatedThisWeek: number;
  daysSinceLastActivity: number | null;
};

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function clampPreview(text: string, max = 160) {
  const t = (text ?? "").trim().replace(/\s+/g, " ");
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function statusLabel(s: JourneyStatus) {
  if (s === "completed") return "Completed";
  if (s === "in_progress") return "In progress";
  return "Not started";
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diffDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function DashboardSessionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 rounded bg-[var(--secondary)]" />
          <div className="h-4 w-72 rounded bg-[var(--secondary)]" />
          <div className="h-10 w-28 rounded bg-[var(--secondary)]" />
        </div>
      </div>
    </div>
  );
}

function DashboardHydrationSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-8 w-44 rounded bg-[var(--secondary)] animate-pulse" />
        <div className="h-4 w-96 rounded bg-[var(--secondary)] animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="h-3 w-24 rounded bg-[var(--secondary)] animate-pulse" />
            <div className="mt-3 h-7 w-16 rounded bg-[var(--secondary)] animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="h-4 w-28 rounded bg-[var(--secondary)] animate-pulse" />
        <div className="mt-3 h-4 w-80 rounded bg-[var(--secondary)] animate-pulse" />
        <div className="mt-6 h-2 w-full rounded bg-[var(--secondary)] animate-pulse" />
      </div>
    </div>
  );
}

export function DashboardClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <DashboardSessionSkeleton />;

  if (status === "unauthenticated") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-lg font-semibold">Session expired</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Please log in again to access your dashboard.
          </p>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
          >
            Login
          </button>

          <Link
            href="/journeys"
            className="mt-3 block text-sm text-[var(--accent)] hover:underline"
          >
            Browse journeys instead
          </Link>
        </div>
      </div>
    );
  }

  return <DashboardInner session={session} />;
}

function DashboardInner({ session }: { session: any }) {
  const journeys = useMemo(() => getJourneys(), []);

  const [hydrated, setHydrated] = useState(false);

  const [continueItem, setContinueItem] = useState<ContinueItem | null>(null);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  const [journeyRows, setJourneyRows] = useState<JourneyRow[]>([]);
  const [recents, setRecents] = useState<JourneyRow[]>([]);

  const [summary, setSummary] = useState<Summary>({
    totalProgress: 0,
    activeCount: 0,
    completedCount: 0,
    updatedThisWeek: 0,
    daysSinceLastActivity: null,
  });

  const reduce = useReducedMotion();

  const percentMV = useMotionValue(0);
  const percentSpring = useSpring(percentMV, { stiffness: 220, damping: 30 });
  const percentWidth = useTransform(percentSpring, (v) => `${Math.round(v)}%`);
  const [percentDisplay, setPercentDisplay] = useState(0);

  useEffect(() => {
    const unsub = percentSpring.on("change", (v) =>
      setPercentDisplay(Math.round(v))
    );
    return () => unsub();
  }, [percentSpring]);

  useEffect(() => {
    percentMV.set(continueItem?.percent ?? 0);
  }, [continueItem?.percent, percentMV]);

  function computeRow(
    journey: Journey,
    prog: ReturnType<typeof loadProgress> | null
  ): JourneyRow {
    const totalSteps = journey.steps.length || 1;

    if (!prog) {
      return {
        slug: journey.slug,
        title: journey.title,
        subtitle: journey.subtitle,
        status: "not_started",
        percent: 0,
        totalSteps,
      };
    }

    const currentIdx = Math.max(
      0,
      journey.steps.findIndex((s) => s.id === prog.currentStepId)
    );

    const completedIds = Array.isArray(prog.completedStepIds)
      ? prog.completedStepIds
      : [];
    const completedCount = completedIds.length;

    let lastCompletedStepIndex: number | undefined = undefined;
    let lastCompletedStepId: string | undefined = undefined;
    let lastCompletedStepTitle: string | undefined = undefined;

    if (completedCount > 0) {
      const indices = completedIds
        .map((id) => journey.steps.findIndex((s) => s.id === id))
        .filter((i) => i >= 0);

      if (indices.length) {
        const maxIdx = Math.max(...indices);
        lastCompletedStepIndex = maxIdx;
        lastCompletedStepId = journey.steps[maxIdx]?.id;
        lastCompletedStepTitle = journey.steps[maxIdx]?.title;
      }
    }

    const pctFromCompleted =
      totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    const pctFromCurrent =
      totalSteps > 0 ? Math.round(((currentIdx + 1) / totalSteps) * 100) : 0;

    const percent = Math.min(100, Math.max(pctFromCompleted, pctFromCurrent));

    const hasAnyAnswers =
      !!prog.answersByStepId && Object.keys(prog.answersByStepId).length > 0;

    const hasAnyProgress =
      !!prog.currentStepId || completedCount > 0 || hasAnyAnswers;

    const isCompleted = completedCount >= totalSteps || percent >= 100;

    const status: JourneyStatus = isCompleted
      ? "completed"
      : hasAnyProgress
      ? "in_progress"
      : "not_started";

    return {
      slug: journey.slug,
      title: journey.title,
      subtitle: journey.subtitle,
      status,
      percent,
      totalSteps,
      updatedAt: prog.updatedAt,
      currentStepId: prog.currentStepId,
      currentStepIndex: currentIdx,
      lastCompletedStepId,
      lastCompletedStepIndex,
      lastCompletedStepTitle,
    };
  }

  function recompute() {
    let best: ContinueItem | null = null;
    const notes: RecentNote[] = [];
    const rows: JourneyRow[] = [];

    let lastActivityTs: number | null = null;
    let updatedThisWeek = 0;

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    for (const j of journeys) {
      const prog = loadProgress(j.slug);
      const journey = getJourneyBySlug(j.slug) ?? j;
      if (!journey) continue;

      const row = computeRow(journey, prog);
      rows.push(row);

      if (row.updatedAt) {
        const t = new Date(row.updatedAt).getTime();
        if (!Number.isNaN(t)) {
          if (lastActivityTs === null || t > lastActivityTs) lastActivityTs = t;
          if (new Date(row.updatedAt) >= weekAgo) updatedThisWeek += 1;
        }
      }

      if (!prog) continue;

      if (prog.currentStepId && prog.updatedAt) {
        const totalSteps = journey.steps.length || 1;
        const currentStepIndex = Math.max(
          0,
          journey.steps.findIndex((s) => s.id === prog.currentStepId)
        );

        const percent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

        const item: ContinueItem = {
          slug: journey.slug,
          title: journey.title,
          subtitle: journey.subtitle,
          updatedAt: prog.updatedAt,
          currentStepId: prog.currentStepId,
          currentStepIndex,
          totalSteps,
          percent,
        };

        if (
          !best ||
          new Date(item.updatedAt).getTime() > new Date(best.updatedAt).getTime()
        ) {
          best = item;
        }
      }

      for (const step of journey.steps) {
        const ans = prog.answersByStepId?.[step.id] ?? "";
        const preview = clampPreview(ans);
        if (!preview) continue;

        notes.push({
          slug: journey.slug,
          journeyTitle: journey.title,
          stepId: step.id,
          stepTitle: step.title,
          preview,
        });
      }
    }

    rows.sort((a, b) => {
      const rank = (s: JourneyStatus) =>
        s === "in_progress" ? 0 : s === "not_started" ? 1 : 2;
      const ra = rank(a.status);
      const rb = rank(b.status);
      if (ra !== rb) return ra - rb;

      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    });

    const recentRows = rows
      .filter((r) => !!r.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      )
      .slice(0, 4);

    notes.sort((a, b) => {
      if (best) {
        const aBoost = a.slug === best.slug ? 1 : 0;
        const bBoost = b.slug === best.slug ? 1 : 0;
        if (aBoost !== bBoost) return bBoost - aBoost;
      }
      const an = Number(a.stepId);
      const bn = Number(b.stepId);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
      return b.stepId.localeCompare(a.stepId);
    });

    const activeCount = rows.filter((r) => r.status === "in_progress").length;
    const completedCount = rows.filter((r) => r.status === "completed").length;

    const totalProgress = rows.length
      ? Math.round(
          rows.reduce((acc, r) => acc + (r.percent ?? 0), 0) / rows.length
        )
      : 0;

    const daysSinceLastActivity =
      lastActivityTs === null
        ? null
        : diffDays(new Date(), new Date(lastActivityTs));

    setSummary({
      totalProgress,
      activeCount,
      completedCount,
      updatedThisWeek,
      daysSinceLastActivity,
    });

    setContinueItem(best);
    setRecentNotes(notes.slice(0, 6));
    setJourneyRows(rows);
    setRecents(recentRows);
  }

  useEffect(() => {
    setHydrated(true);
    setStorageOk(canUseStorage());
    recompute();
  }, []);

  useEffect(() => {
    const onFocus = () => recompute();
    const onVis = () => {
      if (document.visibilityState === "visible") recompute();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function resetProgress(slug: string) {
    const j = getJourneyBySlug(slug);
    if (!j?.steps?.length) return;

    const ok = window.confirm(
      "Reset progress for this journey?\n\nThis will clear your saved answers and set you back to Step 1."
    );
    if (!ok) return;

    const fresh = initProgress(slug, j.steps[0].id);
    const res = saveProgress(fresh);

    setStorageOk(res.ok);
    recompute();
  }

  const name =
    (session?.user?.name?.split(" ")[0] || session?.user?.name) ?? "there";

  const container = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const fadeUp = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  };

  const hoverLift = reduce ? undefined : { y: -2 };

  return (
    <MotionConfig reducedMotion="user">
      {!hydrated ? (
        <DashboardHydrationSkeleton />
      ) : (
        <motion.div
          className="space-y-8"
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.header variants={fadeUp}>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Welcome back,{" "}
              <span className="text-[var(--foreground)]">{name}</span>. Continue
              your journey and revisit your notes.
            </p>

            {!storageOk ? (
              <motion.div
                variants={fadeUp}
                className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm"
              >
                <p className="font-medium text-[var(--foreground)]">
                  Storage is unavailable
                </p>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Your browser is blocking local storage (private mode,
                  restrictions, etc.). You can still read steps, but saving may
                  fail.
                </p>
              </motion.div>
            ) : null}
          </motion.header>

          <motion.section variants={fadeUp} className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)]">
                Total progress
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {summary.totalProgress}%
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)]">
                Active journeys
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {summary.activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)]">Completed</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {summary.completedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)]">
                Weekly consistency
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {summary.updatedThisWeek}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                journeys updated in the last 7 days
                {summary.daysSinceLastActivity !== null ? (
                  <>
                    {" "}
                    · last activity{" "}
                    {summary.daysSinceLastActivity === 0
                      ? "today"
                      : `${summary.daysSinceLastActivity}d ago`}
                  </>
                ) : null}
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recents</h2>
              <Link
                href="/journeys"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                View all
              </Link>
            </div>

            {recents.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted-foreground)]">
                No recent activity yet.
              </div>
            ) : (
              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                variants={container}
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {recents.map((r) => (
                  <motion.div
                    key={r.slug}
                    variants={fadeUp}
                    whileHover={hoverLift}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{r.title}</p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {r.subtitle}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                        {statusLabel(r.status)}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1">
                      {r.updatedAt ? (
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Last updated: {formatDate(r.updatedAt)}
                        </p>
                      ) : null}

                      {typeof r.lastCompletedStepIndex === "number" &&
                      r.lastCompletedStepTitle ? (
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Last completed: Step {r.lastCompletedStepIndex + 1} ·{" "}
                          {r.lastCompletedStepTitle}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Last completed: —
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/journeys/${r.slug}/start`}
                        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
                      >
                        {r.status === "not_started" ? "Start" : "Continue"}
                      </Link>

                      <button
                        onClick={() => resetProgress(r.slug)}
                        className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                        disabled={!storageOk}
                        title={storageOk ? "Reset progress" : "Storage is unavailable"}
                      >
                        Reset
                      </button>

                      <Link
                        href={`/journeys/${r.slug}`}
                        className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                      >
                        Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>

          <motion.section
            variants={fadeUp}
            whileHover={hoverLift}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Continue</p>

                <AnimatePresence mode="wait" initial={false}>
                  {continueItem ? (
                    <motion.div
                      key="has-continue"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
                    >
                      <h2 className="mt-2 text-xl font-semibold">
                        {continueItem.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {continueItem.subtitle}
                      </p>
                      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                        Last updated: {formatDate(continueItem.updatedAt)}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="no-continue"
                      className="mt-2 text-sm text-[var(--muted-foreground)]"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
                    >
                      No saved progress yet. Pick a journey to begin.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="wait" initial={false}>
                  {continueItem ? (
                    <motion.div
                      key="continue-buttons"
                      className="flex flex-wrap gap-3"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
                    >
                      <Link
                        href={`/journeys/${continueItem.slug}/start`}
                        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
                      >
                        Continue
                      </Link>

                      <motion.button
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 550, damping: 34 }}
                        onClick={() => resetProgress(continueItem.slug)}
                        className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                        disabled={!storageOk}
                        title={storageOk ? "Reset progress" : "Storage is unavailable"}
                      >
                        Reset
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="browse-button"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
                    >
                      <Link
                        href="/journeys"
                        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
                      >
                        Browse journeys
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {continueItem ? (
                <motion.div
                  key="progress"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
                  className="mt-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Step {continueItem.currentStepIndex + 1} of{" "}
                      {continueItem.totalSteps}
                    </p>
                    <p className="text-xs font-medium text-[var(--accent)]">
                      {percentDisplay}%
                    </p>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: percentWidth }}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>

          <motion.section variants={fadeUp} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent notes</h2>
              <Link
                href="/journeys"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                View journeys
              </Link>
            </div>

            {recentNotes.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted-foreground)]">
                Your saved notes will appear here once you start writing.
              </div>
            ) : (
              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                variants={container}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                {recentNotes.map((n) => (
                  <motion.div
                    key={`${n.slug}-${n.stepId}`}
                    variants={fadeUp}
                    whileHover={hoverLift}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  >
                    <Link
                      href={`/journeys/${n.slug}/step/${n.stepId}`}
                      className="block"
                    >
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:opacity-90">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{n.journeyTitle}</p>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                              Step {n.stepId}: {n.stepTitle}
                            </p>
                          </div>

                          <span className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--accent)]">
                            Open
                          </span>
                        </div>

                        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                          {n.preview}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>

          <motion.section
            variants={fadeUp}
            whileHover={hoverLift}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <h2 className="text-lg font-semibold">Quick actions</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/journeys"
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
              >
                Browse journeys
              </Link>

              {journeys.slice(0, 3).map((j: Journey) => (
                <Link
                  key={j.slug}
                  href={`/journeys/${j.slug}`}
                  className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                >
                  {j.title}
                </Link>
              ))}
            </div>
          </motion.section>
        </motion.div>
      )}
    </MotionConfig>
  );
}
