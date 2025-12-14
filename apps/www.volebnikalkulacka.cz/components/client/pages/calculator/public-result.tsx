import type { calculateMatches } from "@kalkulacka-one/app";
import type { Answer } from "@kalkulacka-one/schema";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { PublicResultPage as AppPublicResultPage } from "@/calculator";
import { useCalculator, useResult } from "@/calculator/client";
import { useAnswersStore } from "@kalkulacka-one/app/client";
import { type RouteSegments, routes } from "@/lib/routing";

export function PublicResultPageWithData({ algorithmMatches, answers, segments }: { algorithmMatches: ReturnType<typeof calculateMatches>; answers: Answer[]; segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const result = useResult(algorithmMatches, { showOnlyNested });
  const setAnswers = useAnswersStore((state) => state.setAnswers);
  const locale = useLocale();

  useEffect(() => {
    setAnswers(answers);
  }, [answers, setAnswers]);

  const handleStartCalculator = () => {
    router.push(routes.introduction(segments, locale));
  };

  return <AppPublicResultPage calculator={calculator} result={result} showOnlyNested={showOnlyNested} onFilterChange={setShowOnlyNested} onStartCalculator={handleStartCalculator} />;
}
