import { useMemo } from "react";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";

export type QuestionViewModel = Question;

export function questionViewModel(question: Question): QuestionViewModel {
  return question;
}

export function useQuestion(id: string): QuestionViewModel | undefined {
  const questions = useCalculatorStore((state) => state.questions);

  return useMemo(() => {
    const question = questions.find((question) => question.id === id);
    return question ? questionViewModel(question) : undefined;
  }, [questions, id]);
}
