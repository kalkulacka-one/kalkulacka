import { CalculatorStoreProvider } from "../../../../../../calculator/components/client";
import { loadCalculatorData } from "../../../../../../calculator/lib";
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const calculatorData = await loadCalculatorData({ key: first, group: second });

  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>First: `{first}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
