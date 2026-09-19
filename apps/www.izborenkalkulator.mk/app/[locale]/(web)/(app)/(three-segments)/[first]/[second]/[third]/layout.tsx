import { prefixGuard } from "@kalkulacka-one/next";

import { PREFIXES } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  prefixGuard({ prefix: first, validPrefixes: PREFIXES });
  return children;
}
