import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../.././../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { aggregateAnswersMatchScore } from "./aggregateAnswersMatchScore";
import { calculateMatchScorePercentage } from "./calculateMatchScorePercentage";

export function calculateResult(userAnswers: Answers, candidates: Candidates, allCandidatesAnswers: CandidatesAnswers) {
  const finalResults = [];

  const allCandidatesAnswersId = Object.keys(allCandidatesAnswers);
  for (const candidate of candidates) {
    if (allCandidatesAnswersId.includes(candidate.id)) {
      const candidateAnswers = allCandidatesAnswers[candidate.id];
      if (candidateAnswers) {
        const scoreObject = aggregateAnswersMatchScore(userAnswers, candidateAnswers);
        const percentage = calculateMatchScorePercentage(scoreObject);
        finalResults.push({
          id: candidate.id,
          percentage: percentage,
        });
      }
    } else if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const memberResults = candidate.nestedCandidates.map((member) => {
        const memberAnswers = allCandidatesAnswers[member.id] || [];

        if (memberAnswers.length === 0) {
          return { id: member.id, percentage: 0 };
        }

        const scoreObject = aggregateAnswersMatchScore(userAnswers, memberAnswers);
        const percentage = calculateMatchScorePercentage(scoreObject);

        return {
          id: member.id,
          percentage: percentage,
        };
      });

      const combinedAnswers = candidate.nestedCandidates.flatMap((member) => allCandidatesAnswers[member.id] || []);
      const scoreObject = aggregateAnswersMatchScore(userAnswers, combinedAnswers);
      const percentage = calculateMatchScorePercentage(scoreObject);

      finalResults.push({
        id: candidate.id,
        percentage: percentage,
        memberResults: memberResults.sort((a, b) => b.percentage - a.percentage),
      });
    }
  }
  return finalResults.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    // Random order for ties
    return Math.random() - 0.5;
  });
}
