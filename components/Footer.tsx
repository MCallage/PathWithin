"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { FiHeart } from "react-icons/fi";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

type FooterLink = {
  label: string;
  href: string;
};

const productLinks: FooterLink[] = [
  { label: "Journeys", href: "/journeys" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "How it works", href: "/#how-it-works" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

function FooterNavLink({
  href,
  label,
  navItem,
}: FooterLink & {
  navItem: {
    hidden: any;
    show: any;
  };
}) {
  return (
    <motion.li variants={navItem}>
      <Link
        href={href}
        className="
          group inline-flex items-center gap-2
          text-sm text-[var(--muted-foreground)]
          hover:text-[var(--foreground)]
          transition-colors
        "
      >
        <span className="relative">
          {label}
          <span
            className="
              pointer-events-none absolute -bottom-0.5 left-0 h-px w-0
              bg-[var(--foreground)] opacity-60
              transition-all duration-200
              group-hover:w-full
            "
            aria-hidden="true"
          />
        </span>
      </Link>
    </motion.li>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();

  // Containers
  const blockContainer = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.03 },
    },
  };

  const listContainer = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.05, delayChildren: 0.02 },
    },
  };

  // Items
  const fadeUp = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.28, ease: EASE_OUT },
        },
  };

  const navItem = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    show: reduce
      ? { opacity: 1, y: 0 }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: 0.22, ease: EASE_OUT },
        },
  };

  return (
    <MotionConfig reducedMotion="user">
      <footer className="px-6 pb-8">
        <motion.div
          className="
            mx-auto max-w-5xl
            rounded-2xl border border-[var(--border)]
            bg-[var(--background)]
            px-5 py-6
          "
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: EASE_OUT }}
        >
          <motion.div
            className="grid gap-8 sm:grid-cols-3"
            variants={blockContainer}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            {/* Brand */}
            <motion.div variants={fadeUp} className="flex flex-col">
              <motion.div
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="inline-flex w-fit"
              >
                <Link
                  href="/"
                  aria-label="Go to homepage"
                  className="
                    inline-flex items-start
                    rounded-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    focus-visible:ring-[var(--ring)]
                    focus-visible:ring-offset-[var(--background)]
                  "
                >
                  <div className="relative">
                    <Image
                      src="/logonome.svg"
                      alt="Paths Within"
                      width={520}
                      height={220}
                      priority={false}
                      className="h-28 w-auto select-none sm:h-32"
                    />
                  </div>
                </Link>
              </motion.div>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
                Gentle, guided journeys for self reflection and emotional clarity.
              </p>
            </motion.div>

            {/* Product */}
            <motion.div variants={fadeUp}>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Explore
              </h3>

              <motion.ul
                className="mt-3 space-y-2"
                variants={listContainer}
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
              >
                {productLinks.map((l) => (
                  <FooterNavLink key={l.href} {...l} navItem={navItem} />
                ))}
              </motion.ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={fadeUp}>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Legal
              </h3>

              <motion.ul
                className="mt-3 space-y-2"
                variants={listContainer}
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
              >
                {legalLinks.map((l) => (
                  <FooterNavLink key={l.href} {...l} navItem={navItem} />
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="my-6 h-px w-full bg-[var(--border)]"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
          />

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
          >
            <p className="text-xs text-[var(--muted-foreground)]">
              © {year} Paths Within. All rights reserved.
            </p>

            <motion.p
              className="inline-flex items-center gap-2 text-xs text-[var(--muted-foreground)]"
              whileHover={reduce ? undefined : { y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            >
              Built with care{" "}
              <motion.span
                aria-hidden="true"
                animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                transition={{
                  duration: 1.6,
                  ease: EASE_IN_OUT,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              >
                <FiHeart size={14} />
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      </footer>
    </MotionConfig>
  );
}
