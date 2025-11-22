export const PREFIXES = ["volby"];

export function isPrefix(segment: string): boolean {
  return PREFIXES.includes(segment);
}

export function validatePrefix(prefix: string): string {
  if (!PREFIXES.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
