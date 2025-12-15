import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type QuestionsViewModel, questionsViewModel } from "@/view-models";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
