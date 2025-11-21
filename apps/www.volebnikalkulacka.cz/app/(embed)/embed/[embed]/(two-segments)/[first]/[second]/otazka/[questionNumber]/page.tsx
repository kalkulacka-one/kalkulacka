import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams, questionNumberGuard } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { questionNumber, ...segments } = await routeParams;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question(segments, currentQuestionNumber);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { embed, first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second, embed }} />;
}
