import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical } from "@/lib/routing";
import { questionNumberGuard } from "@/lib/routing/guards/question-number";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, second, third, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question({ first, second, third }, currentQuestionNumber);
  return generateCalculatorMetadata({ key: second, group: third, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; questionNumber: string }> }) {
  const { first, second, third, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second, third }} />;
}
