import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { prefixGuard, params as routeParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  prefixGuard(first);

  const path = `/${first}/${second}/${third}`;
  const calculatorData = await loadCalculatorData({
    key: routeParams.calculatorKey(path),
    group: routeParams.calculatorGroupKey(path),
  });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
