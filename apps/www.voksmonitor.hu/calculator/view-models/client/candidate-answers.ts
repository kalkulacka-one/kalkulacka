import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import type { CandidateAnswer } from "../server/candidate-answer";
import { type CandidatesAnswersViewModel, candidatesAnswersViewModel } from "../server/candidate-answers";

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
