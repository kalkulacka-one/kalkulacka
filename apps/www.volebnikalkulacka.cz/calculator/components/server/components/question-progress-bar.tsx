import { SteppedProgressBar } from "@repo/design-system/server";

import type { AnswersViewModel, QuestionsViewModel } from "../../../view-models";

export type QuestionProgressBar = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  current: number;
};

export function QuestionProgressBar({ questions, current, answers }: QuestionProgressBar) {
  const stepItems = questions.questions.map((question) => {
    const findAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
    const answerStatus = findAnswer?.answer?.answer;

    return {
      id: question.id,
      status: answerStatus,
    };
  });

  return <SteppedProgressBar stepItems={stepItems} stepCurrent={current} stepTotal={questions.questions.length} idKey="id" statusKey="status" />;
}
