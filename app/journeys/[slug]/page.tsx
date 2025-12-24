import Link from "next/link";
import { getJourneyBySlug } from "@/lib/journeys";
import { notFound } from "next/navigation";
import { StepsListClient } from "@/components/journeys/steps-list-client";
import { JourneyCTAClient } from "@/components/journeys/journey-cta-client";
import { isJourneyPublic } from "@/lib/journey-access";

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const journey = getJourneyBySlug(slug);
  if (!journey) return notFound();

  return (
    <main>
      <Link
        href="/journeys"
        className="text-sm text-[var(--muted-foreground)] hover:underline"
      >
        ← Back to Journeys
      </Link>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h1 className="text-3xl font-semibold">{journey.title}</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">{journey.subtitle}</p>

        <p className="mt-5 text-sm text-[var(--muted-foreground)]">
          {journey.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {journey.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs text-[var(--secondary-foreground)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
  <JourneyCTAClient slug={journey.slug} isPublic={isJourneyPublic(journey.slug)} />

  <a
    href="#steps"
    className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:opacity-90"
  >
    View steps
  </a>
</div>

      </div>

      <section id="steps" className="mt-10">
          <h2 className="text-xl font-semibold">Steps</h2>
          <StepsListClient journey={journey} />
      </section>

    </main>
  );
}
