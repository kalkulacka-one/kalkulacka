import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { CandidateAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { aggregateMatchScore, calculateMatchScorePercentage } from "./ResultCalculator";

export function calculateAllMatches(userAnswers: Answer[], allCandidatesAnswers: CandidateAnswers) {
  const candidateIds = Object.keys(allCandidatesAnswers);

  const finalResults = candidateIds.map((id: string) => {
    const singleCandidateAnswers = allCandidatesAnswers[id];
    if (!singleCandidateAnswers) {
      return {
        candidateId: id,
        percentage: 0,
      };
    }
    const scoreObject = aggregateMatchScore(userAnswers, singleCandidateAnswers);

    return {
      candidateId: id,
      percentage: calculateMatchScorePercentage({ score: scoreObject.score, weight: scoreObject.weight }),
    };
  });

  if (finalResults) {
    return finalResults.sort((a, b) => b.percentage - a.percentage);
  }
}
