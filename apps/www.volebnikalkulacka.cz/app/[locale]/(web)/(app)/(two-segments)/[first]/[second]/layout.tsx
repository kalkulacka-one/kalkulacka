import { calculatorDataLoader } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

import { SessionProviderLayout } from "@/components/client";
import { isPrefix, mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const { first } = segments;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);

  const calculatorData = await calculatorDataLoader({
    endpoint: process.env.DATA_ENDPOINT,
    key,
    group,
    onNotFound: notFound,
  });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
