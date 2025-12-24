"use client";

import { Link, useTransitionRouter } from "next-view-transitions";
import { useSession, signIn } from "next-auth/react";
import { FiLock } from "react-icons/fi";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";

type PathCardProps = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

function PathCard({ title, description, href, cta = "Start path" }: PathCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className="
            inline-flex w-full justify-center sm:w-auto
            rounded-full border px-5 py-2.5 text-sm font-semibold
            border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]
            transition-transform duration-200
            hover:opacity-90 hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}

function LockedCard({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <motion.div
              aria-hidden="true"
              className="
                inline-flex h-10 w-10 items-center justify-center
                rounded-xl border border-[var(--border)]
                bg-[var(--background)] text-[var(--foreground)]
              "
              whileHover={reduce ? undefined : { scale: 1.04, rotate: -2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <FiLock size={18} />
            </motion.div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onClick}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 550, damping: 34 }}
          className="
            inline-flex w-full justify-center sm:w-auto
            rounded-full px-5 py-2.5 text-sm font-semibold
            bg-[var(--accent)] text-[var(--accent-foreground)]
            hover:opacity-90 transition-opacity
          "
        >
          {buttonLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function AvailablePaths() {
  const router = useTransitionRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const reduce = useReducedMotion();

  async function handleUnlock() {
    if (!isLoggedIn) {
      await signIn("github", { callbackUrl: "/dashboard" });
      return;
    }
    router.push("/dashboard");
  }

  const container = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="mx-auto max-w-5xl px-6"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-semibold text-[var(--foreground)]"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
        >
          Available paths
        </motion.h2>

        <motion.div
          className="mt-5 grid gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={item}>
            <PathCard
              title="Emotional Reset"
              description="A gentle journey to reorganize feelings and begin again."
              href="/journeys/emotional-reset"
            />
          </motion.div>

          <motion.div variants={item}>
            <LockedCard
              title="More paths inside"
              description="Log in to access your full library, tracking, and saved progress."
              buttonLabel={isLoggedIn ? "Go to dashboard" : "Log in to unlock"}
              onClick={handleUnlock}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={isLoggedIn ? "logged" : "guest"}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            className="mt-4 text-center text-xs text-[var(--muted-foreground)]"
          >
            {isLoggedIn ? "Your library is ready in the dashboard." : "Your progress is saved once you log in."}
          </motion.p>
        </AnimatePresence>
      </motion.section>
    </MotionConfig>
  );
}
