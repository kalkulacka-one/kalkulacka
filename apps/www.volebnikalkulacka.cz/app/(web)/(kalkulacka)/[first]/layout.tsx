import { type CalculatorData, CalculatorStoreProvider } from "../../../../calculator/calculatorStore";
import { loadCalculatorData } from "../../../../common/dataFetch";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string }>;
}) {
  const { first } = await params;
  const calculatorData: CalculatorData = await loadCalculatorData(first);
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>First: `{first}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
