import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { booleanAnswerToNumber } from "./boolean-answer-to-number";
import { calculateBaseScore } from "./calculate-base-score";
export function processSingleAnswer(userAnswer: Answer, candidateAnswer: Answer) {
  if (userAnswer.questionId !== candidateAnswer.questionId) {
    throw new Error("Question IDs do not match");
  }
  const questionId = userAnswer.questionId;
  const numericUserAnswer = booleanAnswerToNumber(userAnswer.answer);
  const numericCandidateAnswer = booleanAnswerToNumber(candidateAnswer.answer);

  // Only process if both answers are defined (not undefined/missing)
  if (numericUserAnswer === undefined || numericCandidateAnswer === undefined) {
    return { questionId, score: 0, weight: 0 };
  }

  const baseScore = calculateBaseScore(numericUserAnswer, numericCandidateAnswer);

  // Weight is 1 for all defined answers (including neutral)
  let weight = 1;

  let finalScore = baseScore;

  if (userAnswer.isImportant && weight > 0) {
    finalScore *= 2;
    weight *= 2;
  }

  return { questionId, score: finalScore, weight: weight };
}
