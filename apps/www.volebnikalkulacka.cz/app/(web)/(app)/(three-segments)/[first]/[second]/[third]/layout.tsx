import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";
import { prefixGuard, params as routeParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  prefixGuard(first);

  const key = routeParams.key({ first, second, third });
  const group = routeParams.group({ first, second, third });
  const calculatorData = await loadCalculatorData({ key, group });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
