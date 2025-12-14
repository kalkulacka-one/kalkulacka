import { type AnswersViewModel, answersViewModel } from "@kalkulacka-one/app";
import { useAnswersStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useAnswers(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers), [answers, setAnswer, clearAnswers]);
}
