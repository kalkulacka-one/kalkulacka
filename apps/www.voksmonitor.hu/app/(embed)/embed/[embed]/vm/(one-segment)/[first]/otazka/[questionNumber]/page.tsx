import type { Metadata } from "next";

import { QuestionPageWithRouting } from "../../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../../lib/metadata/calculator";
import { questionNumberGuard, validateQuestionNumber } from "../../../../../../../../../lib/routing/guards/question-number";
import { canonical } from "../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, questionNumber } = await params;
  const validatedNumber = validateQuestionNumber(questionNumber);
  if (validatedNumber === null) {
    throw new Error(`Invalid question number \`${questionNumber}\``);
  }
  const canonicalUrl = canonical.question({ first }, validatedNumber);
  return generateCalculatorMetadata({ key: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, embed }} />;
}
