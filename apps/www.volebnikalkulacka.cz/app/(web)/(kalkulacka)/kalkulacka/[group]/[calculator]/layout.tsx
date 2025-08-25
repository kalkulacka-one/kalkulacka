import CalculatorInject from "../../../../../../common/calculatorInject";
import { fetchCalculatorData, fetchElection } from "../../../../../../common/dataFetch";
import { ElectionStoreProvider } from "../../../../../../stores/electionStore";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ group: string; calculator: string }>;
}) {
  const { group, calculator } = await params;

  const calculatorData = await fetchCalculatorData(group, calculator);
  const electionData = await fetchElection(group);

  return (
    <ElectionStoreProvider>
      <CalculatorInject electionData={electionData} calculatorData={calculatorData} />
      <div>
        <span>Group: `{group}`</span>
        <span>Calculator: `{calculator}`</span>
        <main>{children}</main>
      </div>
    </ElectionStoreProvider>
  );
}
