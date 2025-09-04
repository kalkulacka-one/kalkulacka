import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const questionNumberInt = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(questionNumberInt)) {
    notFound();
  }

  const navigationNextPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber >= 3) {
      return `/embed/${embed}/${first}/rekapitulace`;
    }
    return `/embed/${embed}/${first}/otazka/${currentQuestionNumber + 1}`;
  };

  const navigationPreviousPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber === 1) {
      return `/embed/${embed}/${first}/navod/2`;
    }
    return `/embed/${embed}/${first}/otazka/${currentQuestionNumber - 1}`;
  };

  const navigationResultsPath = async () => {
    "use server";
    return `/embed/${embed}/${first}/rekapitulace`;
  };

  return <QuestionPage questionNumber={questionNumberInt} navigationNextPath={navigationNextPath} navigationPreviousPath={navigationPreviousPath} navigationResultsPath={navigationResultsPath} />;
}
