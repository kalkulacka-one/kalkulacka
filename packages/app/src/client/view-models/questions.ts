import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type QuestionsViewModel, questionsViewModel, visibleQuestions } from "@/view-models";

import { useRound } from "./rounds";

/** The questions the current round asks; with `includeSettled`, every question, the settled ones flagged. */
export function useQuestions(options?: { includeSettled?: boolean }): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.data.questions);
  const candidates = useCalculatorStore((state) => state.data.candidates);
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  const round = useRound();
  const includeSettled = options?.includeSettled ?? false;

  return useMemo(() => {
    const asked = round ? visibleQuestions({ questions, candidates, candidatesAnswers, currentRound: round.current }) : questions;
    const askedIds = new Set(asked.map((question) => question.id));
    const settledIds = questions.filter((question) => !askedIds.has(question.id)).map((question) => question.id);
    return questionsViewModel(includeSettled ? questions : asked, settledIds);
  }, [questions, candidates, candidatesAnswers, round, includeSettled]);
}
