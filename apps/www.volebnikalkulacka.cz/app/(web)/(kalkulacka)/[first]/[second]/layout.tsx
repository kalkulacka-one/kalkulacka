import CalculatorInject from "../../../../../common/calculatorInject";
import { fetchCalculatorData, fetchElection } from "../../../../../common/dataFetch";
import { ElectionStoreProvider } from "../../../../../stores/electionStore";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string; second: string }>;
}) {
  const { first, second } = await params;

  const calculatorData = await fetchCalculatorData(first, second);
  const electionData = await fetchElection(first);

  return (
    <ElectionStoreProvider>
      <CalculatorInject electionData={electionData} calculatorData={calculatorData} />
      <section>
        <p>Second: `{second}`</p>
        <main>{children}</main>
      </section>
    </ElectionStoreProvider>
  );
}
