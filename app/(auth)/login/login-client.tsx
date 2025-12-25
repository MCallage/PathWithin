"use client";

import { signIn } from "next-auth/react";

type Props = {
  callbackUrl: string;
};

export default function LoginClient({ callbackUrl }: Props) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 pt-10">
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Sign in to access your journeys and dashboard.
        </p>

        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="mt-6 w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-foreground)] hover:opacity-90"
        >
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="mt-3 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm hover:bg-[var(--muted)]"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
