import { ROUTE_SEGMENTS } from "./route-builders";
import { isPrefix } from "./validators";
import { validateQuestionNumber } from "./validators/question-number";

function parseQuestionNumber(path: string): number {
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

function parseCalculatorKey(path: string): string {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 1) {
    return segments[0] as string;
  }

  if (segments.length === 2) {
    const [first, second] = segments;
    if (isPrefix(first as string)) {
      return second as string;
    }
    return first as string;
  }

  if (segments.length === 3) {
    return segments[1] as string;
  }

  throw new Error(`Invalid path for calculator key: ${path}`);
}

function parseCalculatorGroupKey(path: string): string | undefined {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 1) {
    return undefined;
  }

  if (segments.length === 2) {
    const [first, second] = segments;
    if (isPrefix(first as string)) {
      return undefined;
    }
    return second as string;
  }

  if (segments.length === 3) {
    return segments[2] as string;
  }

  throw new Error(`Invalid path for calculator group key: ${path}`);
}

export const params = {
  questionNumber: (path: string): number => parseQuestionNumber(path),
  calculatorKey: (path: string): string => parseCalculatorKey(path),
  calculatorGroupKey: (path: string): string | undefined => parseCalculatorGroupKey(path),
} as const;
