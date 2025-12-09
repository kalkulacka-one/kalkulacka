import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; first: string; questionNumber: string }> }): Promise<Metadata> {
  const { locale, questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.question(segments, currentQuestionNumber, locale);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; questionNumber: string }> }) {
  const { questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  return <QuestionPageWithRouting current={currentQuestionNumber} segments={segments} />;
}
