import { notFound } from "next/navigation";

import { createPrefixValidator } from "@/routing/validators";

export function createPrefixGuard(validPrefixes: string[]) {
  const { validatePrefix } = createPrefixValidator(validPrefixes);
  return (prefix: string): string => {
    try {
      return validatePrefix(prefix);
    } catch {
      notFound();
    }
  };
}
