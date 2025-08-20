import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { CandidateAnswer, CandidateAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";

// TODO: decide where to move this type
export type AnswerValue = boolean | null | undefined;

export function booleanToNumericAnswer(answer: AnswerValue): NumericAnswerValue {
  switch (answer) {
    case true:
      return 1;
    case false:
      return -1;
    case null:
      return 0;
    case undefined:
      return undefined;
  }
}

// TODO: decide where to move this type
export type NumericAnswerValue = 1 | -1 | 0 | undefined;

export function calculateBaseScore(userAnswer: NumericAnswerValue, candidateAnswer: NumericAnswerValue) {
  if (userAnswer !== undefined && candidateAnswer !== undefined) {
    return Math.sign(userAnswer * candidateAnswer) + 0;
  }
  throw new Error("Undefined value received");
}

export function processAnswer(userAnswer: Answer, candidateAnswer: CandidateAnswer) {
  if (userAnswer.questionId !== candidateAnswer.questionId) {
    throw new Error("Question IDs do not match");
  }
  const questionId = userAnswer.questionId;
  const numericUserAnswer = booleanToNumericAnswer(userAnswer.answer);
  const numericCandidateAnswer = booleanToNumericAnswer(candidateAnswer.answer);

  const baseScore = calculateBaseScore(numericUserAnswer, numericCandidateAnswer);

  let weight = numericUserAnswer === 0 || numericCandidateAnswer === 0 ? 0 : 1;

  let finalScore = baseScore;

  if (userAnswer.isImportant && weight > 0) {
    finalScore *= 2;
    weight *= 2;
  }

  return { questionId, score: finalScore, weight: weight };
}

export function aggregateMatchScore(userAnswers: Answers, candidateAnswers: CandidateAnswer[]) {
  const initialScore = { score: 0, weight: 0 };
  return userAnswers.reduce((totalScore, userAnswer) => {
    const matchingCandidateAnswer = candidateAnswers.find((candidateAnswer: CandidateAnswer) => candidateAnswer.questionId === userAnswer.questionId);
    if (matchingCandidateAnswer) {
      const resultStep = processAnswer(userAnswer, matchingCandidateAnswer);

      return {
        score: totalScore.score + resultStep.score,
        weight: totalScore.weight + resultStep.weight,
      };
    }
    return totalScore;
  }, initialScore);
}

export type TotalScore = { score: number; weight: number };

export function calculateMatchScorePercentage(totalScore: TotalScore) {
  // do we need this since we should provide fallback when user answers all equal 0 in the Zustand?
  if (totalScore.weight === 0) {
    return 0;
  }
  return ((1 + totalScore.score / totalScore.weight) / 2) * 100;
}
