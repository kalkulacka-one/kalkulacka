import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";
import { isPrefix, params, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params: routeParams }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await routeParams;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const calculatorParams = params.twoSegmentCalculator(first, second);
  const calculatorData = await loadCalculatorData(calculatorParams);
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
