import { useMemo } from "react";

import { useAnswersStore } from "../../stores/answers";
import { useCalculatorStore } from "../../stores/calculator";
import { candidateViewModel } from "../server/candidate";
import type { CandidateAnswer } from "../server/candidate-answer";
import { candidatesAnswersViewModel } from "../server/candidate-answers";
import { organizationViewModel } from "../server/organization";
import { personViewModel } from "../server/person";
import { type ResultViewModel, resultViewModel } from "../server/result";

export function useResult(options?: { showOnlyNested?: boolean }): ResultViewModel {
  const answersData = useAnswersStore((state) => state.answers);
  const allCandidatesData = useCalculatorStore((state) => state.candidates);
  const personsData = useCalculatorStore((state) => state.persons);
  const organizationsData = useCalculatorStore((state) => state.organizations);
  const candidatesAnswersData = useCalculatorStore((state) => state.candidatesAnswers);

  const personsMap = useMemo(() => new Map(personsData?.map((person) => [person.id, personViewModel(person)]) ?? []), [personsData]);
  const organizationsMap = useMemo(() => new Map(organizationsData?.map((organization) => [organization.id, organizationViewModel(organization)]) ?? []), [organizationsData]);
  const filteredCandidatesAnswersData = useMemo(() => {
    const filtered: Record<string, CandidateAnswer[]> = {};

    for (const [candidateId, answers] of Object.entries(candidatesAnswersData)) {
      filtered[candidateId] = answers.filter((answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert" || answer.respondent === undefined);
    }

    return filtered;
  }, [candidatesAnswersData]);

  const candidatesData = options?.showOnlyNested ? allCandidatesData.flatMap((candidate) => candidate.nestedCandidates || []) : allCandidatesData;

  const candidates = useMemo(() => candidatesData.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap)), [candidatesData, personsMap, organizationsMap]);

  const candidatesAnswers = useMemo(() => candidatesAnswersViewModel(filteredCandidatesAnswersData), [filteredCandidatesAnswersData]);

  return useMemo(() => resultViewModel(answersData, candidates, candidatesAnswers, filteredCandidatesAnswersData), [answersData, candidates, candidatesAnswers, filteredCandidatesAnswersData]);
}
