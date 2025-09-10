import { useMemo } from "react";

import { useAnswersStore } from "../../stores/answers";
import { type AnswersViewModel, answersViewModel } from "../server/answers";

export function useAnswers(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);
  const answersMap = useMemo(() => new Map(answers.map((a) => [a.questionId, a.answer])), [answers]);

  return useMemo(() => answersViewModel(answers, answersMap, setAnswer, clearAnswers), [answers, answersMap, setAnswer, clearAnswers]);
}
