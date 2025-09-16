import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type QuestionsViewModel, questionsViewModel } from "../server/questions";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
