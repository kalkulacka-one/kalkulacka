import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import { processSingleAnswer } from "./process-single-answer";

export function aggregateAnswersMatchScore(userAnswers: Answers, candidateAnswers: Answers) {
  const initialScore = { score: 0, weight: 0 };

  return userAnswers.reduce((totalScore, userAnswer) => {
    const matchingAnswers = candidateAnswers.filter((candidateAnswer) => candidateAnswer.questionId === userAnswer.questionId);

    return matchingAnswers.reduce((currentTotal, singleMatch) => {
      const resultStep = processSingleAnswer(userAnswer, singleMatch);
      return {
        score: currentTotal.score + resultStep.score,
        weight: currentTotal.weight + resultStep.weight,
      };
    }, totalScore);
  }, initialScore);
}
