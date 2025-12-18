import { dataLoaderGuard, prefixGuard } from "@kalkulacka-one/next";

import { ProviderLayout } from "@/components/client";
import { mappedParams, PREFIXES } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const { first } = segments;

  prefixGuard({ prefix: first, validPrefixes: PREFIXES });

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await dataLoaderGuard({ endpoint: process.env.DATA_ENDPOINT, key, group });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
