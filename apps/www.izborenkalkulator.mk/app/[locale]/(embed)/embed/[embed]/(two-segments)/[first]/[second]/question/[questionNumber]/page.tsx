import { questionNumberGuard } from "@kalkulacka-one/next";

import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; embed: string; first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { locale, questionNumber, ...segments } = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question(segments, currentQuestionNumber, locale);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { questionNumber, ...segments } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  return <QuestionPageWithRouting current={currentQuestionNumber} segments={segments} />;
}
