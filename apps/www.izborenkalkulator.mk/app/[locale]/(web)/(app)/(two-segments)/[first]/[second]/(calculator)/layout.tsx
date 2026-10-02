import { calculatorPathGuard, dataLoaderGuard, isPrefix, prefixGuard } from "@kalkulacka-one/next";

import { SessionProviderLayout } from "@/components/client";
import { mappedParams, PREFIXES } from "@/lib/routing";

// On-demand ISR: nothing is prerendered at build, each path renders on its first request and is then served from cache, re-rendered at most once a minute (matches the data fetch revalidation).
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

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

  calculatorPathGuard({
    calculator: calculatorData.data.calculator,
    prefixed: isPrefix({ segment: segments.first, validPrefixes: PREFIXES }),
    group: mappedParams.group(segments),
  });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
