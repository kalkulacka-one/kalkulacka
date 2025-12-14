import { type QuestionsViewModel, questionsViewModel } from "@kalkulacka-one/app";

import { useMemo } from "react";

import { useCalculatorStore } from "@kalkulacka-one/app/client";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
