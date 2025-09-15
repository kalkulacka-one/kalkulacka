import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type QuestionViewModel, questionViewModel } from "../server/question";

export function useQuestion(id: string): QuestionViewModel | undefined {
  const questions = useCalculatorStore((state) => state.questions);

  return useMemo(() => {
    const question = questions.find((question) => question.id === id);
    return question ? questionViewModel(question) : undefined;
  }, [questions, id]);
}
