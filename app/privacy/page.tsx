import type { Metadata } from "next";
import { Link } from "next-view-transitions";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Paths Within collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="px-6 pt-10 pb-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Privacy Policy</h1>
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
            Paths Within is designed for gentle self-reflection. We aim to
            collect as little personal data as possible, and we never sell your
            data.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">What we store</h2>
            <ul className="list-disc pl-5 text-sm text-[var(--muted-foreground)] space-y-2">
              <li>
                <span className="text-[var(--foreground)] font-medium">
                  Local progress (on your device):
                </span>{" "}
                Your step progress and notes may be saved in your browser&apos;s
                local storage when available.
              </li>
              <li>
                <span className="text-[var(--foreground)] font-medium">
                  Account data (if you sign in):
                </span>{" "}
                If you use sign-in, your provider (e.g., GitHub) may share basic
                account identifiers with us, depending on what you authorize.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Cookies</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              We may use essential cookies required for authentication and
              security. If local storage is blocked by your browser, your
              progress might not save.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Third-party services</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              If you sign in with a third-party provider (like GitHub), your
              usage may also be governed by that provider&apos;s privacy policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Your choices</h2>
            <ul className="list-disc pl-5 text-sm text-[var(--muted-foreground)] space-y-2">
              <li>You can reset your local journey progress anytime.</li>
              <li>
                You can use the journeys without saving if storage is blocked.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Questions about privacy? Please reach out to us at mcallagedev@gmail.com
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
