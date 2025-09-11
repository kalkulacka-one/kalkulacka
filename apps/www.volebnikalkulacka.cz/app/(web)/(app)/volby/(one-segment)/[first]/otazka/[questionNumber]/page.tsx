import { QuestionPageWithRouting } from "../../../../../../../../components/client";
import { questionNumberGuard } from "../../../../../../../../lib/routing/guards/question-number";

export default async function Page({ params }: { params: Promise<{ first: string; questionNumber: string }> }) {
  const { first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first }} />;
}
