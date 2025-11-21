import { useMemo } from "react";

import { calculateMatches } from "@/calculator/result-calculation";
import { useAnswersStore, useCalculatorStore } from "@/calculator/stores";
import type { CandidateAnswer } from "@/calculator/view-models/server";
import { candidatesAnswersViewModel, candidateViewModel, organizationViewModel, personViewModel, type ResultViewModel, resultViewModel } from "@/calculator/view-models/server";
import { getRuntimeSessionId } from "@/lib/session/client";

export function useCalculatedMatches(): ReturnType<typeof calculateMatches> {
  const answersData = useAnswersStore((state) => state.answers);
  const allCandidatesData = useCalculatorStore((state) => state.data.candidates);
  const candidatesAnswersData = useCalculatorStore((state) => state.data.candidatesAnswers);

  return useMemo(() => {
    const sessionId = getRuntimeSessionId();
    return calculateMatches(answersData, allCandidatesData, candidatesAnswersData, sessionId);
  }, [answersData, allCandidatesData, candidatesAnswersData]);
}

export function useResult(algorithmMatches: ReturnType<typeof calculateMatches>, options?: { showOnlyNested?: boolean }): ResultViewModel {
  const allCandidatesData = useCalculatorStore((state) => state.data.candidates);
  const personsData = useCalculatorStore((state) => state.data.persons);
  const organizationsData = useCalculatorStore((state) => state.data.organizations);
  const candidatesAnswersData = useCalculatorStore((state) => state.data.candidatesAnswers);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  const personsMap = useMemo(() => new Map(personsData?.map((person) => [person.id, personViewModel(person, baseUrl)]) ?? []), [personsData, baseUrl]);
  const organizationsMap = useMemo(() => new Map(organizationsData?.map((organization) => [organization.id, organizationViewModel(organization, baseUrl)]) ?? []), [organizationsData, baseUrl]);
  const filteredCandidatesAnswersData = useMemo(() => {
    const filtered: Record<string, CandidateAnswer[]> = {};

    for (const [candidateId, answers] of Object.entries(candidatesAnswersData)) {
      filtered[candidateId] = answers.filter((answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert" || answer.respondent === undefined);
    }

    return filtered;
  }, [candidatesAnswersData]);

  const candidatesData = options?.showOnlyNested ? allCandidatesData.flatMap((candidate) => candidate.nestedCandidates || []) : allCandidatesData;

  const candidates = useMemo(() => candidatesData.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap, baseUrl)), [candidatesData, personsMap, organizationsMap, baseUrl]);

  const candidatesAnswers = useMemo(() => candidatesAnswersViewModel(filteredCandidatesAnswersData), [filteredCandidatesAnswersData]);

  return useMemo(() => resultViewModel(candidates, candidatesAnswers, algorithmMatches), [candidates, candidatesAnswers, algorithmMatches]);
}
