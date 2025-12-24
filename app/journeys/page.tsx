import type { Metadata } from "next";
import { getJourneys } from "@/lib/journeys";
import { JourneysListClient } from "@/components/journeys/journeys-list-client";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Explore guided journeys for self-knowledge and emotional clarity.",
  alternates: { canonical: "/journeys" },
};

export default function JourneysPage() {
  const journeys = getJourneys();
  return <JourneysListClient journeys={journeys} />;
}