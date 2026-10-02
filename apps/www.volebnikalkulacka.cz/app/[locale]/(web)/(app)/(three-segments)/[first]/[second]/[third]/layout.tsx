import { prefixGuard } from "@kalkulacka-one/next";

import { PREFIXES } from "@/lib/routing";

// On-demand ISR: nothing is prerendered at build, each path renders on its first request and is then served from cache, re-rendered at most once a minute (matches the data fetch revalidation).
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  prefixGuard({ prefix: first, validPrefixes: PREFIXES });
  return children;
}
