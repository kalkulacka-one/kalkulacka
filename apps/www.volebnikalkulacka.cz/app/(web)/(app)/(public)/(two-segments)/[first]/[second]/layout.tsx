import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { isPrefix, params, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params: routeParams }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await routeParams;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const calculatorData = await loadCalculatorData({
    key: params.twoSegment.calculatorKey(first, second),
    group: params.twoSegment.calculatorGroupKey(first, second),
  });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
