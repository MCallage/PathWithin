"use client";

import { Link } from "next-view-transitions";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { loadProgress } from "@/lib/progress";

export function JourneyCTAClient({
  slug,
  isPublic,
}: {
  slug: string;
  isPublic: boolean;
}) {
  const { status } = useSession();
  const authed = status === "authenticated";
  const locked = !isPublic && !authed;
  const reduce = useReducedMotion();

  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    try {
      const p = loadProgress(slug);
      const hasAnyAnswers =
        !!p?.answersByStepId && Object.keys(p.answersByStepId).length > 0;
      const hasAnyCompleted =
        Array.isArray(p?.completedStepIds) && p.completedStepIds.length > 0;
      const hasCurrent = !!p?.currentStepId;

      setHasProgress(Boolean(hasCurrent || hasAnyCompleted || hasAnyAnswers));
    } catch {
      setHasProgress(false);
    }
  }, [slug]);

  if (locked) {
    return (
      <MotionConfig reducedMotion="user">
        <motion.button
          onClick={() =>
            signIn("github", { callbackUrl: `/journeys/${slug}/start` })
          }
          whileTap={reduce ? undefined : { scale: 0.98 }}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
        >
          Sign in to start
        </motion.button>
      </MotionConfig>
    );
  }

  return (
    <Link
      href={`/journeys/${slug}/start`}
      className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
    >
      {hasProgress ? "Continue from last step" : "Start journey"}
    </Link>
  );
}
