/**
 * Allowed URL prefixes for multi-segment routes
 *
 * These prefixes are validated in 2-segment and 3-segment routes but not passed to the data layer.
 * For example, `/volby/snemovni-2025` validates "volby" but only passes "snemovni-2025" to loadCalculatorData.
 */
export const ALLOWED_PREFIXES = ["volby", "inventura"] as const;

export type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];

/**
 * Check if a string is a valid URL prefix
 */
export function isAllowedPrefix(prefix: string): prefix is AllowedPrefix {
  return ALLOWED_PREFIXES.some((p) => p === prefix);
}
