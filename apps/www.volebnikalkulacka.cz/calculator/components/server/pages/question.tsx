import type { QuestionViewModel } from "../../../view-models";
import { QuestionCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
};

export function QuestionPage({ question, number, total }: QuestionPage) {
  return <QuestionCard question={question} current={number} total={total} />;
}
