"use client";

import Link from "next/link";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: reduce
        ? {}
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="text-center pt-10 pb-8"
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.h1
          variants={item}
          className="font-heading text-4xl leading-tight sm:text-5xl"
        >
          Paths Within
        </motion.h1>

        <motion.p
          variants={item}
          className="font-body mt-3 text-base sm:text-lg text-[var(--muted)]"
        >
          Journeys for self-knowledge
        </motion.p>

        <motion.p
          variants={item}
          className="font-body mt-5 mx-auto max-w-xl text-sm sm:text-base text-[var(--muted)]"
        >
          Guided journeys to reconnect with yourself, one gentle step at a time.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3">
          <Link href="/journeys" className="inline-flex">
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="
                rounded-full px-7 py-2.5 text-sm font-medium
                bg-[var(--accent)] text-[var(--accent-foreground)]
                hover:opacity-90 transition-opacity
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:ring-[var(--ring)]
                focus-visible:ring-offset-[var(--background)]
              "
            >
              Start a journey
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
