import { notFound } from "next/navigation";

import { validatePrefix } from "@/routing/validators";

export function prefixGuard({ prefix, validPrefixes }: { prefix: string; validPrefixes: string[] }): string {
  try {
    return validatePrefix({ prefix, validPrefixes });
  } catch {
    notFound();
  }
}
