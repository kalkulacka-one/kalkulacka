export function validateQuestionNumber(questionNumber: string): number {
  const number = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(number)) {
    throw new Error(`Invalid question number \`${questionNumber}\``);
  }
  if (number < 1) {
    throw new Error(`Question number must be at least 1, got \`${questionNumber}\``);
  }
  return number;
}
