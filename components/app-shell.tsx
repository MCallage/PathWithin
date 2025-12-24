"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 pt-6 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {/* Header sempre embedded, dentro do card */}
          <Header variant="embedded" />

          {/* Divider */}
          <div className="h-px w-full bg-[var(--border)] opacity-80" />

          {/* Conteúdo (Home pode ter padding diferente se quiser) */}
          <div className={isHome ? "px-6 py-12 sm:px-10 sm:py-16" : "px-6 py-10 sm:px-10 sm:py-12"}>
            {children}
          </div>

          <Footer />
        </div>
      </div>
    </main>
  );
}
