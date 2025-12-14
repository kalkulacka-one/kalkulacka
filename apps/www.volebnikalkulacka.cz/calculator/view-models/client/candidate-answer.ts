import { type CandidateAnswerViewModel, candidateAnswerViewModel } from "@kalkulacka-one/app";

import { useMemo } from "react";

import { useCalculatorStore } from "@kalkulacka-one/app/client";

export function useCandidateAnswer(candidateId: string, questionId: string): CandidateAnswerViewModel | undefined {
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);

  return useMemo(() => {
    const candidateAnswers = candidatesAnswers[candidateId];
    if (!candidateAnswers) return undefined;

    const answer = candidateAnswers.find((answer) => answer.questionId === questionId);
    return answer ? candidateAnswerViewModel(answer) : undefined;
  }, [candidatesAnswers, candidateId, questionId]);
}
