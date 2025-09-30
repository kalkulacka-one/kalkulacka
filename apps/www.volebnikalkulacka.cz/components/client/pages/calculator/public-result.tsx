import { useEffect, useState } from "react";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import { PublicResultPage as AppPublicResultPage } from "../../../../calculator/components/server";
import type { calculateMatches } from "../../../../calculator/lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculator, useResult } from "../../../../calculator/view-models";

export function PublicResultPageWithData({ algorithmMatches, answers }: { algorithmMatches: ReturnType<typeof calculateMatches>; answers: Answer[] }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const calculator = useCalculator();
  const result = useResult(algorithmMatches, { showOnlyNested });
  const setAnswers = useAnswersStore((state) => state.setAnswers);

  useEffect(() => {
    setAnswers(answers);
  }, [answers, setAnswers]);

  const donateCardPosition = 5;

  return <AppPublicResultPage calculator={calculator} result={result} showOnlyNested={showOnlyNested} onFilterChange={setShowOnlyNested} donateCardPosition={donateCardPosition} />;
}
