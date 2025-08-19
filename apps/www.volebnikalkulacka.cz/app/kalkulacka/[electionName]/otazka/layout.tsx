import getCalculator from "../../utils/getCalculator";
import getQuestions from "../../utils/getQuestions";
import QuestionsInject from "./questionsInject";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { electionName: string };
}) {
  const data = await getQuestions({ electionName: params.electionName });

  console.log(data);
  return (
    <>
      <QuestionsInject questions={data} />
      {children}
    </>
  );
}
