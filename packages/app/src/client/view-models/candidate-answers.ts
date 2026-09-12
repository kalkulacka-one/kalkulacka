import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type CandidateAnswer, type CandidatesAnswersViewModel, candidatesAnswersViewModel } from "@/view-models";

export function useCandidatesAnswers(): CandidatesAnswersViewModel {
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  return useMemo(() => {
    const filteredCandidatesAnswers: Record<string, CandidateAnswer[]> = {};

    for (const [candidateId, answers] of Object.entries(candidatesAnswers)) {
      // The same answers `useResult` scores the ranking on: an answer with no
      // `respondent` is the candidate's own (the data leaves the field out for
      // most parties), and dropping it left the dashboard counting only the
      // parties an expert had filled in — "Souhlasí 1 z 2 stran" beside a
      // ranking of 23.
      filteredCandidatesAnswers[candidateId] = answers.filter(
        (answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert" || answer.respondent === undefined,
      );
    }

    return candidatesAnswersViewModel(filteredCandidatesAnswers);
  }, [candidatesAnswers]);
}
