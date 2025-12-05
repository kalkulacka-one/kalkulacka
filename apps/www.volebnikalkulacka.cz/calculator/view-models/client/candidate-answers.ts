import { useMemo } from "react";

import type { CandidateAnswer } from "@/calculator";
import { type CandidatesAnswersViewModel, candidatesAnswersViewModel } from "@/calculator";
import { useCalculatorStore } from "@/calculator/client";

export function useCandidatesAnswers(): CandidatesAnswersViewModel {
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  return useMemo(() => {
    const filteredCandidatesAnswers: Record<string, CandidateAnswer[]> = {};

    for (const [candidateId, answers] of Object.entries(candidatesAnswers)) {
      filteredCandidatesAnswers[candidateId] = answers.filter((answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert");
    }

    return candidatesAnswersViewModel(filteredCandidatesAnswers);
  }, [candidatesAnswers]);
}
