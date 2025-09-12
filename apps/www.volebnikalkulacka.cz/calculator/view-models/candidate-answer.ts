import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { useCalculatorStore } from "../stores";

export type CandidateAnswer = Omit<Answer, "respondent"> & {
  respondent?: "candidate" | "expert";
};

export type CandidateAnswerViewModel = Omit<Answer, "respondent"> & {
  respondent: "candidate" | "expert";
};

export function candidateAnswerViewModel(answer: CandidateAnswer): CandidateAnswerViewModel {
  return {
    ...answer,
    respondent: answer.respondent ?? "candidate",
  };
}

export function useCandidateAnswer(candidateId: string, questionId: string): CandidateAnswerViewModel | undefined {
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  return useMemo(() => {
    const candidateAnswers = candidatesAnswers[candidateId];
    if (!candidateAnswers) return undefined;

    const answer = candidateAnswers.find((answer) => answer.questionId === questionId);
    return answer ? candidateAnswerViewModel(answer) : undefined;
  }, [candidatesAnswers, candidateId, questionId]);
}
