import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import { PublicResultPage as AppPublicResultPage } from "../../../../calculator/components/server";
import type { calculateMatches } from "../../../../calculator/lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculator, useResult } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function PublicResultPageWithData({ algorithmMatches, answers, segments }: { algorithmMatches: ReturnType<typeof calculateMatches>; answers: Answer[]; segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const result = useResult(algorithmMatches, { showOnlyNested });
  const setAnswers = useAnswersStore((state) => state.setAnswers);

  useEffect(() => {
    setAnswers(answers);
  }, [answers, setAnswers]);

  const handleStartCalculator = () => {
    router.push(routes.introduction(segments));
  };

  return <AppPublicResultPage calculator={calculator} result={result} showOnlyNested={showOnlyNested} onFilterChange={setShowOnlyNested} onStartCalculator={handleStartCalculator} />;
}
