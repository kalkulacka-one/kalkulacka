import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { isPrefix, mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  const key = mappedParams.key({ first, second });
  const group = mappedParams.group({ first, second });
  const calculatorData = await loadCalculatorData({ key, group });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
