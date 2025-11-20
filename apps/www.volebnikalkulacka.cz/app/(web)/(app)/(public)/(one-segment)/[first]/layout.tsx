import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { params as routeParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;

  const path = `/${first}`;
  const calculatorData = await loadCalculatorData({
    key: routeParams.calculatorKey(path),
    group: routeParams.calculatorGroupKey(path),
  });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
