import { loadCalculatorData } from "../../../../../../../calculator/lib";
import { ProviderLayout } from "../../../../../../../components/client";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
