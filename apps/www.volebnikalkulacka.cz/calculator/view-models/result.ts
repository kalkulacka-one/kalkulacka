import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { CandidatesAnswers } from "../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateMatches } from "../lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../stores/answers";
import { useCalculatorStore } from "../stores/calculator";
import { type CandidateViewModel, candidateViewModel } from "./candidate";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export type CandidateMatchViewModel = {
  candidate: CandidateViewModel;
  match?: number;
  order?: number;
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

function sortByMatchWithTieRandomization<T extends { order?: number; match?: number }>(items: T[]): T[] {
  const withMatch = items.filter((item): item is T & { match: number } => item.match !== undefined);
  const withoutMatch = items.filter((item) => item.match === undefined);
  
  // Group by match percentage
  const grouped = withMatch.reduce((acc, item) => {
    const key = item.match;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<number, (T & { match: number })[]>);

  // Sort groups by match percentage (descending) and shuffle ties
  const result: T[] = [];
  Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a) // Sort by match percentage descending
    .forEach(matchValue => {
      const group = grouped[matchValue];
      if (!group) return;
      
      const shuffledGroup = [...group];
      
      // Shuffle ties using Fisher-Yates algorithm
      if (shuffledGroup.length > 1) {
        for (let i = shuffledGroup.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffledGroup[i];
          const itemJ = shuffledGroup[j];
          if (temp && itemJ) {
            shuffledGroup[i] = itemJ;
            shuffledGroup[j] = temp;
          }
        }
      }
      result.push(...shuffledGroup);
    });

  // Randomize candidates with undefined matches
  const shuffledWithoutMatch = [...withoutMatch];
  if (shuffledWithoutMatch.length > 1) {
    for (let i = shuffledWithoutMatch.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledWithoutMatch[i];
      const itemJ = shuffledWithoutMatch[j];
      if (temp && itemJ) {
        shuffledWithoutMatch[i] = itemJ;
        shuffledWithoutMatch[j] = temp;
      }
    }
  }

  // Assign final order based on position after randomization
  // Only candidates with matches get order numbers
  const finalResultWithMatch = result.map((item, index) => ({
    ...item,
    order: index + 1
  }));

  // Candidates without matches keep their original order (undefined)
  const finalResultWithoutMatch = shuffledWithoutMatch.map((item) => ({
    ...item,
    order: undefined
  }));

  return [...finalResultWithMatch, ...finalResultWithoutMatch];
}

export function resultViewModel(answers: Answer[], candidates: CandidateViewModel[], candidatesAnswers: CandidatesAnswers): ResultViewModel {
  const algorithmMatches = calculateMatches(answers, candidates, candidatesAnswers);

  const topLevelIds = candidates.map((candidate) => candidate.id);
  const topLevelAlgorithmMatches = algorithmMatches.filter((match) => topLevelIds.includes(match.id));

  const matches: CandidateMatchViewModel[] = candidates.map((candidate) => {
    const matchIndex = topLevelAlgorithmMatches.findIndex((match) => match.id === candidate.id);
    const match = matchIndex >= 0 ? topLevelAlgorithmMatches[matchIndex]?.match : undefined;
    const order = matchIndex >= 0 ? matchIndex + 1 : undefined;

    let nestedMatches: CandidateMatchViewModel[] | undefined;
    if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const nestedIds = candidate.nestedCandidates.map((nestedCandidate) => nestedCandidate.id);
      const nestedAlgorithmMatches = algorithmMatches.filter((match) => nestedIds.includes(match.id));

      nestedMatches = candidate.nestedCandidates.map((nestedCandidate) => {
        const nestedMatchIndex = nestedAlgorithmMatches.findIndex((match) => match.id === nestedCandidate.id);
        const nestedMatch = nestedMatchIndex >= 0 ? nestedAlgorithmMatches[nestedMatchIndex]?.match : undefined;
        const nestedOrder = nestedMatchIndex >= 0 ? nestedMatchIndex + 1 : undefined;

        return {
          candidate: nestedCandidate,
          match: nestedMatch,
          order: nestedOrder,
        };
      });

      nestedMatches = sortByMatchWithTieRandomization(nestedMatches);
    }

    return {
      candidate,
      match,
      order,
      nestedMatches,
    };
  });

  return { matches: sortByMatchWithTieRandomization(matches) };
}

export function useResultViewModel(options?: { showOnlyNested?: boolean }): ResultViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const allCandidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  const personsMap = useMemo(() => new Map(persons.map((person) => [person.id, personViewModel(person)])), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations.map((organization) => [organization.id, organizationViewModel(organization)])), [organizations]);

  const candidates = options?.showOnlyNested ? allCandidates.flatMap((candidate) => candidate.nestedCandidates || []) : allCandidates;

  const candidateViewModels = useMemo(() => candidates.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap)), [candidates, personsMap, organizationsMap]);

  return useMemo(() => resultViewModel(answers, candidateViewModels, candidatesAnswers), [answers, candidateViewModels, candidatesAnswers]);
}
