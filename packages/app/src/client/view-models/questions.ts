import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type QuestionsViewModel, questionsViewModel, visibleQuestions } from "@/view-models";

import { useRound } from "./rounds";

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  const candidates = useCalculatorStore((state) => state.data.candidates);
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  const round = useRound();

  return useMemo(
    () => questionsViewModel(round ? visibleQuestions({ questions, candidates, candidatesAnswers, currentRound: round.current }) : questions),
    [questions, candidates, candidatesAnswers, round],
  );
}
