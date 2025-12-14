import { type QuestionViewModel, questionViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useQuestion(id: string): QuestionViewModel | undefined {
  const questions = useCalculatorStore((state) => state.data.questions);

  return useMemo(() => {
    const question = questions.find((question) => question.id === id);
    return question ? questionViewModel(question) : undefined;
  }, [questions, id]);
}
