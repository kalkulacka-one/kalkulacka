import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { allowedPrefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  allowedPrefixGuard(first);

  const calculatorData = await loadCalculatorData({ key: third, group: second });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
