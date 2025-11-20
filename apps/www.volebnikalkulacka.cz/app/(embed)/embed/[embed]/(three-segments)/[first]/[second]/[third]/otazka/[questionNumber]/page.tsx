import type { Metadata } from "next";

import { QuestionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, questionNumberGuard } , getThreeSegmentMetadataParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, second, third, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);
  const canonicalUrl = canonical.question({ first, second, third }, currentQuestionNumber);
  const metadataParams = getThreeSegmentMetadataParams(first, second, third);
  return generateCalculatorMetadata({ ...metadataParams, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; third: string; questionNumber: string }> }) {
  const { embed, first, second, third, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second, third, embed }} />;
}
