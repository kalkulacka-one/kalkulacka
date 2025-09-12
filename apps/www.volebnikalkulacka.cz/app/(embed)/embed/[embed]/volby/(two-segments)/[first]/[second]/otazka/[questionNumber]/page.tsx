import type { Metadata } from "next";

import { QuestionPageWithRouting } from "../../../../../../../../../../components/client";
import { generateCanonicalMetadata } from "../../../../../../../../../../lib/metadata/canonical";
import { questionNumberGuard } from "../../../../../../../../../../lib/routing/guards/question-number";
import { canonical } from "../../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }): Promise<Metadata> {
  const { first, second, questionNumber } = await params;
  return generateCanonicalMetadata(canonical.question({ first, second }, Number(questionNumber)));
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { embed, first, second, questionNumber } = await params;
  const currentQuestionNumber = questionNumberGuard(questionNumber);

  return <QuestionPageWithRouting current={currentQuestionNumber} segments={{ first, second, embed }} />;
}
