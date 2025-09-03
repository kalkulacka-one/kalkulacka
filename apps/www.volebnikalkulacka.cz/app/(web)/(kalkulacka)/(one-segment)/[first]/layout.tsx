import { CalculatorStoreProvider } from "../../../../../calculator/components/client";
import { loadCalculatorData } from "../../../../../calculator/lib";
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;

  const calculatorData = await loadCalculatorData({ key: first });
  return <CalculatorStoreProvider calculatorData={calculatorData}>{children}</CalculatorStoreProvider>;
}
