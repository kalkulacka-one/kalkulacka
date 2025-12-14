import { useMemo } from "react";

import { useAnswersStore } from "@/client/stores";
import { type AnswersViewModel, answersViewModel } from "@/view-models";

export function useAnswers(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers), [answers, setAnswer, clearAnswers]);
}
