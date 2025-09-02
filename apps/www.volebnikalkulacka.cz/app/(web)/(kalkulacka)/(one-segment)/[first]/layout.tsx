import { loadCalculatorData } from "../../../../../calculator/lib";
import { CalculatorStoreProvider } from "../../../../../calculator/stores";
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;

  const calculatorData = await loadCalculatorData({ key: first });
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>First: `{first}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
