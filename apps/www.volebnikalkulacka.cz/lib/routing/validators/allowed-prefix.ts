export const ALLOWED_PREFIXES = ["volby"];

export function isAllowedPrefix(segment: string): boolean {
  return ALLOWED_PREFIXES.includes(segment);
}

export function validateAllowedPrefix(prefix: string): string {
  if (!ALLOWED_PREFIXES.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
