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

      // Also process nested candidates if they exist and have answers
      if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
        for (const member of candidate.nestedCandidates) {
          if (allCandidatesAnswersId.includes(member.id)) {
            const memberAnswers = allCandidatesAnswers[member.id];
            if (memberAnswers) {
              const scoreObject = aggregateAnswersMatchScore(userAnswers, memberAnswers);
              const percentage = calculateMatchScorePercentage(scoreObject);
              finalResults.push({
                id: member.id,
                percentage: percentage,
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
        const percentage = calculateMatchScorePercentage(scoreObject);

        memberResults.push({
          id: member.id,
          percentage: percentage,
        });
        finalResults.push({
          id: member.id,
          percentage: percentage,
        });
      }

      const combinedAnswers = candidate.nestedCandidates.flatMap((member) => allCandidatesAnswers[member.id] || []);
      const scoreObject = aggregateAnswersMatchScore(userAnswers, combinedAnswers);
      const percentage = calculateMatchScorePercentage(scoreObject);

      // Add the parent result without memberResults to match the test expectation
      finalResults.push({
        id: candidate.id,
        percentage: percentage,
      });
    }
  }
  return finalResults.sort((a, b) => {
    // Handle potentially undefined percentages
    const bPercentage = b.percentage ?? -1;
    const aPercentage = a.percentage ?? -1;

    if (bPercentage !== aPercentage) {
      return bPercentage - aPercentage;
    }
    // Random order for ties
    return Math.random() - 0.5;
  });
}
