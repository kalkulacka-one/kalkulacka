import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }) {
  const { first, second, questionNumber } = await params;
  const currentQuestionNumber = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(currentQuestionNumber)) {
    notFound();
  }

  const navigationNextPath = async (currentQuestionNumber: number) => {
    "use server";
    return `/${first}/${second}/otazka/${currentQuestionNumber + 1}`;
  };

  const navigationPreviousPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber === 1) {
      return `/${first}/${second}/navod/2`;
    }
    return `/${first}/${second}/otazka/${currentQuestionNumber - 1}`;
  };

  const navigationReviewPath = async () => {
    "use server";
    return `/${first}/${second}/rekapitulace`;
  };

  return <QuestionPage current={currentQuestionNumber} navigationNextPath={navigationNextPath} navigationPreviousPath={navigationPreviousPath} navigationReviewPath={navigationReviewPath} />;
}
