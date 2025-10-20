import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../.././../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { stringHash } from "../utilities";
import { aggregateAnswersMatchScore } from "./aggregate-answers-match-score";
import { calculateMatchScorePercentage } from "./calculate-match-score-percentage";

export function calculateMatches(userAnswers: Answers, candidates: Candidates, allCandidatesAnswers: CandidatesAnswers, tieBreakerSeed?: string, useRandomTieBreaker: boolean = false) {
  const finalResults: Array<{ id: string; match: number | undefined }> = [];

  const allCandidatesAnswersId = Object.keys(allCandidatesAnswers);
  for (const candidate of candidates) {
    if (allCandidatesAnswersId.includes(candidate.id)) {
      const candidateAnswers = allCandidatesAnswers[candidate.id];
      if (candidateAnswers) {
        const scoreObject = aggregateAnswersMatchScore(userAnswers, candidateAnswers);
        const match = calculateMatchScorePercentage(scoreObject);
        finalResults.push({
          id: candidate.id,
          match,
        });
      }

      // Also process nested candidates if they exist and have answers
      if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
        for (const member of candidate.nestedCandidates) {
          if (allCandidatesAnswersId.includes(member.id)) {
            const memberAnswers = allCandidatesAnswers[member.id];
            if (memberAnswers) {
              const scoreObject = aggregateAnswersMatchScore(userAnswers, memberAnswers);
              const match = calculateMatchScorePercentage(scoreObject);
              finalResults.push({
                id: member.id,
                match,
              });
            }
          }
        }
      }
    } else if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const memberResults = [];

      for (const member of candidate.nestedCandidates) {
        const memberAnswers = allCandidatesAnswers[member.id] || [];
        const scoreObject = aggregateAnswersMatchScore(userAnswers, memberAnswers);
        const match = calculateMatchScorePercentage(scoreObject);

        memberResults.push({
          id: member.id,
          match,
        });
        finalResults.push({
          id: member.id,
          match,
        });
      }

      const combinedAnswers = candidate.nestedCandidates.flatMap((member) => allCandidatesAnswers[member.id] || []);
      const scoreObject = aggregateAnswersMatchScore(userAnswers, combinedAnswers);
      const match = calculateMatchScorePercentage(scoreObject);

      // Add the parent result without memberResults to match the test expectation
      finalResults.push({
        id: candidate.id,
        match,
      });
    }
  }

  const matchGroups = new Map<number | undefined, number>();
  for (const result of finalResults) {
    matchGroups.set(result.match, (matchGroups.get(result.match) || 0) + 1);
  }

  return finalResults.sort((a, b) => {
    // Handle potentially undefined matches
    const bMatch = b.match ?? -1;
    const aMatch = a.match ?? -1;

    if (bMatch !== aMatch) {
      return bMatch - aMatch;
    }

    if (useRandomTieBreaker) {
      return Math.random() - 0.5;
    }

    if (tieBreakerSeed) {
      const candidatesWithSameScore = matchGroups.get(a.match) || 0;

      if (candidatesWithSameScore > 1) {
        const HASH_MODULUS = 1000000007;

        const aSortKey = (stringHash(a.id) * stringHash(tieBreakerSeed)) % HASH_MODULUS;
        const bSortKey = (stringHash(b.id) * stringHash(tieBreakerSeed)) % HASH_MODULUS;

        return bSortKey - aSortKey;
      }
    }

    return a.id.localeCompare(b.id);
  });
}
