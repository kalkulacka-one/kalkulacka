import { loadCalculatorData } from "@kalkulacka-one/app";
import { ProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const key = mappedParams.key(segments);
  const calculatorData = await loadCalculatorData({ endpoint: process.env.DATA_ENDPOINT, key });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
