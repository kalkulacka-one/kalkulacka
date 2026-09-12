import { calculatorPathGuard, dataLoaderGuard, isPrefix } from "@kalkulacka-one/next";

import { ProviderLayout } from "@/components/client";
import { mappedParams, PREFIXES } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const calculatorData = await dataLoaderGuard({ endpoint: process.env.DATA_ENDPOINT, key: mappedParams.key(segments) });

  calculatorPathGuard({
    calculator: calculatorData.data.calculator,
    prefixed: isPrefix({ segment: segments.first, validPrefixes: PREFIXES }),
    group: mappedParams.group(segments),
  });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
