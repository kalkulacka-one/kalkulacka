import { notFound } from "next/navigation";

import { validateAllowedPrefix } from "../validators";

export function allowedPrefixGuard(prefix: string): string {
  try {
    return validateAllowedPrefix(prefix);
  } catch {
    notFound();
  }
}
