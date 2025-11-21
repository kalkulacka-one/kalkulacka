import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { isPrefix, mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const segments = await params;
  const { first } = segments;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await loadCalculatorData({ key, group });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
