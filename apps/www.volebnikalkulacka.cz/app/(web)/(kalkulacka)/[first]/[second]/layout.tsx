import { loadCalculatorData } from "../../../../../calculator/lib";
import { CalculatorStoreProvider } from "../../../../../calculator/stores/calculatorStore";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const calculatorData = await loadCalculatorData({ key: first, group: second });

  console.log(calculatorData);
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>Second: `{second}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
