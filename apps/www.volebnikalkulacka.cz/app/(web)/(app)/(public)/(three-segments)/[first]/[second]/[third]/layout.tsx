import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { prefixGuard, mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  const { first } = segments;

  prefixGuard(first);

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await loadCalculatorData({ key, group });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
