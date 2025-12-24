import type { Metadata } from "next";
import { Link } from "next-view-transitions";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Paths Within.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="px-6 pt-10 pb-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Terms</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Link
            href="/"
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
          >
            Back home
          </Link>
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            By using Paths Within, you agree to these Terms. If you do not
            agree, please do not use the site.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Purpose</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Paths Within provides guided self-reflection journeys and
              journaling prompts. It is not medical, psychological, or legal
              advice, and it is not a substitute for professional care.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Your content</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Notes you write may be stored locally on your device when
              possible. You are responsible for what you write and for keeping
              your device secure.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Acceptable use</h2>
            <ul className="list-disc pl-5 text-sm text-[var(--muted-foreground)] space-y-2">
              <li>Do not misuse the site or attempt to break security.</li>
              <li>Do not upload malicious content or spam.</li>
              <li>Respect others and applicable laws.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Availability</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              We may change, pause, or discontinue parts of the product at any
              time. We are not liable for losses caused by downtime or changes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Disclaimer</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              The service is provided “as is”. We make no warranties regarding
              accuracy, fitness for a particular purpose, or uninterrupted
              access.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              mcallagedev@gmail.com
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
