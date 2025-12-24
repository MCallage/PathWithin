"use client";

import { createPortal } from "react-dom";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogIn, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";

type HeaderProps = {
  variant?: "embedded" | "standalone";
};

function NavLink({
  href,
  label,
  isActive,
  onClick,
  pillId,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  pillId: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "relative rounded-full text-sm font-medium",
        "transition-opacity hover:opacity-80",
        // touch target 44px+
        "inline-flex items-center min-h-[44px] px-4",
        isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]",
      ].join(" ")}
    >
      {isActive ? (
        <motion.span
          layoutId={pillId}
          className="absolute inset-0 rounded-full bg-[var(--accent)]/10"
          transition={{ type: "spring", stiffness: 450, damping: 34 }}
        />
      ) : null}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",")
    )
  );

  // filtra invisíveis/irrelevantes
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

export function Header({ variant = "standalone" }: HeaderProps) {

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);


  const isStandalone = variant === "standalone";
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();

  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastActiveRef = React.useRef<HTMLElement | null>(null);

  function closeMobile() {
    setMobileOpen(false);
  }

  // Fecha menu mobile quando muda de rota
  React.useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function handleLogin() {
    await signIn("github", { callbackUrl: "/dashboard" });
  }

  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  // 1) Travar scroll do body quando menu abrir
  React.useEffect(() => {
    if (!mobileOpen) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // evita “pulo” quando some a scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [mobileOpen]);

  // 2) ESC fecha + 3) Focus trap
  React.useEffect(() => {
    if (!mobileOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    // foca o primeiro item do painel assim que abrir
    const raf = requestAnimationFrame(() => {
      const focusables = getFocusable(panelRef.current);
      if (focusables[0]) focusables[0].focus();
      else panelRef.current?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (!mobileOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
        return;
      }

      if (e.key !== "Tab") return;

      const root = panelRef.current;
      if (!root) return;

      const focusables = getFocusable(root);
      if (focusables.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // se o foco escapou pra fora, traz de volta
      if (!active || !root.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // devolve foco ao que estava selecionado antes (ou ao botão do menu)
  React.useEffect(() => {
    if (mobileOpen) return;

    const el = lastActiveRef.current;
    // se não existir mais (mudou rota), cai pro botão do menu
    if (el && document.contains(el)) el.focus();
    else menuButtonRef.current?.focus();
  }, [mobileOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        className={isStandalone ? "px-6 pt-6" : ""}
      >
        <motion.div
          layout
          className={
            isStandalone
              ? `
                mx-auto max-w-5xl
                rounded-2xl border px-4 py-3
                border-[var(--border)] bg-[var(--card)]
              `
              : `px-5 py-4`
          }
        >
          <div className="grid items-center md:grid-cols-3 grid-cols-[auto_1fr_auto]">
            {/* Left: Nav (desktop) */}
            <LayoutGroup id="desktop-nav">
              <nav className="hidden items-center justify-start gap-1 md:flex">
                <NavLink
                  href="/journeys"
                  label="Journeys"
                  isActive={pathname?.startsWith("/journeys")}
                  pillId="nav-pill-desktop"
                />

                {isLoggedIn ? (
                  <NavLink
                    href="/dashboard"
                    label="Dashboard"
                    isActive={pathname?.startsWith("/dashboard")}
                    pillId="nav-pill-desktop"
                  />
                ) : null}
              </nav>
            </LayoutGroup>

            {/* Logo (left on mobile, centered on desktop) */}
            <div className="col-start-1 md:col-start-2 flex justify-start md:justify-center">
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <Link
                  href="/"
                  aria-label="Back to home"
                  onClick={closeMobile}
                  className="
                    inline-flex items-center rounded-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    focus-visible:ring-[var(--ring)]
                    focus-visible:ring-offset-[var(--background)]
                  "
                >
                  <Image
                    src="/logonome.svg"
                    alt="Paths Within"
                    width={64}
                    height={64}
                    priority
                    className="h-32 w-32 sm:h-24 sm:w-24"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Right: Actions */}
            <div className="col-start-3 flex items-center justify-end gap-3">
              <ThemeToggle />

              {/* Desktop auth */}
              <div className="hidden md:block">
                {!isLoggedIn ? (
                  <motion.button
                    type="button"
                    onClick={handleLogin}
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    whileTap={reduceMotion ? undefined : { y: 0 }}
                    className="
                      inline-flex items-center justify-center gap-2 rounded-full
                      border px-4 text-sm font-medium
                      border-[var(--border)]
                      bg-[var(--background)]
                      hover:opacity-80 transition-opacity
                      min-h-[44px]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                      focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                    "
                  >
                    <FiLogIn size={16} />
                    Login
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    whileTap={reduceMotion ? undefined : { y: 0 }}
                    className="
                      inline-flex items-center justify-center gap-2 rounded-full
                      border px-4 text-sm font-medium
                      border-[var(--border)]
                      bg-[var(--background)]
                      hover:opacity-80 transition-opacity
                      min-h-[44px]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                      focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                    "
                  >
                    <FiLogOut size={16} />
                    Logout
                  </motion.button>
                )}
              </div>

              {/* Mobile menu button */}
              <motion.button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="
                  inline-flex items-center justify-center
                  rounded-full border
                  border-[var(--border)]
                  bg-[var(--background)]
                  hover:opacity-80 transition-opacity
                  md:hidden
                  min-h-[44px] min-w-[44px]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                "
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu-panel"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "x" : "menu"}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, rotate: -20, scale: 0.9 }
                    }
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotate: 20, scale: 0.9 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.15,
                      ease: "easeOut",
                    }}
                    className="inline-flex"
                  >
                    {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile menu (AnimatePresence) */}
          <AnimatePresence initial={false}>
            {mobileOpen ? (
              <>
                {/* Backdrop (click to close, not focusable) */}
                {mounted
  ? createPortal(
      <motion.div
        aria-hidden="true"
        onClick={closeMobile}
        className="
          fixed inset-0 z-40 md:hidden
          bg-black/20 dark:bg-black/40
          backdrop-blur-[2px]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />,
      document.body
    )
  : null}


                {/* Panel */}
                <motion.div
                  id="mobile-menu-panel"
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation menu"
                  tabIndex={-1}
                  className="relative z-50 mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 md:hidden"
                  initial={
                    reduceMotion
                      ? { opacity: 1, height: "auto" }
                      : { opacity: 0, y: -6, height: 0 }
                  }
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -6, height: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.22,
                    ease: "easeOut",
                  }}
                >
                  <LayoutGroup id="mobile-nav">
                    <div className="flex flex-col gap-1">
                      <NavLink
                        href="/journeys"
                        label="Journeys"
                        isActive={pathname?.startsWith("/journeys")}
                        onClick={closeMobile}
                        pillId="nav-pill-mobile"
                      />

                      {isLoggedIn ? (
                        <NavLink
                          href="/dashboard"
                          label="Dashboard"
                          isActive={pathname?.startsWith("/dashboard")}
                          onClick={closeMobile}
                          pillId="nav-pill-mobile"
                        />
                      ) : null}

                      <div className="mt-2 h-px w-full bg-[var(--border)] opacity-80" />

                      {!isLoggedIn ? (
                        <button
                          type="button"
                          onClick={async () => {
                            closeMobile();
                            await handleLogin();
                          }}
                          className="
                            mt-2 inline-flex items-center justify-center gap-2
                            rounded-xl border px-4 text-sm font-medium
                            border-[var(--border)]
                            bg-[var(--background)]
                            hover:opacity-80 transition-opacity
                            min-h-[44px]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                          "
                        >
                          <FiLogIn size={16} />
                          Login
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            closeMobile();
                            await handleLogout();
                          }}
                          className="
                            mt-2 inline-flex items-center justify-center gap-2
                            rounded-xl border px-4 text-sm font-medium
                            border-[var(--border)]
                            bg-[var(--background)]
                            hover:opacity-80 transition-opacity
                            min-h-[44px]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]
                          "
                        >
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      )}
                    </div>
                  </LayoutGroup>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </MotionConfig>
  );
}
