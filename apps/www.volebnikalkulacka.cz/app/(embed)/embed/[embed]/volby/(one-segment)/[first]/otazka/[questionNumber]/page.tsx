import { QuestionPageWithRouting } from "../../../../../../../../../components/client";
import { questionNumberGuard } from "../../../../../../../../../lib/routing/guards/question-number";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, embed }} />;
}
