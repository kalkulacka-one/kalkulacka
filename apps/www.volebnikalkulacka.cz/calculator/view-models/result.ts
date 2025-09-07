import { calculateMatches, createSeededRNG } from "../lib/result-calculation/calculate-matches";
import { useAnswersStore } from "../stores/answers";
import { useCalculatorStore } from "../stores/calculator";
import type { CandidateViewModel } from "./candidate";
import { useCandidatesViewModel } from "./candidates";

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

export function useResultViewModel(): ResultViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const candidates = useCandidatesViewModel();
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);

  const seed = candidates
    .map((c) => c.id)
    .join("")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rng = createSeededRNG(seed);

  const algorithmMatches = calculateMatches(answers, candidates, candidatesAnswers, rng);

  const topLevelIds = candidates.map((c) => c.id);
  const topLevelAlgorithmMatches = algorithmMatches.filter((match) => topLevelIds.includes(match.id));

  const matches: CandidateMatchViewModel[] = candidates.map((candidate) => {
    const matchIndex = topLevelAlgorithmMatches.findIndex((m) => m.id === candidate.id);
    const match = matchIndex >= 0 ? topLevelAlgorithmMatches[matchIndex]?.match : undefined;
    const order = matchIndex >= 0 ? matchIndex + 1 : undefined;

    let nestedMatches: CandidateMatchViewModel[] | undefined;
    if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const nestedIds = candidate.nestedCandidates.map((nc) => nc.id);
      const nestedAlgorithmMatches = algorithmMatches.filter((match) => nestedIds.includes(match.id));

      nestedMatches = candidate.nestedCandidates.map((nestedCandidate) => {
        const nestedMatchIndex = nestedAlgorithmMatches.findIndex((m) => m.id === nestedCandidate.id);
        const nestedMatch = nestedMatchIndex >= 0 ? nestedAlgorithmMatches[nestedMatchIndex]?.match : undefined;
        const nestedOrder = nestedMatchIndex >= 0 ? nestedMatchIndex + 1 : undefined;

        return {
          candidate: nestedCandidate,
          match: nestedMatch,
          order: nestedOrder,
        };
      });

      nestedMatches = sortByOrder(nestedMatches);
    }

    return {
      candidate,
      match,
      order,
      nestedMatches,
    };
  });

  return { matches: sortByOrder(matches) };
}
