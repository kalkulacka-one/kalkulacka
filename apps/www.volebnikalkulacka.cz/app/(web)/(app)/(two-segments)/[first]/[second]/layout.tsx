import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";
import { isPrefix, prefixGuard, params as routeParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const key = routeParams.key({ first, second });
  const group = routeParams.group({ first, second });
  const calculatorData = await loadCalculatorData({ key, group });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
