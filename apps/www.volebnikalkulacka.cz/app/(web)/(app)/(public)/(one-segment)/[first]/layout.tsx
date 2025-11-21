import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const key = mappedParams.key({ first });
  const calculatorData = await loadCalculatorData({ key });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
