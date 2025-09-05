import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { embed, first, second, questionNumber } = await params;
  const currentQuestionNumber = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(currentQuestionNumber)) {
    notFound();
  }

  const nextQuestionPath = async (currentQuestionNumber: number) => {
    "use server";
    return `/embed/${embed}/${first}/${second}/otazka/${currentQuestionNumber + 1}`;
  };

  const previousQuestionPath = async (currentQuestionNumber: number) => {
    "use server";
    return `/embed/${embed}/${first}/${second}/otazka/${currentQuestionNumber - 1}`;
  };

  const guidePath = async () => {
    "use server";
    return `/embed/${embed}/${first}/${second}/navod/2`;
  };

  const reviewPath = async () => {
    "use server";
    return `/embed/${embed}/${first}/${second}/rekapitulace`;
  };

  return <QuestionPage current={currentQuestionNumber} nextQuestionPath={nextQuestionPath} previousQuestionPath={previousQuestionPath} guidePath={guidePath} reviewPath={reviewPath} />;
}
