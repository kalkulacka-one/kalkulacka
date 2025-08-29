import { CalculatorStoreProvider } from "../../../../calculator/calculatorStore";
import { fetchCalculator } from "../../../../common/dataFetch";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string }>;
}) {
  const { first } = await params;
  // const data = await fetchCalculator(first);
  // console.log(data);

  return (
    // <CalculatorStoreProvider data={data}>
    <section>
      <p>First: `{first}`</p>
      <main>{children}</main>
    </section>
    // </CalculatorStoreProvider>
  );
}
