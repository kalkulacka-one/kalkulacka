import { useMemo } from "react";

import { useAnswersStore } from "@/calculator/stores";
import { type AnswersViewModel, answersViewModel } from "@/calculator/view-models/server";

export function useAnswers(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers), [answers, setAnswer, clearAnswers]);
}
