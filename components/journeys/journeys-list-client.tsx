"use client";

import { Link } from "next-view-transitions";
import { useSession } from "next-auth/react";
import type { Journey } from "@/lib/journeys";
import { isJourneyPublic } from "@/lib/journey-access";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export function JourneysListClient({ journeys }: { journeys: Journey[] }) {
  const router = useRouter();
  const { status } = useSession();
  const authed = status === "authenticated";
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } },
  };

  function goToLogin(callbackUrl: string) {
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="space-y-8"
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.header
          variants={item}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-24"
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              opacity-30
              blur-[1px]
            "
            style={{
              backgroundImage: "url(/journeyimage.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[var(--card)]/60"
          />

          <div className="relative z-10">
            <h1 className="text-3xl font-semibold">Journeys</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Choose a path. Some journeys are open, <br />
              others are for members.
            </p>
          </div>
        </motion.header>

        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={container}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {journeys.map((j) => {
            const isPublic = isJourneyPublic(j.slug);
            const locked = !isPublic && !authed;

            const journeyUrl = `/journeys/${j.slug}`;
            const loginCb = journeyUrl; // para voltar direto pra jornada após login

            return (
              <motion.div
                key={j.slug}
                variants={item}
                whileHover={reduce ? undefined : { y: -2 }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                {locked ? (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: reduce ? 0 : 1 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                  >
                    <motion.div
                      className="absolute inset-y-0 -left-1/2 w-[200%]"
                      style={{
                        background:
                          "linear-gradient(110deg, transparent 35%, rgba(0,0,0,0.05) 45%, rgba(255,255,255,0.35) 50%, rgba(0,0,0,0.05) 55%, transparent 65%)",
                      }}
                      initial={{ x: "-20%" }}
                      whileHover={{ x: "20%" }}
                      transition={{
                        duration: 0.9,
                        ease: EASE_IN_OUT,
                      }}
                    />
                    <div className="absolute inset-0 bg-[var(--background)] opacity-[0.02]" />
                  </motion.div>
                ) : null}

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{j.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {j.subtitle}
                    </p>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {!isPublic ? (
                      <motion.span
                        key="members"
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{
                          duration: reduce ? 0 : 0.16,
                          ease: EASE_OUT,
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs"
                      >
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                        Members only
                      </motion.span>
                    ) : (
                      <motion.span
                        key="public"
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{
                          duration: reduce ? 0 : 0.16,
                          ease: EASE_OUT,
                        }}
                        className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]"
                      >
                        Public
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <p className="relative mt-4 text-sm text-[var(--muted-foreground)]">
                  {j.description}
                </p>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  {j.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs text-[var(--secondary-foreground)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 flex flex-wrap gap-3">
                  <AnimatePresence mode="wait" initial={false}>
                    {locked ? (
                      <motion.button
                        key="signin"
                        type="button"
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: EASE_OUT,
                        }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        onClick={() => goToLogin(loginCb)}
                        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
                      >
                        Sign in to start
                      </motion.button>
                    ) : (
                      <motion.div
                        key="view"
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: EASE_OUT,
                        }}
                      >
                        <Link
                          href={journeyUrl}
                          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
                        >
                          View journey
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Link
                    href={journeyUrl}
                    className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
                  >
                    Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
