"use client";

import * as React from "react";
import { FiMap, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

type Step = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    title: "Choose a path",
    description: "Pick a journey that matches what you need right now.",
    icon: <FiMap size={18} />,
  },
  {
    title: "Follow the steps",
    description: "Move through simple actions at your own pace.",
    icon: <FiCheckCircle size={18} />,
  },
  {
    title: "Track & grow",
    description: "Write down insights and watch your progress unfold.",
    icon: <FiTrendingUp size={18} />,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.10, delayChildren: 0.05 },
    },
  };

  const card = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="how-it-works"
        className="mx-auto max-w-5xl px-6"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-semibold text-[var(--foreground)]"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
        >
          How it works
        </motion.h2>

        <motion.div
          className="mt-5 grid gap-4 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={card}
              whileHover={reduce ? undefined : { y: -2 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="
                rounded-2xl border border-[var(--border)]
                bg-[var(--card)]
                p-5
              "
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="
                    inline-flex h-10 w-10 items-center justify-center
                    rounded-xl border border-[var(--border)]
                    bg-[var(--background)]
                    text-[var(--foreground)]
                  "
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {step.icon}
                </motion.div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
