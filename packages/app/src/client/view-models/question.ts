import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type QuestionViewModel, questionViewModel } from "@/view-models";

export function useQuestion(id: string): QuestionViewModel | undefined {
  const questions = useCalculatorStore((state) => state.data.questions);

  return useMemo(() => {
    const question = questions.find((question) => question.id === id);
    return question ? questionViewModel(question) : undefined;
  }, [questions, id]);
}
