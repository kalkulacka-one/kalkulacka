import { ROUTE_SEGMENTS } from "./route-builders";
import { validateQuestionNumber } from "./validators/question-number";

export function parseQuestionNumber(path: string): number {
  const segments = path.split("/").filter(Boolean);
  const questionIndex = segments.indexOf(ROUTE_SEGMENTS.QUESTION);

  if (questionIndex === -1) {
    throw new Error("Question segment not found in path");
  }

  const questionNumberString = segments[questionIndex + 1];
  if (!questionNumberString) {
    throw new Error("Missing question number in path");
  }

  if (segments[questionIndex + 2]) {
    throw new Error("Unexpected path segments after question number");
  }

  return validateQuestionNumber(questionNumberString);
}
