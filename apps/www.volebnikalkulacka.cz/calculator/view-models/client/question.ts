import { useMemo } from "react";

import { useCalculatorStore } from "@/calculator/stores";
import { type QuestionViewModel, questionViewModel } from "@/calculator/view-models/server";

export function useQuestion(id: string): QuestionViewModel | undefined {
  const questions = useCalculatorStore((state) => state.data.questions);

  return useMemo(() => {
    const question = questions.find((question) => question.id === id);
    return question ? questionViewModel(question) : undefined;
  }, [questions, id]);
}
