import { useMemo } from "react";

import { type QuestionsViewModel, questionsViewModel } from "@/calculator";
import { useCalculatorStore } from "@/calculator/stores";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
