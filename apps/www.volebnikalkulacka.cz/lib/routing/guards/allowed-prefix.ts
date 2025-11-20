import { notFound } from "next/navigation";

import { validateAllowedPrefix } from "../validators/allowed-prefix";

export function allowedPrefixGuard(prefix: string): string {
  try {
    return validateAllowedPrefix(prefix);
  } catch {
    notFound();
  }
}
