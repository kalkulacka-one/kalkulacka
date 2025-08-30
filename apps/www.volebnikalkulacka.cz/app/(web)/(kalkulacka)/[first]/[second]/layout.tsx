import { CalculatorStoreProvider } from "../../../../../calculator/calculatorStore";
import { loadCalculatorData } from "../../../../../common/dataFetch";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string; second: string }>;
}) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData(first, second);

  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <section>
        <p>Second: `{second}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
