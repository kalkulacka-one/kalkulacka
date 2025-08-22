"use client";

// Server Component; imports CSS as a side effect
import "@repo/design-system/themes/www.volebnikalkulacka.cz/idnes";

export default function IdnesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
