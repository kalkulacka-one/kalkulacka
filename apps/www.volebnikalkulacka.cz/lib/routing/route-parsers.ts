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

function parseTwoSegmentCalculatorParams(first: string, second: string): { key: string; group?: string } {
  if (isPrefix(first)) {
    return { key: second };
  }
  return { key: first, group: second };
}

function parseTwoSegmentMetadataParams(first: string, second: string): { key: string; group?: string } {
  if (isPrefix(first)) {
    return { key: second };
  }
  return { key: first, group: second };
}

export const params = {
  questionNumber: (path: string): number => parseQuestionNumber(path),
  twoSegmentCalculator: (first: string, second: string) => parseTwoSegmentCalculatorParams(first, second),
  twoSegmentMetadata: (first: string, second: string) => parseTwoSegmentMetadataParams(first, second),
} as const;
