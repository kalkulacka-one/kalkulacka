import { notFound } from "next/navigation";

import { validatePrefix } from "../validators";

export function prefixGuard(prefix: string): string {
  try {
    return validatePrefix(prefix);
  } catch {
    notFound();
  }
}
