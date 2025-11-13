import type { BaseScoreValue } from "./calculate-base-score";

export type AnswerValue = boolean | null | undefined;

export function booleanAnswerToNumber(answer: AnswerValue): BaseScoreValue {
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
