import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { allowedPrefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  allowedPrefixGuard(first);

  const calculatorData = await loadCalculatorData({ key: second });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
