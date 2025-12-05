export type BaseScoreValue = 1 | -1 | 0 | undefined;

export function calculateBaseScore(userAnswer: BaseScoreValue, candidateAnswer: BaseScoreValue) {
  if (userAnswer !== undefined && candidateAnswer !== undefined) {
    return Math.sign(userAnswer * candidateAnswer) + 0;
  }
  throw new Error("Undefined value received");
}
