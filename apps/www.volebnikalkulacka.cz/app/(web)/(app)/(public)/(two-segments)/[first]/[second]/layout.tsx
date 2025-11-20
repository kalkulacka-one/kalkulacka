import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { getTwoSegmentCalculatorParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const calculatorParams = getTwoSegmentCalculatorParams(first, second);
  const calculatorData = await loadCalculatorData(calculatorParams);

  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
