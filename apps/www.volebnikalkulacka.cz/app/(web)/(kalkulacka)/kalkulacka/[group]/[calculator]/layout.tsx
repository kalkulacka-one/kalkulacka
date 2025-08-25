import { fetchCalculator, fetchCalculatorData, fetchCalculatorGroup, fetchElection } from "../../../../../../common/dataFetch";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ group: string; calculator: string }>;
}) {
  const { group, calculator } = await params;

  // const election = await fetchElection(group);
  // console.log(election);
  // console.log(`Calculator group id: ${election.calculatorGroup.id}`);

  // const calculatorGroup = await fetchCalculatorGroup(group, election.id, election.key, election.calculatorGroup.id, election.calculatorGroup.key);
  // console.log(calculatorGroup);

  // const calculatorFile = await fetchCalculator(group, calculator, calculatorGroup.id);

  // console.log(calculatorFile);

  const calculatorData = await fetchCalculatorData(group, calculator);

  console.log("Candidates answers:", calculatorData[0]);
  console.log("Candidates:", calculatorData[1]);
  console.log("Organizations:", calculatorData[2]);
  console.log("Persons:", calculatorData[3]);
  console.log("Questions:", calculatorData[4]);

  return (
    <section>
      <span>Group: `{group}`</span>
      <span>Calculator: `{calculator}`</span>
      <main>{children}</main>
    </section>
  );
}
