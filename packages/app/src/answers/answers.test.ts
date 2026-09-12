// Ported from kalkulacka-2026/packages/core/src/answers/answers.test.ts (the progress helpers), adapted to the `Answer[]` shape.
import type { Answer } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import { countAnswered, countSkipped, firstUnansweredIndex, hasAnswer, isVisited } from "./answers";

const questions = [{ id: "q1" }, { id: "q2" }, { id: "q3" }];

const yes = (questionId: string): Answer => ({ questionId, answer: true });
const no = (questionId: string): Answer => ({ questionId, answer: false });
const neutral = (questionId: string): Answer => ({ questionId, answer: null });
/* What the question page writes when a question is shown and then left without a position. */
const skipped = (questionId: string): Answer => ({ questionId });

describe("hasAnswer", () => {
  it("is true for yes, no and an explicit neutral", () => {
    expect(hasAnswer(yes("q1"))).toBe(true);
    expect(hasAnswer(no("q1"))).toBe(true);
    expect(hasAnswer(neutral("q1"))).toBe(true);
  });

  it("is false for a skip and for no entry at all", () => {
    expect(hasAnswer(skipped("q1"))).toBe(false);
    expect(hasAnswer(undefined)).toBe(false);
  });

  it("does not count an important flag as a position", () => {
    expect(hasAnswer({ questionId: "q1", isImportant: true })).toBe(false);
  });
});

describe("isVisited", () => {
  it("is true once the store has an entry, with or without a position", () => {
    expect(isVisited(yes("q1"))).toBe(true);
    expect(isVisited(skipped("q1"))).toBe(true);
  });

  it("is false for a question never reached", () => {
    expect(isVisited(undefined)).toBe(false);
  });
});

describe("countAnswered", () => {
  it("counts only real positions", () => {
    expect(countAnswered(questions, [yes("q1"), skipped("q2")])).toBe(1);
  });

  it("counts an explicit neutral as answered", () => {
    expect(countAnswered(questions, [neutral("q1"), no("q2")])).toBe(2);
  });

  it("is zero with nothing recorded", () => {
    expect(countAnswered(questions, [])).toBe(0);
  });

  it("ignores stored answers to questions this calculator no longer asks", () => {
    // Answers outlive a question set, and counting the stored answers rather
    // than the questions reported "43 z 42".
    expect(countAnswered(questions, [yes("q1"), yes("retired-question")])).toBe(1);
  });
});

describe("countSkipped", () => {
  it("counts questions visited without a position", () => {
    expect(countSkipped(questions, [yes("q1"), skipped("q2")])).toBe(1);
  });

  it("does not count questions never reached", () => {
    expect(countSkipped(questions, [yes("q1")])).toBe(0);
  });

  it("ignores skips of questions this calculator no longer asks", () => {
    expect(countSkipped(questions, [skipped("retired-question")])).toBe(0);
  });
});

describe("firstUnansweredIndex", () => {
  it("is the first question with no entry", () => {
    expect(firstUnansweredIndex(questions, [yes("q1")])).toBe(1);
  });

  it("treats a skip as visited", () => {
    expect(firstUnansweredIndex(questions, [yes("q1"), skipped("q2")])).toBe(2);
  });

  it("starts at the first question with nothing recorded", () => {
    expect(firstUnansweredIndex(questions, [])).toBe(0);
  });

  it("does not skip over a gap left in the middle", () => {
    expect(firstUnansweredIndex(questions, [yes("q1"), yes("q3")])).toBe(1);
  });

  it("is -1 once every question was visited", () => {
    expect(firstUnansweredIndex(questions, [yes("q1"), skipped("q2"), no("q3")])).toBe(-1);
  });

  it("ignores stored answers to questions this calculator no longer asks", () => {
    expect(firstUnansweredIndex(questions, [yes("retired-question")])).toBe(0);
  });
});
