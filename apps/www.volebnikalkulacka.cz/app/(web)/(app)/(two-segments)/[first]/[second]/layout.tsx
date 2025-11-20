import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";
import { allowedPrefixGuard, isAllowedPrefix } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const calculatorData = isAllowedPrefix(first) ? (allowedPrefixGuard(first), await loadCalculatorData({ key: second })) : await loadCalculatorData({ key: first, group: second });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
