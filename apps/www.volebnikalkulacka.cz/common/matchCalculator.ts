import { aggregateMatchScore, calculateMatchScorePercentage } from "./resultCalculator";

export function calculateAllMatches(userAnswers: any[], allCandidatesAnswers: any) {
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
