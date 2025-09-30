import { loadCalculatorData } from "../../../../../../../../calculator/lib";
import { ProviderLayout } from "../../../../../../../../components/client";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData({ key: `${first}/${second}` });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
