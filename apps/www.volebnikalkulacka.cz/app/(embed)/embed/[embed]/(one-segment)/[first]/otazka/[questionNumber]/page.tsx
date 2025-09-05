import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const currentQuestionNumber = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(currentQuestionNumber)) {
    notFound();
  }

  const navigationNextPath = async (currentQuestionNumber: number) => {
    "use server";
    return `/embed/${embed}/${first}/otazka/${currentQuestionNumber + 1}`;
  };

  const navigationPreviousPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber === 1) {
      return `/embed/${embed}/${first}/navod/2`;
    }
    return `/embed/${embed}/${first}/otazka/${currentQuestionNumber - 1}`;
  };

  const navigationReviewPath = async () => {
    "use server";
    return `/embed/${embed}/${first}/rekapitulace`;
  };

  return <QuestionPage current={currentQuestionNumber} navigationNextPath={navigationNextPath} navigationPreviousPath={navigationPreviousPath} navigationReviewPath={navigationReviewPath} />;
}
