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

function parseOneSegmentParams({ first }: { first: string }): { key: string; group: string | undefined } {
  return { key: first, group: undefined };
}

function parseTwoSegmentParams({ first, second }: { first: string; second: string }): { key: string; group: string | undefined } {
  if (isPrefix(first)) {
    return { key: second, group: undefined };
  }
  return { key: first, group: second };
}

function parseThreeSegmentParams({ second, third }: { first: string; second: string; third: string }): { key: string; group: string | undefined } {
  return { key: second, group: third };
}

export const params = {
  questionNumber: (path: string): number => parseQuestionNumber(path),
  fromOneSegment: (params: { first: string }) => parseOneSegmentParams(params),
  fromTwoSegments: (params: { first: string; second: string }) => parseTwoSegmentParams(params),
  fromThreeSegments: (params: { first: string; second: string; third: string }) => parseThreeSegmentParams(params),
} as const;
