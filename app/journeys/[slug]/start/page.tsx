import { StartJourneyClient } from "@/components/journeys/start-journey-client";


export default async function StartJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StartJourneyClient slug={slug} />;
}
