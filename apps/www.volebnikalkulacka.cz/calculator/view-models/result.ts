import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { calculateMatches } from "../lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../stores/answers";
import { useCalculatorStore } from "../stores/calculator";
import { type CandidateViewModel, candidateViewModel } from "./candidate";
import { type CandidateAnswersViewModel, type CandidateAnswerViewModel, candidateAnswersViewModel } from "./candidate-answers";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export type CandidateMatchViewModel = {
  candidate: CandidateViewModel;
  match?: number;
  order?: number;
  candidateAnswers: CandidateAnswerViewModel[];
  nestedMatches?: CandidateMatchViewModel[];
};

export type ResultViewModel = {
  matches: CandidateMatchViewModel[];
};

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  const withOrder = items.filter((item): item is T & { order: number } => item.order !== undefined);
  const withoutOrder = items.filter((item) => item.order === undefined);
  withOrder.sort((a, b) => a.order - b.order);
  return [...withOrder, ...withoutOrder];
}

export function resultViewModel(
  answers: Answer[],
  candidates: CandidateViewModel[],
  candidatesAnswers: CandidateAnswersViewModel,
  candidatesAnswersMap: Map<string, CandidateAnswerViewModel[]>,
): ResultViewModel {
  const algorithmMatches = calculateMatches(answers, candidates, candidatesAnswers);

  const topLevelIds = candidates.map((candidate) => candidate.id);
  const topLevelAlgorithmMatches = algorithmMatches.filter((match) => topLevelIds.includes(match.id));

  const matches: CandidateMatchViewModel[] = candidates.map((candidate) => {
    const matchIndex = topLevelAlgorithmMatches.findIndex((match) => match.id === candidate.id);
    const match = matchIndex >= 0 ? topLevelAlgorithmMatches[matchIndex]?.match : undefined;

    const order = match !== undefined ? topLevelAlgorithmMatches.filter((match) => match.match !== undefined).findIndex((validMatch) => validMatch.id === candidate.id) + 1 : undefined;

    let nestedMatches: CandidateMatchViewModel[] | undefined;
    if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const nestedIds = candidate.nestedCandidates.map((nestedCandidate) => nestedCandidate.id);
      const nestedAlgorithmMatches = algorithmMatches.filter((match) => nestedIds.includes(match.id));

      nestedMatches = candidate.nestedCandidates.map((nestedCandidate) => {
        const nestedMatchIndex = nestedAlgorithmMatches.findIndex((match) => match.id === nestedCandidate.id);
        const nestedMatch = nestedMatchIndex >= 0 ? nestedAlgorithmMatches[nestedMatchIndex]?.match : undefined;

        const nestedOrder =
          nestedMatch !== undefined ? nestedAlgorithmMatches.filter((match) => match.match !== undefined).findIndex((validMatch) => validMatch.id === nestedCandidate.id) + 1 : undefined;

        return {
          candidate: nestedCandidate,
          match: nestedMatch,
          order: nestedOrder,
          candidateAnswers: candidatesAnswersMap.get(nestedCandidate.id) || [],
        };
      });

      nestedMatches = sortByOrder(nestedMatches);
    }

    return {
      candidate,
      match,
      order,
      candidateAnswers: candidatesAnswersMap.get(candidate.id) || [],
      nestedMatches,
    };
  });

  return { matches: sortByOrder(matches) };
}

export function useResultViewModel(options?: { showOnlyNested?: boolean }): ResultViewModel {
  const answersData = useAnswersStore((state) => state.answers);
  const allCandidatesData = useCalculatorStore((state) => state.candidates);
  const personsData = useCalculatorStore((state) => state.persons);
  const organizationsData = useCalculatorStore((state) => state.organizations);
  const candidatesAnswersData = useCalculatorStore((state) => state.candidatesAnswers);

  const personsMap = useMemo(() => new Map(personsData?.map((person) => [person.id, personViewModel(person)]) ?? []), [personsData]);
  const organizationsMap = useMemo(() => new Map(organizationsData?.map((organization) => [organization.id, organizationViewModel(organization)]) ?? []), [organizationsData]);
  const candidatesAnswersMap = useMemo(() => {
    const candidatesAnswers = candidateAnswersViewModel(candidatesAnswersData);
    return new Map(Object.entries(candidatesAnswers));
  }, [candidatesAnswersData]);

  const candidatesData = options?.showOnlyNested ? allCandidatesData.flatMap((candidate) => candidate.nestedCandidates || []) : allCandidatesData;

  const candidates = useMemo(() => candidatesData.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap)), [candidatesData, personsMap, organizationsMap]);

  const candidatesAnswers = useMemo(() => candidateAnswersViewModel(candidatesAnswersData), [candidatesAnswersData]);

  return useMemo(() => resultViewModel(answersData, candidates, candidatesAnswers, candidatesAnswersMap), [answersData, candidates, candidatesAnswers, candidatesAnswersMap]);
}
