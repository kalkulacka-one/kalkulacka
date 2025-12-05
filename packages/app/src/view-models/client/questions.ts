import { useMemo } from "react";

import { type QuestionsViewModel, questionsViewModel } from "../../server";
import { useCalculatorStore } from "../../stores";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
