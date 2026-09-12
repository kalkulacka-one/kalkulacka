// Ported from kalkulacka-2026/packages/core/src/recap/recap.test.ts, adapted to the `Answer[]` shape. Every expected
// value is worked out by hand and written as a literal.
import type { Answer, Question } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import {
  buildRecapFilters,
  countRecapTopics,
  countRecapTotals,
  filterRecapQuestions,
  matchesRecapFilter,
  RECAP_FILTER_ALL,
  RECAP_FILTER_IMPORTANT,
  RECAP_FILTER_UNANSWERED,
  topicFilterId,
} from "./recap";

/** Named rather than indexed so the assertions below read as what they test. */
const question = (id: string, tags?: string[]): Question => (tags ? { id, title: id, statement: id, tags } : { id, title: id, statement: id });

/** q1/q2 share a topic, q3 has another, q4 has none — every branch of `topicOf`. */
const q1 = question("q1", ["Doprava"]);
/** A second tag, to pin down that only the first one is the topic. */
const q2 = question("q2", ["Doprava", "Ignored"]);
const q3 = question("q3", ["Bydlení"]);
const q4 = question("q4");

const questions: Question[] = [q1, q2, q3, q4];

const yes = (questionId: string): Answer => ({ questionId, answer: true });
const no = (questionId: string): Answer => ({ questionId, answer: false });
const neutral = (questionId: string): Answer => ({ questionId, answer: null });
/* What the question page writes when a question is shown and then left without a position. */
const skipped = (questionId: string): Answer => ({ questionId });
/* The star pressed before any answer was given. */
const starred = (questionId: string): Answer => ({ questionId, isImportant: true });

const labels = { all: "Vše", unanswered: "Přeskočené", important: "Důležité" };

describe("topicFilterId", () => {
  it("namespaces the topic", () => {
    expect(topicFilterId("Doprava")).toBe("topic:Doprava");
  });
});

describe("matchesRecapFilter", () => {
  const answers: Answer[] = [yes("q1"), starred("q3")];

  it('keeps everything under "all"', () => {
    expect(questions.map((q) => matchesRecapFilter(q, answers, RECAP_FILTER_ALL))).toEqual([true, true, true, true]);
  });

  it("treats an answered question as no longer unanswered", () => {
    expect(matchesRecapFilter(q1, answers, RECAP_FILTER_UNANSWERED)).toBe(false);
    expect(matchesRecapFilter(q2, answers, RECAP_FILTER_UNANSWERED)).toBe(true);
  });

  it("counts a skipped question as unanswered", () => {
    expect(matchesRecapFilter(q2, [...answers, skipped("q2")], RECAP_FILTER_UNANSWERED)).toBe(true);
  });

  it("counts an explicit neutral as answered", () => {
    expect(matchesRecapFilter(q2, [neutral("q2")], RECAP_FILTER_UNANSWERED)).toBe(false);
  });

  it('matches only starred questions under "important"', () => {
    expect(matchesRecapFilter(q3, answers, RECAP_FILTER_IMPORTANT)).toBe(true);
    expect(matchesRecapFilter(q1, answers, RECAP_FILTER_IMPORTANT)).toBe(false);
  });

  it("matches a topic on the first tag only", () => {
    expect(matchesRecapFilter(q2, answers, topicFilterId("Doprava"))).toBe(true);
    expect(matchesRecapFilter(q2, answers, topicFilterId("Ignored"))).toBe(false);
  });

  it('does not confuse a topic named "all" with the "all" filter', () => {
    const named = question("qx", ["all"]);

    expect(matchesRecapFilter(q1, answers, topicFilterId("all"))).toBe(false);
    expect(matchesRecapFilter(named, answers, topicFilterId("all"))).toBe(true);
  });
});

describe("filterRecapQuestions", () => {
  it("carries the index into the unfiltered list", () => {
    expect(filterRecapQuestions(questions, [], topicFilterId("Bydlení"))).toEqual([{ question: q3, index: 2 }]);
  });

  it("keeps the skipped and the unreached questions under unanswered", () => {
    expect(filterRecapQuestions(questions, [yes("q1"), skipped("q2")], RECAP_FILTER_UNANSWERED)).toEqual([
      { question: q2, index: 1 },
      { question: q3, index: 2 },
      { question: q4, index: 3 },
    ]);
  });

  it("can leave nothing", () => {
    expect(filterRecapQuestions(questions, [], topicFilterId("Nic"))).toEqual([]);
  });
});

