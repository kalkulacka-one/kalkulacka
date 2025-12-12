import { loadCalculatorData, NotFoundError } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

import { ProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const key = mappedParams.key(segments);

  try {
    const calculatorData = await loadCalculatorData({ endpoint: process.env.DATA_ENDPOINT, key });
    return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
