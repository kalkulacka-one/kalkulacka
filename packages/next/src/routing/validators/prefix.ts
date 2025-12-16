export function createPrefixValidator(validPrefixes: string[]) {
  return {
    isPrefix: (segment: string): boolean => validPrefixes.includes(segment),
    validatePrefix: (prefix: string): string => {
      if (!validPrefixes.includes(prefix)) {
        throw new Error(`Invalid prefix \`${prefix}\``);
      }
      return prefix;
    },
  };
}
