import QuestionsInject from "./questionsInject";
import getQuestions from "../../../utils/getQuestions";

export default async function QuestionLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { district: string };
}) {
  const district = params.district;
  const data = await getQuestions(district);
  const questions = data;

  return (
    <>
      <QuestionsInject questions={questions} />
      {children}
    </>
  );
}
