import { calculatorDataLoader } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

import { SessionProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const key = mappedParams.key(segments);

  const calculatorData = await calculatorDataLoader({
    endpoint: process.env.DATA_ENDPOINT,
    key,
    onNotFound: notFound,
  });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
