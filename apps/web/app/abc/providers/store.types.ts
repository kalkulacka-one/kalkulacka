import { Question } from "@repo/schema/dist";

// extend question type like this? (need isImportant, answerType)
export type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

// move type somewhere else?
export type Guide = {
  title?: string;
  region?: string;
  contentBefore?: string;
  contentAfter?: string;
}[];
