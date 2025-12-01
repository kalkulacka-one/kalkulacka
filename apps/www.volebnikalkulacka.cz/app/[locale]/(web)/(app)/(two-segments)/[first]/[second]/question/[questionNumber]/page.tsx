import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { locale, questionNumber, ...segments } = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question(segments, currentQuestionNumber, locale);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }) {
  const { questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  return <QuestionPageWithRouting current={currentQuestionNumber} segments={segments} />;
}
