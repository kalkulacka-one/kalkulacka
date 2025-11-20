import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question({ first }, currentQuestionNumber);
  return generateCalculatorMetadata({ key: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; questionNumber: string }> }) {
  const { first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first }} />;
}
