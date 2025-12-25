"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getJourneyBySlug } from "@/lib/journeys";
import { initProgress, loadProgress, saveProgress } from "@/lib/progress";

type Phase =
  | "boot"
  | "checking"
  | "continuing"
  | "starting"
  | "no-storage"
  | "redirecting"
  | "error";

export function StartJourneyClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("boot");
  const [note, setNote] = useState<string>("Preparing your journey…");

  const journey = useMemo(() => getJourneyBySlug(slug), [slug]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setPhase("checking");
        setNote("Checking your progress…");

        if (!journey || journey.steps.length === 0) {
          router.replace("/journeys");
          return;
        }

        const firstStepId = journey.steps[0].id;

        let existing = null as ReturnType<typeof loadProgress>;

        try {
          existing = loadProgress(journey.slug);
        } catch {
          if (!cancelled) {
            setPhase("no-storage");
            setNote("Storage is unavailable. Starting without saving progress…");
          }
          
          router.replace(`/journeys/${journey.slug}/step/${firstStepId}`);
          return;
        }

        if (existing?.currentStepId) {
          setPhase("continuing");
          setNote("Continuing where you left off…");
          router.replace(`/journeys/${journey.slug}/step/${existing.currentStepId}`);
          return;
        }

        setPhase("starting");
        setNote("Starting your first step…");

        try {
          saveProgress(initProgress(journey.slug, firstStepId));
        } catch {
          if (!cancelled) {
            setPhase("no-storage");
            setNote("Storage is unavailable. Starting without saving progress…");
          }
          router.replace(`/journeys/${journey.slug}/step/${firstStepId}`);
          return;
        }

        setPhase("redirecting");
        router.replace(`/journeys/${journey.slug}/step/${firstStepId}`);
      } catch {
        if (!cancelled) {
          setPhase("error");
          setNote("Something went wrong. Returning to journeys…");
        }
        router.replace("/journeys");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [journey, router]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Loading your journey</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{note}</p>
          </div>

          <SparkleSpinner />
        </div>

        <ProgressSparkle phase={phase} />
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">
        Tip: if you’re on a restricted browser mode, your progress may not save. You can still complete the steps.
      </p>
    </div>
  );
}

function SparkleSpinner() {
  return (
    <div
      className="h-9 w-9 rounded-full border border-[var(--border)] bg-[var(--background)] p-1"
      aria-label="Loading"
    >
      <div className="h-full w-full animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
    </div>
  );
}

function ProgressSparkle({ phase }: { phase: Phase }) {
  const percent =
    phase === "boot" ? 10 :
    phase === "checking" ? 35 :
    phase === "continuing" ? 60 :
    phase === "starting" ? 60 :
    phase === "no-storage" ? 75 :
    phase === "redirecting" ? 90 :
    phase === "error" ? 100 :
    50;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">Preparing</span>
        <span className="text-xs text-[var(--muted-foreground)]">{percent}%</span>
      </div>

      <div className="relative h-3 rounded-full bg-[var(--secondary)] overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        
        <div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--accent-foreground)] opacity-70 transition-all duration-500"
          style={{ left: `calc(${percent}% - 6px)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
