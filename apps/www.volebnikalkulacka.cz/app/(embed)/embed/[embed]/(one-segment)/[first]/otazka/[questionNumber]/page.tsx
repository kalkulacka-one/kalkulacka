import { notFound } from "next/navigation";

import { QuestionPageWithRouting } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const currentQuestionNumber = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(currentQuestionNumber)) {
    notFound();
  }

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, embed }} />;
}
