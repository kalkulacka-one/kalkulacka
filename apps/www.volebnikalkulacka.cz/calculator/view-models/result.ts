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
  respondent: string;
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

function getRespondentValue(candidateId: string, candidatesAnswers: CandidatesAnswers): string {
  const candidateAnswers = candidatesAnswers[candidateId];

  if (!candidateAnswers || candidateAnswers.length === 0) {
    return "candidate";
  }

  const respondentValues = new Set<string>();

  for (const answer of candidateAnswers) {
    const respondent = answer.respondent || "candidate";
    respondentValues.add(respondent);
  }

  if (respondentValues.size > 1) {
    return "mixed";
  }

  return Array.from(respondentValues)[0] || "candidate";
}

export function resultViewModel(answers: Answer[], candidates: CandidateViewModel[], candidatesAnswers: CandidatesAnswers): ResultViewModel {
  const algorithmMatches = calculateMatches(answers, candidates, candidatesAnswers);

  const topLevelIds = candidates.map((candidate) => candidate.id);
  const topLevelAlgorithmMatches = algorithmMatches.filter((match) => topLevelIds.includes(match.id));

  const matches: CandidateMatchViewModel[] = candidates.map((candidate) => {
    const matchIndex = topLevelAlgorithmMatches.findIndex((match) => match.id === candidate.id);
    const match = matchIndex >= 0 ? topLevelAlgorithmMatches[matchIndex]?.match : undefined;

    const order = match !== undefined ? topLevelAlgorithmMatches.filter((match) => match.match !== undefined).findIndex((validMatch) => validMatch.id === candidate.id) + 1 : undefined;

    const respondent = getRespondentValue(candidate.id, candidatesAnswers);

    let nestedMatches: CandidateMatchViewModel[] | undefined;
    if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const nestedIds = candidate.nestedCandidates.map((nestedCandidate) => nestedCandidate.id);
      const nestedAlgorithmMatches = algorithmMatches.filter((match) => nestedIds.includes(match.id));

      nestedMatches = candidate.nestedCandidates.map((nestedCandidate) => {
        const nestedMatchIndex = nestedAlgorithmMatches.findIndex((match) => match.id === nestedCandidate.id);
        const nestedMatch = nestedMatchIndex >= 0 ? nestedAlgorithmMatches[nestedMatchIndex]?.match : undefined;

        const nestedOrder =
          nestedMatch !== undefined ? nestedAlgorithmMatches.filter((match) => match.match !== undefined).findIndex((validMatch) => validMatch.id === nestedCandidate.id) + 1 : undefined;

        const nestedRespondent = getRespondentValue(nestedCandidate.id, candidatesAnswers);

        return {
          candidate: nestedCandidate,
          match: nestedMatch,
          order: nestedOrder,
          respondent: nestedRespondent,
        };
      });

      nestedMatches = nestedMatches ? sortByOrder(nestedMatches) : undefined;
    }

    return {
      candidate,
      match,
      order,
      respondent,
      nestedMatches,
    };
  });

  return { matches: sortByOrder(matches) };
}

export function useResultViewModel(options?: { showOnlyNested?: boolean }): ResultViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const allCandidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  const personsMap = useMemo(() => new Map(persons?.map((person) => [person.id, personViewModel(person)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((organization) => [organization.id, organizationViewModel(organization)]) ?? []), [organizations]);

  const candidates = options?.showOnlyNested ? allCandidates.flatMap((candidate) => candidate.nestedCandidates || []) : allCandidates;

  const candidateViewModels = useMemo(() => candidates.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap)), [candidates, personsMap, organizationsMap]);

  return useMemo(() => resultViewModel(answers, candidateViewModels, candidatesAnswers), [answers, candidateViewModels, candidatesAnswers]);
}
