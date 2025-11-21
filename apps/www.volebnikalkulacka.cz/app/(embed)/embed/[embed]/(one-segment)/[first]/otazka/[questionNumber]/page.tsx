import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; questionNumber: string }> }): Promise<Metadata> {
  const { questionNumber, ...segments } = await routeParams;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.question(segments, currentQuestionNumber);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, embed }} />;
}
