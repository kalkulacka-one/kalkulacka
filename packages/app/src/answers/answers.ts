// Ported from kalkulacka-2026/packages/core/src/answers/answers.ts — only countAnswered, countSkipped,
// firstUnansweredIndex, toSegments and the "visited" semantics; the transitions live in the answers store here.
import type { Answer } from "@kalkulacka-one/schema";

/**
 * Progress over a calculator's answers as pure functions over the stored
 * `Answer[]`, so the screens that read it (the intro's "Pokračovat v
 * odpovídání", later the recap) are testable without rendering anything.
 *
 * The array maps 1:1 onto the 2026 model: an entry whose `answer` is
 * `undefined` is a question that was *visited and skipped* — the question page
 * writes `setAnswer({ questionId })` the moment a question is shown — while no
 * entry at all means the question was never reached. `null` is an explicit
 * neutral position and counts as answered.
 */

type QuestionLike = { id: string };

/** How a question reads in the progress bar. Mirrors the design system's `SegmentState`. */
export type AnswerSegmentState = "unanswered" | "agree" | "disagree" | "skipped";

export type AnswerSegment = { state: AnswerSegmentState; important: boolean };

/** A real position: yes, no, or an explicit neutral. */
export function hasAnswer(answer?: Answer): boolean {
  return answer !== undefined && answer.answer !== undefined;
}

/** A question is "visited" once the store has an entry for it — answered or skipped. */
export function isVisited(answer?: Answer): boolean {
  return answer !== undefined;
}

function byQuestion(answers: readonly Answer[]): Map<string, Answer> {
  return new Map(answers.map((answer) => [answer.questionId, answer]));
}

/**
 * How many of *these* questions have a real position recorded (skips do not count).
 *
 * Scoped to the question list rather than counting the stored answers, because
 * the two can disagree: answers outlive a calculator's question set (a saved
 * session, a data update), and counting the store produced "Zodpovězeno 43 z
 * 42" — a total larger than the thing it was a total of.
 */
export function countAnswered(questions: readonly QuestionLike[], answers: readonly Answer[]): number {
  const lookup = byQuestion(answers);
  return questions.filter((question) => hasAnswer(lookup.get(question.id))).length;
}

/** How many of these questions were visited but left without a position. */
export function countSkipped(questions: readonly QuestionLike[], answers: readonly Answer[]): number {
  const lookup = byQuestion(answers);
  return questions.filter((question) => {
    const answer = lookup.get(question.id);
    return isVisited(answer) && !hasAnswer(answer);
  }).length;
}

/** Index of the first question with nothing recorded, or -1 when every question was visited. */
export function firstUnansweredIndex(questions: readonly QuestionLike[], answers: readonly Answer[]): number {
  const lookup = byQuestion(answers);
  return questions.findIndex((question) => !isVisited(lookup.get(question.id)));
}

/**
 * One segment per question, for the progress bar.
 *
 * `skipped` covers both a question visited and left without a position and an
 * explicit neutral — the bar is a readout of how much is decided, and neither
 * decides anything. The neutral still scores; only the bar declines to draw
 * the distinction.
 */
export function toSegments(questions: readonly QuestionLike[], answers: readonly Answer[]): AnswerSegment[] {
  const lookup = byQuestion(answers);

  return questions.map((question) => {
    const answer = lookup.get(question.id);
    const important = answer?.isImportant === true;

    if (!answer) return { state: "unanswered", important };
    if (answer.answer === true) return { state: "agree", important };
    if (answer.answer === false) return { state: "disagree", important };

    // Visited without a position, or an explicit neutral: either reads as skipped in the bar.
    return { state: "skipped", important };
  });
}
