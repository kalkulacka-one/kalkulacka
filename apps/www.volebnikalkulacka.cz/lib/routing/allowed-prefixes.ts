export const ALLOWED_PREFIXES = ["volby", "inventura"];

export function isAllowedPrefix(prefix: string): boolean {
  return ALLOWED_PREFIXES.includes(prefix);
}
