import CalculatorInject from "../../calculatorInject";
import getCalculator from "../../utils/getCalculator";
import getCandidatesAnswers from "../../utils/getCandidatesAnswers";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { electionName: string };
}) {
  const calculator = await getCalculator({ electionName: params.electionName });
  const candidatesAnswers = await getCandidatesAnswers({ electionName: params.electionName });

  console.log(candidatesAnswers);
  return (
    <>
      <CalculatorInject candidatesAnswers={candidatesAnswers} calculator={calculator} />
      {children}
    </>
  );
}
