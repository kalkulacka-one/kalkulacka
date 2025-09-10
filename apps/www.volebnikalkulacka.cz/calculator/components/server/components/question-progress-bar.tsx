import { SteppedProgressBar } from "@repo/design-system/server";

import type { AnswersViewModel, QuestionsViewModel } from "../../../view-models";

export type QuestionProgressBarProps = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  current: number;
};

export function QuestionProgressBar({ questions, current, answers }: QuestionProgressBarProps) {
  const stepItems = questions.questions.map((question) => ({
    id: question.id,
    status: answers.answersMap.get(question.id),
  }));

  return <SteppedProgressBar stepItems={stepItems} stepCurrent={current} stepTotal={questions.questions.length} idKey="id" statusKey="status" />;
}
