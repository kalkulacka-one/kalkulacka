import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAnswersStore, useCalculator, useResult } from "@/calculator/client";
import { PublicResultPage as AppPublicResultPage, type calculateMatches } from "@/calculator/server";
import { type RouteSegments, routes } from "@/lib/routing";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";

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
