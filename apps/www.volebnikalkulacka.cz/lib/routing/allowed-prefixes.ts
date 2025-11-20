export const ALLOWED_PREFIXES = ["volby", "inventura"];

export function isAllowedPrefix(segment: string): boolean {
  return ALLOWED_PREFIXES.includes(segment);
}
