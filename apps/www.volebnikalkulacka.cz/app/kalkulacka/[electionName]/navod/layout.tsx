import getCalculator from "../../utils/getCalculator";
import CalculatorInject from "../calculatorInject";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { electionName: string };
}) {
  const data = await getCalculator({ electionName: params.electionName });

  console.log(data);
  return (
    <>
      <CalculatorInject calculator={data} />
      {children}
    </>
  );
}
