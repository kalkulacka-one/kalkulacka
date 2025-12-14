import { type CandidateAnswer, type CandidatesAnswersViewModel, candidatesAnswersViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

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
