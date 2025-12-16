import { loadCalculatorData } from "@kalkulacka-one/app";
import { prefixGuard } from "@kalkulacka-one/next";

import { SessionProviderLayout } from "@/components/client";
import { mappedParams, PREFIXES } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const { first } = segments;

  prefixGuard(first, PREFIXES);

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await loadCalculatorData({ endpoint: process.env.DATA_ENDPOINT, key, group });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
