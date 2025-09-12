import { useMemo } from "react";

import { useCalculatorStore } from "../stores";
import { type CandidateAnswer, type CandidateAnswerViewModel, candidateAnswerViewModel } from "./candidate-answer";

export type CandidatesAnswersViewModel = Record<string, CandidateAnswerViewModel[]>;

export function candidatesAnswersViewModel(candidatesAnswers: Record<string, CandidateAnswer[]>): CandidatesAnswersViewModel {
  const viewModel: CandidatesAnswersViewModel = {};

  for (const [candidateId, answers] of Object.entries(candidatesAnswers)) {
    viewModel[candidateId] = answers.map(candidateAnswerViewModel);
  }

  return viewModel;
}

export function useCandidatesAnswers(): CandidatesAnswersViewModel {
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);
  return useMemo(() => {
    const filteredCandidatesAnswers: Record<string, CandidateAnswer[]> = {};

    for (const [candidateId, answers] of Object.entries(candidatesAnswers)) {
      filteredCandidatesAnswers[candidateId] = answers.filter((answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert");
    }

    return candidatesAnswersViewModel(filteredCandidatesAnswers);
  }, [candidatesAnswers]);
}
