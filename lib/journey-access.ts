export const PUBLIC_JOURNEY_SLUGS = new Set<string>([
  "emotional-reset",
  // adicione outras públicas aqui no futuro
]);

export function isJourneyPublic(slug: string) {
  return PUBLIC_JOURNEY_SLUGS.has(slug);
}