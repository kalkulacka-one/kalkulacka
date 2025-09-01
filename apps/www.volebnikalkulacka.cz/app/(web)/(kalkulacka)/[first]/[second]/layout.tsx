import { loadCalculatorData } from "../../../../../calculator/common";
import { CalculatorStoreProvider } from "../../../../../calculator/stores/calculatorStore";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData(first, second);

  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
