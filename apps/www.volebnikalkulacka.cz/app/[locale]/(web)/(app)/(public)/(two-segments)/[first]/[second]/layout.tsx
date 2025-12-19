import { dataLoaderGuard, isPrefix, prefixGuard } from "@kalkulacka-one/next";

import { ProviderLayout } from "@/components/client";
import { mappedParams, PREFIXES } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const { first } = segments;

  if (isPrefix({ segment: first, validPrefixes: PREFIXES })) {
    prefixGuard({ prefix: first, validPrefixes: PREFIXES });
  }

  const calculatorData = await dataLoaderGuard({
    endpoint: process.env.DATA_ENDPOINT,
    key: mappedParams.key(segments),
    group: mappedParams.group(segments),
  });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
