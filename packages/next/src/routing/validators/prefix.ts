export function isPrefix({ segment, validPrefixes }: { segment: string; validPrefixes: string[] }): boolean {
  return validPrefixes.includes(segment);
}

export function validatePrefix({ prefix, validPrefixes }: { prefix: string; validPrefixes: string[] }): string {
  if (!validPrefixes.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
