import { useAnswers, useCalculatedMatches, useCalculator, useQuestions, useResult } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { ComparisonPage } from "@/calculator";
import { useEmbed } from "@/components/client";
import { type RouteSegments, routes } from "@/lib/routing";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches);
  const answers = useAnswers();
  const questions = useQuestions();
  const embed = useEmbed();
  const locale = useLocale();

  const handlePreviousClick = () => {
    router.push(routes.result(segments, locale));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return <ComparisonPage embedContext={embed} calculator={calculator} result={result} answers={answers} questions={questions} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} />;
}
