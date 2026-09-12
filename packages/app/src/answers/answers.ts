// Ported from kalkulacka-2026/packages/core/src/answers/answers.ts — countAnswered, countSkipped, firstUnansweredIndex,
// isComplete, toSegments, answerTone and the "visited" semantics; the transitions live in the answers store here.
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

/**
 * Explicitly passed over: visited, no position, and the flag cleared with it.
 *
 * 2026 kept a `skipped` flag on the entry; this platform's `Answer` has none,
 * and the three facts a recap row cares about have to be told apart from the
 * shape of the record instead. The flow's skip (and the recap's) is the one
 * write that leaves `isImportant: false` beside a missing position — an
 * arrival writes neither, and the star alone writes `true` — so that pair *is*
 * the flag. It keeps the star armable on a question that was only looked at,
 * or starred before it was answered, and locked on one that was actually
 * skipped.
 */
export function isSkipped(answer?: Answer): boolean {
  return isVisited(answer) && !hasAnswer(answer) && answer?.isImportant === false;
}

/** The stored answers keyed by question, for the helpers that walk a question list. */
export function answersByQuestion(answers: readonly Answer[]): Map<string, Answer> {
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
  const lookup = answersByQuestion(answers);
  return questions.filter((question) => hasAnswer(lookup.get(question.id))).length;
}

/** How many of these questions were visited but left without a position. */
export function countSkipped(questions: readonly QuestionLike[], answers: readonly Answer[]): number {
  const lookup = answersByQuestion(answers);
  return questions.filter((question) => {
    const answer = lookup.get(question.id);
    return isVisited(answer) && !hasAnswer(answer);
  }).length;
}

/** Every question was visited — answered or skipped — so the flow can move on to the recap. */
export function isComplete(questions: readonly QuestionLike[], answers: readonly Answer[]): boolean {
  const lookup = answersByQuestion(answers);
  return questions.every((question) => isVisited(lookup.get(question.id)));
}

/** Index of the first question with nothing recorded, or -1 when every question was visited. */
export function firstUnansweredIndex(questions: readonly QuestionLike[], answers: readonly Answer[]): number {
  const lookup = answersByQuestion(answers);
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
  const lookup = answersByQuestion(answers);

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

/**
 * How a recorded position reads as a mark. Mirrors the design system's `AnswerMarkTone`.
 *
 * `neutral` is an explicit "Nevím" — a real answer that takes no side — and is
 * deliberately distinct from `none`, the absence of any answer at all. Nothing
 * in the question flow produces `null` today (the card offers agree and
 * disagree only), but candidates' imported answers do, and the schema allows
 * it, so the distinction is carried rather than collapsed.
 */
export type AnswerTone = "agree" | "disagree" | "neutral" | "none";

/**
 * The one mapping from a stored answer to the tone that draws it.
 *
 * Had been written out three separate times in the 2026 app — twice in the
 * results screen's own components and once as a recap-only helper that folded
 * `null` into `none`, so an explicit "Nevím" was indistinguishable from an
 * unanswered question on the recap while the recap's *filter* counted it as
 * answered. One definition removes that disagreement and the drift that
 * produced it. Takes the stored entry rather than its value so a skip (an entry
 * without `answer`) and a question never reached read the same way.
 */
export function answerTone(answer?: Answer): AnswerTone {
  if (answer?.answer === true) return "agree";
  if (answer?.answer === false) return "disagree";
  if (answer?.answer === null) return "neutral";
  return "none";
}
