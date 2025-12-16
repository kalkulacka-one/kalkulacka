import { SessionProviderLayout } from "@/components/client";
import { calculatorDataLoader, mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const segments = await params;
  const { first } = segments;

  prefixGuard(first);

  const calculatorData = await calculatorDataLoader({
    endpoint: process.env.DATA_ENDPOINT,
    key: mappedParams.key(segments),
    group: mappedParams.group(segments),
  });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
