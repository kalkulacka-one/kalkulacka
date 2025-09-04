import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; questionNumber: string }> }) {
  const { first, questionNumber } = await params;
  const questionNumberInt = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(questionNumberInt)) {
    notFound();
  }

  const navigationNextPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber >= 3) {
      return `/${first}/rekapitulace`;
    }
    return `/${first}/otazka/${currentQuestionNumber + 1}`;
  };

  const navigationPreviousPath = async (currentQuestionNumber: number) => {
    "use server";
    if (currentQuestionNumber === 1) {
      return `/${first}/navod/2`;
    }
    return `/${first}/otazka/${currentQuestionNumber - 1}`;
  };

  const navigationResultsPath = async () => {
    "use server";
    return `/${first}/rekapitulace`;
  };

  return <QuestionPage questionNumber={questionNumberInt} navigationNextPath={navigationNextPath} navigationPreviousPath={navigationPreviousPath} navigationResultsPath={navigationResultsPath} />;
}
