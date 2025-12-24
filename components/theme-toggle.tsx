"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-md border px-3 py-2 text-sm font-medium
                   border-black/10 bg-white/60 text-black
                   dark:border-white/10 dark:bg-white/5 dark:text-white"
        aria-label="Toggle theme"
        disabled
      >
        Theme
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      key={resolvedTheme} 
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md border px-3 py-2 text-sm font-medium
                 border-black/10 bg-white/60 text-black
                 dark:border-white/10 dark:bg-white/5 dark:text-white
                 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}


