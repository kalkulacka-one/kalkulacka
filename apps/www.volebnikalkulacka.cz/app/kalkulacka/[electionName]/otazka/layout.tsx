import getCandidatesAnswers from "../../utils/getCandidatesAnswers";
import getQuestions from "../../utils/getQuestions";
import QuestionsInject from "./questionsInject";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { electionName: string };
}) {
  const questions = await getQuestions({ electionName: params.electionName });
  const candidatesAnswers = await getCandidatesAnswers({ electionName: params.electionName });
  if (!questions) {
    return null;
  }
  return (
    <>
      <QuestionsInject candidatesAnswers={candidatesAnswers} questions={questions} />
      {children}
    </>
  );
}
