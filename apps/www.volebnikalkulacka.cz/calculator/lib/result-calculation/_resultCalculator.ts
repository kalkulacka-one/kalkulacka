// // TODO: decide where to move this type
// export type AnswerValue = boolean | null | undefined;

// export function booleanToNumericAnswer(answer: AnswerValue): NumericAnswerValue {
//   switch (answer) {
//     case true:
//       return 1;
//     case false:
//       return -1;
//     case null:
//       return 0;
//     case undefined:
//       return undefined;
//   }
// }

// // TODO: decide where to move this type
// export type NumericAnswerValue = 1 | -1 | 0 | undefined;

// export function calculateBaseScore(userAnswer: NumericAnswerValue, candidateAnswer: NumericAnswerValue) {
//   if (userAnswer !== undefined && candidateAnswer !== undefined) {
//     return Math.sign(userAnswer * candidateAnswer) + 0;
//   }
//   throw new Error("Undefined value received");
// }

// export function processAnswer(userAnswer: any, candidateAnswer: any) {
//   if (userAnswer.questionId !== candidateAnswer.questionId) {
//     throw new Error("Question IDs do not match");
//   }
//   const questionId = userAnswer.questionId;
//   const numericUserAnswer = booleanToNumericAnswer(userAnswer.answer);
//   const numericCandidateAnswer = booleanToNumericAnswer(candidateAnswer.answer);

//   const baseScore = calculateBaseScore(numericUserAnswer, numericCandidateAnswer);

//   let weight = numericUserAnswer === 0 || numericCandidateAnswer === 0 ? 0 : 1;

//   let finalScore = baseScore;

//   if (userAnswer.isImportant && weight > 0) {
//     finalScore *= 2;
//     weight *= 2;
//   }

//   return { questionId, score: finalScore, weight: weight };
// }

// export function aggregateMatchScore(userAnswers: any[], candidateAnswers: any[]) {
//   const initialScore = { score: 0, weight: 0 };

//   return userAnswers.reduce((totalScore, userAnswer) => {
//     const matchingAnswers = candidateAnswers.filter((candidateAnswer) => candidateAnswer.questionId === userAnswer.questionId);

//     return matchingAnswers.reduce((currentTotal, singleMatch) => {
//       const resultStep = processAnswer(userAnswer, singleMatch);
//       return {
//         score: currentTotal.score + resultStep.score,
//         weight: currentTotal.weight + resultStep.weight,
//       };
//     }, totalScore);
//   }, initialScore);
// }

// export type TotalScore = { score: number; weight: number };

// export function calculateMatchScorePercentage(totalScore: TotalScore) {
//   // do we need this since we should provide fallback when user answers all equal 0 in the Zustand?
//   if (totalScore.weight === 0) {
//     return 0;
//   }
//   return ((1 + totalScore.score / totalScore.weight) / 2) * 100;
// }
