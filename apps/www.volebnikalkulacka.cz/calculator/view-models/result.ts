import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { calculateMatches } from "../lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../stores/answers";
import { useCalculatorStore } from "../stores/calculator";
import { type CandidateViewModel, candidateViewModel } from "./candidate";
import type { CandidateAnswer, CandidateAnswerViewModel } from "./candidate-answer";
import { type CandidatesAnswersViewModel, candidatesAnswersViewModel } from "./candidate-answers";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export type CandidateMatchViewModel = {
  candidate: CandidateViewModel;
  match?: number;
  order?: number;
  respondent: "candidate" | "expert" | "mixed";
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

function getRespondentValue(candidateId: string, candidatesAnswersMap: Map<string, CandidateAnswerViewModel[]>): "candidate" | "expert" | "mixed" {
  const answers = candidatesAnswersMap.get(candidateId);

  if (!answers?.length) return "candidate";

  const respondents = new Set(answers.map((answer) => answer.respondent));

  if (respondents.size > 1) {
    return "mixed";
  }
  return respondents.values().next().value ?? "candidate";
}

export function resultViewModel(
  answers: Answer[],
  candidates: CandidateViewModel[],
  candidatesAnswers: CandidatesAnswersViewModel,
  candidatesAnswersData: Record<string, CandidateAnswer[]>,
): ResultViewModel {
  const candidatesAnswersMap = new Map(Object.entries(candidatesAnswers));
  const algorithmMatches = calculateMatches(answers, candidates, candidatesAnswersData);

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
          respondent: getRespondentValue(nestedCandidate.id, candidatesAnswersMap),
          candidateAnswers: candidatesAnswersMap.get(nestedCandidate.id) || [],
        };
      });

      nestedMatches = sortByOrder(nestedMatches);
    }

    return {
      candidate,
      match,
      order,
      respondent: getRespondentValue(candidate.id, candidatesAnswersMap),
      candidateAnswers: candidatesAnswersMap.get(candidate.id) || [],
      nestedMatches,
    };
  });

  return { matches: sortByOrder(matches) };
}

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
