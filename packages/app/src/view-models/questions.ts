import type { Candidate, CandidatesAnswers, Question } from "@kalkulacka-one/schema";

import { type QuestionViewModel, questionViewModel } from "./question";
import { candidateRoundStatus } from "./rounds";

export type QuestionsViewModel = {
  questions: QuestionViewModel[];
  total: number;
};

export function questionsViewModel(questions: Question[], settledQuestionIds: string[] = []): QuestionsViewModel {
  const settled = new Set(settledQuestionIds);
  return {
    questions: questions.map((question) => questionViewModel(question, settled.has(question.id))),
    total: questions.length,
  };
}

/**
 * In a runoff, questions on which the remaining candidates do not differ carry no information: every advancing candidate answered
 * the same way, or none of them answered. Those questions are hidden from the voter and excluded from matching.
 */
export function visibleQuestions({
  questions,
  candidates,
  candidatesAnswers,
  currentRound,
}: {
  questions: Question[];
  candidates: Candidate[];
  candidatesAnswers: CandidatesAnswers;
  currentRound: number;
}): Question[] {
  if (currentRound <= 1) return questions;
  // Until the data says who went through (`rounds` or `elected` on a candidate), the calculator stays as it was.
  if (!candidates.some((candidate) => candidate.rounds || candidate.elected)) return questions;

  const remaining = candidates.filter((candidate) => candidateRoundStatus(candidate, currentRound) === "active");
  if (remaining.length === 0) return questions;

  const contested = questions.filter((question) => {
    const positions = new Set<boolean | "skipped">();
    for (const candidate of remaining) {
      const answer = candidatesAnswers[candidate.id]?.find((candidateAnswer) => candidateAnswer.questionId === question.id)?.answer;
      positions.add(answer === true || answer === false ? answer : "skipped");
    }
    return positions.size > 1;
  });
  // Candidates who agree on everything still deserve a calculator: fall back to the whole set rather than an empty flow.
  return contested.length > 0 ? contested : questions;
}
