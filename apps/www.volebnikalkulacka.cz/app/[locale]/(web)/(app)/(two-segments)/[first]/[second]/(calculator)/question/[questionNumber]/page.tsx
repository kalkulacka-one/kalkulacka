import { questionNumberGuard } from "@kalkulacka-one/next";

import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { QuestionPageWithRouting } from "@/components/client";
import { calculatorMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { locale, questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  return calculatorMetadata.question(segments, currentQuestionNumber, locale);
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }) {
  const { questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  return <QuestionPageWithRouting current={currentQuestionNumber} segments={segments} />;
}
