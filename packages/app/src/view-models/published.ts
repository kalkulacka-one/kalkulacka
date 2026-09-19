export function isPublished(calculator: { publishedAt?: string } | undefined, now: Date): boolean {
  if (!calculator?.publishedAt) return false;
  return new Date(calculator.publishedAt) <= now;
}
