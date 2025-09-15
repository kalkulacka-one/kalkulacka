import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type CandidateAnswerViewModel, candidateAnswerViewModel } from "../server/candidate-answer";

export function useCandidateAnswer(candidateId: string, questionId: string): CandidateAnswerViewModel | undefined {
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  return useMemo(() => {
    const candidateAnswers = candidatesAnswers[candidateId];
    if (!candidateAnswers) return undefined;

    const answer = candidateAnswers.find((answer) => answer.questionId === questionId);
    return answer ? candidateAnswerViewModel(answer) : undefined;
  }, [candidatesAnswers, candidateId, questionId]);
}
