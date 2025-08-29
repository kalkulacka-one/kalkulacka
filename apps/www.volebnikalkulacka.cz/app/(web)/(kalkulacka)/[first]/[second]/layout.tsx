import { CalculatorStoreProvider } from "../../../../../calculator/calculatorStore";
import { parseCalculator } from "../../../../../common/dataFetch";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string; second: string }>;
}) {
  const { first, second } = await params;
  const parsedCalculator = await parseCalculator(first, second);

  return (
    <CalculatorStoreProvider data={parsedCalculator}>
      <section>
        <p>Second: `{second}`</p>
        <main>{children}</main>
      </section>
    </CalculatorStoreProvider>
  );
}
