export const ALLOWED_PREFIXES = ["volby", "inventura"] as const;

export type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];

export function isAllowedPrefix(prefix: string): prefix is AllowedPrefix {
  return ALLOWED_PREFIXES.some((p) => p === prefix);
}
