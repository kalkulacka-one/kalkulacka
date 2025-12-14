import { type QuestionsViewModel, questionsViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
