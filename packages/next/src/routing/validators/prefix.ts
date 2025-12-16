export function isPrefix(segment: string, validPrefixes: string[]): boolean {
  return validPrefixes.includes(segment);
}

export function validatePrefix(prefix: string, validPrefixes: string[]): string {
  if (!validPrefixes.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
