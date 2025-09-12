import { useMemo } from "react";

import { useAnswersStore } from "../../stores/answers";
import { type AnswersViewModel, answersViewModel } from "../server/answers";

export function useAnswersViewModel(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers), [answers, setAnswer, clearAnswers]);
}
