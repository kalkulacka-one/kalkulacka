import { SteppedProgressBar } from "@repo/design-system/server";

import type { AnswersViewModel, QuestionsViewModel } from "../../../view-models";

export type QuestionProgressBarProps = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  current: number;
};

export function QuestionProgressBar({ questions, current, answers }: QuestionProgressBarProps) {
  const stepItems = questions.questions.map((question) => {
    const currentAnswer = answers.answers.find((answer) => question.id === answer.answer?.questionId);
    return {
      id: question.id,
      status: currentAnswer?.answer?.answer,
    };
  });

  return <SteppedProgressBar stepItems={stepItems} stepCurrent={current} stepTotal={questions.questions.length} idKey="id" statusKey="status" />;
}
