import { loadCalculatorData } from "../../../../calculator/common/";
import { CalculatorStoreProvider } from "../../../../calculator/stores/calculatorStore";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData(first);
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>First: `{first}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
