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

export const params = {
  questionNumber: (path: string): number => parseQuestionNumber(path),

  oneSegment: {
    calculatorKey: (first: string): string => first,
    calculatorGroupKey: (_first: string): undefined => undefined,
  },

  twoSegment: {
    calculatorKey: (first: string, second: string): string => {
      if (isPrefix(first)) {
        return second;
      }
      return first;
    },
    calculatorGroupKey: (first: string, second: string): string | undefined => {
      if (isPrefix(first)) {
        return undefined;
      }
      return second;
    },
  },

  threeSegment: {
    calculatorKey: (_first: string, second: string, _third: string): string => second,
    calculatorGroupKey: (_first: string, _second: string, third: string): string => third,
  },
} as const;