describe("countRecapTopics", () => {
  it("counts by first tag, in the order the questions introduce them", () => {
    expect(countRecapTopics(questions)).toEqual([
      ["Doprava", 2],
      ["Bydlení", 1],
    ]);
  });

  it("ignores questions with no tags", () => {
    expect(countRecapTopics([q4])).toEqual([]);
  });
});

describe("countRecapTotals", () => {
  it("splits answered from remaining", () => {
    expect(countRecapTotals(questions, [yes("q1"), no("q2")])).toEqual({ total: 4, answered: 2, remaining: 2, important: 0 });
  });

  it("leaves a skipped question in the remaining bucket", () => {
    expect(countRecapTotals(questions, [yes("q1"), skipped("q2")])).toEqual({ total: 4, answered: 1, remaining: 3, important: 0 });
  });

  it("counts an explicit neutral as answered", () => {
    expect(countRecapTotals(questions, [neutral("q1")])).toEqual({ total: 4, answered: 1, remaining: 3, important: 0 });
  });

  it("counts a star armed before any answer", () => {
    expect(countRecapTotals(questions, [starred("q1")])).toEqual({ total: 4, answered: 0, remaining: 4, important: 1 });
  });

  it("ignores stored answers to questions this calculator no longer asks", () => {
    expect(countRecapTotals(questions, [yes("retired-question"), starred("retired-star")])).toEqual({ total: 4, answered: 0, remaining: 4, important: 0 });
  });
});

describe("buildRecapFilters", () => {
  it('offers only "all" and the topics when everything is answered and nothing starred', () => {
    const answers = [yes("q1"), yes("q2"), yes("q3"), yes("q4")];

    expect(buildRecapFilters(questions, answers, labels).map((option) => option.id)).toEqual(["all", "topic:Doprava", "topic:Bydlení"]);
  });

  it("offers the progress filters only when they would leave something", () => {
    expect(buildRecapFilters(questions, [starred("q1")], labels).map((option) => option.id)).toEqual(["all", "unanswered", "important", "topic:Doprava", "topic:Bydlení"]);
  });

  it("separates the topics from the progress filters exactly once", () => {
    const options = buildRecapFilters(questions, [], labels);

    expect(options.filter((option) => option.separatorBefore).map((option) => option.id)).toEqual(["topic:Doprava"]);
  });

  it("labels each chip and counts what it would leave", () => {
    expect(buildRecapFilters(questions, [], labels)).toEqual([
      { id: "all", label: "Vše", count: 4 },
      { id: "unanswered", label: "Přeskočené", count: 4 },
      { id: "topic:Doprava", label: "Doprava", count: 2, separatorBefore: true },
      { id: "topic:Bydlení", label: "Bydlení", count: 1, separatorBefore: false },
    ]);
  });

  it("counts on every offered chip exactly what its filter leaves", () => {
    // q1 answered, q3 starred: 3 remain unanswered, 1 is important.
    const answers: Answer[] = [yes("q1"), starred("q3")];

    expect(buildRecapFilters(questions, answers, labels).map((option) => [option.id, option.count])).toEqual([
      ["all", 4],
      ["unanswered", 3],
      ["important", 1],
      ["topic:Doprava", 2],
      ["topic:Bydlení", 1],
    ]);

    const left = (filter: Parameters<typeof filterRecapQuestions>[2]) => filterRecapQuestions(questions, answers, filter).map((entry) => entry.question.id);

    expect(left("all")).toEqual(["q1", "q2", "q3", "q4"]);
    expect(left("unanswered")).toEqual(["q2", "q3", "q4"]);
    expect(left("important")).toEqual(["q3"]);
    expect(left("topic:Doprava")).toEqual(["q1", "q2"]);
    expect(left("topic:Bydlení")).toEqual(["q3"]);
  });
});
