"use client";
// Server Component; imports CSS as a side effect
import "@repo/design-system/themes/www.volebnikalkulacka.cz/default";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
