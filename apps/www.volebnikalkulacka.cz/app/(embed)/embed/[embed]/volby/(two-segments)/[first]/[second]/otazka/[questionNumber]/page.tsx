import type { Metadata } from "next";

import { QuestionPageWithRouting } from "../../../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../../../lib/metadata/calculator";
import { questionNumberGuard } from "../../../../../../../../../../lib/routing/guards/question-number";
import { canonical } from "../../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question({ first, second }, currentQuestionNumber);
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { embed, first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second, embed }} />;
}
