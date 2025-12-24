import { getJourneyBySlug, getStep } from "@/lib/journeys";
import { notFound } from "next/navigation";
import { JourneyStepClient } from "@/components/journeys/journey-step-client";

export default async function JourneyStepPage({
  params,
}: {
  params: Promise<{ slug: string; stepId: string }>;
}) {
  const { slug, stepId } = await params;

  const journey = getJourneyBySlug(slug);
  if (!journey) return notFound();

  const step = getStep(journey, stepId);
  if (!step) return notFound();

  return <JourneyStepClient journey={journey} step={step} />;
}
