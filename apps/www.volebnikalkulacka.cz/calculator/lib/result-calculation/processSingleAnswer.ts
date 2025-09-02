import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import { booleanAnswerToNumber } from "./booleanAnswerToNumber";
import { calculateBaseScore } from "./calculateBaseScore";
export function processSingleAnswer(userAnswer: Answer, candidateAnswer: Answer) {
  if (userAnswer.questionId !== candidateAnswer.questionId) {
    throw new Error("Question IDs do not match");
  }
  const questionId = userAnswer.questionId;
  const numericUserAnswer = booleanAnswerToNumber(userAnswer.answer);
  const numericCandidateAnswer = booleanAnswerToNumber(candidateAnswer.answer);

  const baseScore = calculateBaseScore(numericUserAnswer, numericCandidateAnswer);

  let weight = numericUserAnswer === 0 || numericCandidateAnswer === 0 ? 0 : 1;

  let finalScore = baseScore;

  if (userAnswer.isImportant && weight > 0) {
    finalScore *= 2;
    weight *= 2;
  }

  return { questionId, score: finalScore, weight: weight };
}
