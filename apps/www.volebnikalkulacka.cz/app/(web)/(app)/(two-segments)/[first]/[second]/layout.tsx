import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";
import { params } from "@/lib/routing";

export default async function Layout({ children, params: routeParams }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await routeParams;
  const calculatorParams = params.twoSegmentCalculator(first, second);
  const calculatorData = await loadCalculatorData(calculatorParams);
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
