import { useMemo } from "react";

import { useAnswersStore } from "@/client/stores";
import { type AnswerViewModel, answerViewModel } from "@/view-models";

export function useAnswer(questionId: string): AnswerViewModel {
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const answers = useAnswersStore((state) => state.answers);

  return useMemo(() => {
    const answer = answers.find((answer) => answer.questionId === questionId);
    return answerViewModel(answer, setAnswer);
  }, [answers, questionId, setAnswer]);
}
