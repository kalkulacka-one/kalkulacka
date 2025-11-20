import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { getThreeSegmentCalculatorParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;
  const calculatorParams = getThreeSegmentCalculatorParams(first, second, third);
  const calculatorData = await loadCalculatorData(calculatorParams);
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
