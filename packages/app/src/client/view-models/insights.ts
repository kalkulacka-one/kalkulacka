import { useMemo } from "react";

import { useAnswersStore } from "@/client/stores";
import {
  type AnswerDistribution,
  buildAnswerDistribution,
  buildAnswerGroups,
  buildQuestionConsensus,
  buildTopicMatches,
  MIN_TOPIC_ANSWERS,
  type QuestionAnswerGroups,
  type QuestionConsensus,
  type TopicMatch,
} from "@/insights";
import { countRecapTotals, type RecapTotals } from "@/recap";

import { useCandidatesAnswers } from "./candidate-answers";
import { useCandidates } from "./candidates";
import { useQuestions } from "./questions";

/**
 * The dashboard's and the recap's numbers, memoized over the stores.
 *
 * Each hook derives from the same three sources — the calculator's questions
 * and candidates and the user's answers — so a screen that reads several of
 * them recomputes only what changed.
 */

export function useAnswerDistribution(): AnswerDistribution {
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);

  return useMemo(() => buildAnswerDistribution(questions, answers), [questions, answers]);
}

export function useTopicMatches(minAnswers: number = MIN_TOPIC_ANSWERS): TopicMatch[] {
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const candidates = useCandidates();
  const candidatesAnswers = useCandidatesAnswers();

  return useMemo(() => buildTopicMatches(questions, answers, candidates, candidatesAnswers, minAnswers), [questions, answers, candidates, candidatesAnswers, minAnswers]);
}

export function useQuestionConsensus(): QuestionConsensus[] {
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const candidates = useCandidates();
  const candidatesAnswers = useCandidatesAnswers();

  return useMemo(() => buildQuestionConsensus(questions, answers, candidates, candidatesAnswers), [questions, answers, candidates, candidatesAnswers]);
}

export function useAnswerGroups(): QuestionAnswerGroups[] {
  const { questions } = useQuestions();
  const candidates = useCandidates();
  const candidatesAnswers = useCandidatesAnswers();

  return useMemo(() => buildAnswerGroups(questions, candidates, candidatesAnswers), [questions, candidates, candidatesAnswers]);
}

export function useRecapTotals(): RecapTotals {
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);

  return useMemo(() => countRecapTotals(questions, answers), [questions, answers]);
}
