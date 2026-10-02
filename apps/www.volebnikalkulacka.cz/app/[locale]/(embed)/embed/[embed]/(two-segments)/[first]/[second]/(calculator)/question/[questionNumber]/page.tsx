import { questionNumberGuard } from "@kalkulacka-one/next";
import { generateCalculatorMetadata } from "@kalkulacka-one/next/metadata";

import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { QuestionPageWithRouting } from "@/components/client";
import { canonical, mappedParams } from "@/lib/routing";

// Each dynamic segment needs its own empty `generateStaticParams` to stay on-demand ISR – `revalidate` comes from the calculator layout.
export function generateStaticParams() {
  return [];
}

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
