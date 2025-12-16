import { ProviderLayout } from "@/components/client";
import { calculatorDataLoader, mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;

  const calculatorData = await calculatorDataLoader({
    endpoint: process.env.DATA_ENDPOINT,
    key: mappedParams.key(segments),
  });

  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
