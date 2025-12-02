import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { PublicResultPage as AppPublicResultPage } from "@/calculator/components/server";
import type { calculateMatches } from "@/calculator/result-calculation";
import { useAnswersStore } from "@/calculator/stores";
import { useCalculator, useResult } from "@/calculator/view-models/client";
import { type RouteSegments, routes } from "@/lib/routing";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";

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
