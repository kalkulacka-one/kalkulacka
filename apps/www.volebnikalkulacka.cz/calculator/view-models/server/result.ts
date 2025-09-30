import type { calculateMatches } from "../../lib/result-calculation/calculate-matches";
import { sortingKeyGenerator } from "../../lib/utilities/sortingKeyGenerator";
import type { CandidateViewModel } from "./candidate";
import type { CandidateAnswerViewModel } from "./candidate-answer";
import type { CandidatesAnswersViewModel } from "./candidate-answers";

export type CandidateMatchViewModel = {
  candidate: CandidateViewModel;
  match?: number;
  order?: number;
  respondent: "candidate" | "expert" | "mixed";
  candidateAnswers: CandidateAnswerViewModel[];
  nestedMatches?: CandidateMatchViewModel[];
  sortKey?: number;
};

export type ResultViewModel = {
  matches: CandidateMatchViewModel[];
};

function sortByOrder<T extends { match?: number; sortKey?: number; order?: number }>(items: T[]): T[] {
  const sorted = items.sort((a, b) => {
    if (a.match !== b.match) {
      if (a.match === undefined) return 1;
      if (b.match === undefined) return -1;
      return b.match - a.match;
    }
    if (a.match === b.match && a.sortKey !== undefined && b.sortKey !== undefined) {
      return b.sortKey - a.sortKey;
    }
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  return sorted;
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
  candidates: CandidateViewModel[],
  candidatesAnswers: CandidatesAnswersViewModel,
  algorithmMatches: ReturnType<typeof calculateMatches>,
  sessionId: string,
): ResultViewModel {
  const candidatesAnswersMap = new Map(Object.entries(candidatesAnswers));

  const topLevelIds = candidates.map((candidate) => candidate.id);
  const topLevelAlgorithmMatches = algorithmMatches.filter((match) => topLevelIds.includes(match.id));

  const matches: CandidateMatchViewModel[] = candidates.map((candidate) => {
    const sortKey = sortingKeyGenerator(`${sessionId}${candidate.id}`)();
    const matchIndex = topLevelAlgorithmMatches.findIndex((match) => match.id === candidate.id);
    const match = matchIndex >= 0 ? topLevelAlgorithmMatches[matchIndex]?.match : undefined;

    const order = match !== undefined ? topLevelAlgorithmMatches.filter((match) => match.match !== undefined).findIndex((validMatch) => validMatch.id === candidate.id) + 1 : undefined;

    let nestedMatches: CandidateMatchViewModel[] | undefined;
    if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const nestedIds = candidate.nestedCandidates.map((nestedCandidate) => nestedCandidate.id);
      const nestedAlgorithmMatches = algorithmMatches.filter((match) => nestedIds.includes(match.id));

      nestedMatches = candidate.nestedCandidates.map((nestedCandidate) => {
        const sortKey = sortingKeyGenerator(`${sessionId}${nestedCandidate.id}`)();
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
          sortKey,
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
      sortKey: sortKey,
    };
  });

  const sortedMatches = sortByOrder(matches);

  // Recalculate order numbers after final sorting
  const matchesWithCorrectOrder = sortedMatches.map((match, index) => ({
    ...match,
    order: match.match !== undefined ? index + 1 : undefined,
  }));

  return { matches: matchesWithCorrectOrder };
}
