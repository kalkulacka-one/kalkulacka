export type TotalScore = { score: number; weight: number };

export function calculateMatchScorePercentage(totalScore: TotalScore) {
  if (totalScore.weight === 0) {
    return 0;
  }
  return ((1 + totalScore.score / totalScore.weight) / 2) * 100;
}
