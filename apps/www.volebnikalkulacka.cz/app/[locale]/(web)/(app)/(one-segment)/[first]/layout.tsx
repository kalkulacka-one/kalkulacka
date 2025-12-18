import { dataLoaderGuard } from "@kalkulacka-one/next";

import { SessionProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const calculatorData = await dataLoaderGuard({ endpoint: process.env.DATA_ENDPOINT, key: mappedParams.key(segments) });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
