import { SessionProviderLayout } from "@/components/client";
import { calculatorDataLoader, isPrefix, mappedParams, prefixGuard } from "@/lib/routing";

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
  });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
