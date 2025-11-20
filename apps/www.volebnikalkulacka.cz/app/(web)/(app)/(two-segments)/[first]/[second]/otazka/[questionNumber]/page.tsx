import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, isAllowedPrefix, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question({ first, second }, currentQuestionNumber);

  if (isAllowedPrefix(first)) {
    return generateCalculatorMetadata({ key: second, canonicalUrl });
  }
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }) {
  const { first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second }} />;
}
