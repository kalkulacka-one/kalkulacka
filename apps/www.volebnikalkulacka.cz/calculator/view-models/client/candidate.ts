import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { useAnswersStore } from "../../stores/answers";
import { type AnswerComparison, type CandidateViewModel, candidateViewModel, getCandidateAnswerComparison, hasDirectAnswers } from "../server/candidate";
import { organizationViewModel } from "../server/organization";
import { personViewModel } from "../server/person";

export function useCandidate(id: string): CandidateViewModel | undefined {
  const candidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o)]) ?? []), [organizations]);

  return useMemo(() => {
    const candidate = candidates.find((candidate) => candidate.id === id);
    return candidate ? candidateViewModel(candidate, personsMap, organizationsMap) : undefined;
  }, [candidates, personsMap, organizationsMap, id]);
}

export function useCandidateAnswerComparison(candidateId: string): AnswerComparison[] {
  const userAnswers = useAnswersStore((state) => state.answers);
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);
  const questions = useCalculatorStore((state) => state.questions);

  return useMemo(() => {
    return getCandidateAnswerComparison(candidateId, userAnswers, candidatesAnswers, questions);
  }, [candidateId, userAnswers, candidatesAnswers, questions]);
}

export function useHasDirectAnswers(candidateId: string): boolean {
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  return useMemo(() => {
    return hasDirectAnswers(candidateId, candidatesAnswers);
  }, [candidateId, candidatesAnswers]);
}
