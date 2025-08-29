import { aggregateMatchScore, calculateMatchScorePercentage } from "./resultCalculator";

export function calculateFinalResult(userAnswers: any, candidates: any, allCandidatesAnswers: any) {
  const finalResults = [];

  const allCandidatesAnswersId = Object.keys(allCandidatesAnswers);
  for (const candidate of candidates) {
    if (allCandidatesAnswersId.includes(candidate.id)) {
      const scoreObject = aggregateMatchScore(userAnswers, allCandidatesAnswers[candidate.id]);
      const percentage = calculateMatchScorePercentage(scoreObject);
      finalResults.push({
        id: candidate.id,
        name: candidate.name,
        percentage: percentage,
      });
    } else if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const memberResults = candidate.nestedCandidates.map((member) => {
        const memberAnswers = allCandidatesAnswers[member.id] || [];
        const memberInfo = candidates.find((c) => c.id === member.id);

        if (memberAnswers.length === 0) {
          return { id: member.id, name: memberInfo?.name || "", percentage: 0 };
        }

        const scoreObject = aggregateMatchScore(userAnswers, memberAnswers);
        const percentage = calculateMatchScorePercentage(scoreObject);

        return {
          id: member.id,
          name: memberInfo?.name || "",
          percentage: percentage,
        };
      });

      const combinedAnswers = candidate.nestedCandidates.flatMap((member) => allCandidatesAnswers[member.id] || []);
      const scoreObject = aggregateMatchScore(userAnswers, combinedAnswers);
      const percentage = calculateMatchScorePercentage(scoreObject);

      finalResults.push({
        id: candidate.id,
        name: candidate.name,
        percentage: percentage,
        memberResults: memberResults.sort((a, b) => b.percentage - a.percentage),
      });
    }
  }
  return finalResults.sort((a, b) => b.percentage - a.percentage);
}
