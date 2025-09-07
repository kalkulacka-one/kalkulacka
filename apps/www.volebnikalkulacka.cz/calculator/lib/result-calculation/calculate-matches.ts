import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../.././../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { aggregateAnswersMatchScore } from "./aggregate-answers-match-score";
import { calculateMatchScorePercentage } from "./calculate-match-score-percentage";

export function calculateMatches(userAnswers: Answers, candidates: Candidates, allCandidatesAnswers: CandidatesAnswers, useRandomTieBreaker: boolean = false) {
  const finalResults = [];

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
  return finalResults.sort((a, b) => {
    // Handle potentially undefined matches
    const bMatch = b.match ?? -1;
    const aMatch = a.match ?? -1;

    if (bMatch !== aMatch) {
      return bMatch - aMatch;
    }
    // Tie-breaker: random if enabled, otherwise deterministic by ID
    return useRandomTieBreaker ? Math.random() - 0.5 : a.id.localeCompare(b.id);
  });
}
