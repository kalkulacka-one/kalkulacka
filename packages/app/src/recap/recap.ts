// Ported from kalkulacka-2026/packages/core/src/recap/recap.ts, adapted to the schema's `Answer[]` and `Question`;
// `topicOf` lives in `@/insights` here because both modules read it.
import type { Answer, Question } from "@kalkulacka-one/schema";

import { answersByQuestion, countAnswered, hasAnswer } from "@/answers";
import { topicOf } from "@/insights";

/**
 * What the recap screen derives from the answers.
 *
 * Same split as `toSegments`: the shapes are presentational, but *which*
 * questions a filter leaves and *what* each chip counts is domain logic, and it
 * is the part with all the branching. Keeping it here means it can be tested
 * without rendering the screen — the screen itself only lays the result out.
 */

/** The three filters that are about progress rather than subject matter. */
export const RECAP_FILTER_ALL = "all";
export const RECAP_FILTER_UNANSWERED = "unanswered";
export const RECAP_FILTER_IMPORTANT = "important";

/** Topic filters are namespaced so a topic literally named "all" can't collide. */
export const RECAP_TOPIC_PREFIX = "topic:";

/** One of the fixed ids above, or `topic:<tag>`. */
export type RecapFilterId = "all" | "unanswered" | "important" | `topic:${string}`;

export function topicFilterId(topic: string): RecapFilterId {
  return `${RECAP_TOPIC_PREFIX}${topic}`;
}

/** A filter chip, before its label is translated. Mirrors the design system's `FilterOption`. */
export type RecapFilterOption = {
  id: RecapFilterId;
  label: string;
  count: number;
  separatorBefore?: boolean;
};

/** A question that survived the filter, carrying its position in the full list. */
export type RecapEntry = {
  question: Question;
  /** Index into the *unfiltered* questions — what the dialog opens by. */
  index: number;
};

export function matchesRecapFilter(question: Question, answers: readonly Answer[], filter: RecapFilterId): boolean {
  return matchesRecapFilterWith(question, answersByQuestion(answers).get(question.id), filter);
}

function matchesRecapFilterWith(question: Question, answer: Answer | undefined, filter: RecapFilterId): boolean {
  if (filter === RECAP_FILTER_ALL) return true;
  // A skip and a never-reached question read the same here: neither has a position.
  if (filter === RECAP_FILTER_UNANSWERED) return !hasAnswer(answer);
  if (filter === RECAP_FILTER_IMPORTANT) return answer?.isImportant === true;

  return topicOf(question) === filter.slice(RECAP_TOPIC_PREFIX.length);
}

export function filterRecapQuestions(questions: readonly Question[], answers: readonly Answer[], filter: RecapFilterId): RecapEntry[] {
  const lookup = answersByQuestion(answers);

  return questions.map((question, index) => ({ question, index })).filter(({ question }) => matchesRecapFilterWith(question, lookup.get(question.id), filter));
}

/**
 * Topics with their question counts, in the order the questions introduce them.
 *
 * A Map, not a Set: the chips need counts, and building them in encounter order
 * keeps the filter row in the same sequence as the questions rather than in an
 * alphabetical one nobody asked for.
 */
export function countRecapTopics(questions: readonly Question[]): [string, number][] {
  const counts = new Map<string, number>();

  for (const question of questions) {
    const topic = topicOf(question);
    if (topic) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }

  return [...counts];
}

/** The tallies the recap header and its chips are built from. */
export type RecapTotals = {
  total: number;
  answered: number;
  /**
   * Questions with no recorded position. Skipped and never-reached are the same
   * bucket here — both are "no position taken".
   */
  remaining: number;
  important: number;
};

export function countRecapTotals(questions: readonly Question[], answers: readonly Answer[]): RecapTotals {
  const lookup = answersByQuestion(answers);
  const answered = countAnswered(questions, answers);

  return {
    total: questions.length,
    answered,
    remaining: questions.length - answered,
    important: questions.filter((question) => lookup.get(question.id)?.isImportant === true).length,
  };
}

/**
 * The filter row.
 *
 * "Přeskočené" and "Důležité" only appear when they would leave anything —
 * a chip that filters to an empty list is an offer to reach a dead end. Topics
 * always follow, separated by a hairline because they answer a different
 * question from the two progress filters.
 */
export function buildRecapFilters(questions: readonly Question[], answers: readonly Answer[], labels: { all: string; unanswered: string; important: string }): RecapFilterOption[] {
  const { total, remaining, important } = countRecapTotals(questions, answers);

  return [
    { id: RECAP_FILTER_ALL, label: labels.all, count: total },
    ...(remaining > 0 ? [{ id: RECAP_FILTER_UNANSWERED, label: labels.unanswered, count: remaining } satisfies RecapFilterOption] : []),
    ...(important > 0 ? [{ id: RECAP_FILTER_IMPORTANT, label: labels.important, count: important } satisfies RecapFilterOption] : []),
    ...countRecapTopics(questions).map(([topic, count], index) => ({
      id: topicFilterId(topic),
      label: topic,
      count,
      separatorBefore: index === 0,
    })),
  ];
}
