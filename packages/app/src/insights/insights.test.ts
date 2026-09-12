// Ported from kalkulacka-2026/packages/core/src/insights/insights.test.ts, adapted to the `Answer[]` shape and this
// package's candidate view models. Every expected value is worked out by hand and written as a literal; the arithmetic
// sits next to the case it backs.
import type { Answer, Question } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import type { CandidateViewModel } from "@/view-models/candidate";
import type { CandidateAnswer } from "@/view-models/candidate-answer";

import { buildAnswerDistribution, buildAnswerGroups, buildQuestionConsensus, buildTopicMatches, MIN_TOPIC_ANSWERS, selectAgainstTheGrain, selectImportant, topicOf } from "./insights";

const question = (id: string, tags?: string[]): Question => (tags ? { id, title: id, statement: id, tags } : { id, title: id, statement: id });

const candidate = (id: string, nestedCandidates?: CandidateViewModel[]): CandidateViewModel =>
  nestedCandidates ? { id, displayName: id, name: id, shortName: id, references: [], nestedCandidates } : { id, displayName: id, name: id, shortName: id, references: [] };

const answersFor = (entries: Record<string, boolean | null>): CandidateAnswer[] => Object.entries(entries).map(([questionId, answer]) => ({ questionId, answer }));

const yes = (questionId: string): Answer => ({ questionId, answer: true });
const no = (questionId: string): Answer => ({ questionId, answer: false });
const neutral = (questionId: string): Answer => ({ questionId, answer: null });
/* What the question page writes when a question is shown and then left without a position. */
const skipped = (questionId: string): Answer => ({ questionId });
const important = (answer: Answer): Answer => ({ ...answer, isImportant: true });

/**
 * Four questions on "Doprava" so the topic clears `MIN_TOPIC_ANSWERS` with one
 * answer to spare, plus two on "Bydlení" so it falls under it — the two sides of
 * the threshold, in one fixture.
 */
const d1 = question("d1", ["Doprava"]);
const d2 = question("d2", ["Doprava"]);
const d3 = question("d3", ["Doprava"]);
const d4 = question("d4", ["Doprava"]);
const b1 = question("b1", ["Bydlení"]);
const b2 = question("b2", ["Bydlení"]);
/** No tag at all — must not become a topic of its own. */
const u1 = question("u1");

const questions = [d1, d2, d3, d4, b1, b2, u1];

const alfa = candidate("alfa");
const beta = candidate("beta");
const gama = candidate("gama");
/** Answers nothing at all — the KSČM case. */
const ghost = candidate("ghost");

/**
 * Three answering parties, not two: with only two, every split is one-all and a
 * minority can never form, so nothing would ever read as against the grain.
 */
const candidates = [alfa, beta, gama, ghost];

const candidatesAnswers: Record<string, CandidateAnswer[]> = {
  // Agrees with a yes-on-everything user across Doprava.
  alfa: answersFor({ d1: true, d2: true, d3: true, d4: true, b1: true, b2: false }),
  // Opposes on Doprava, agrees on Bydlení.
  beta: answersFor({ d1: false, d2: false, d3: false, d4: false, b1: true, b2: true }),
  // Breaks the ties: leaves the user in a minority of one on d4 and b2.
  gama: answersFor({ d1: true, d2: true, d3: true, d4: false, b1: true, b2: false }),
};

/** Yes to everything except u1, which is skipped. */
const allYes: Answer[] = [yes("d1"), yes("d2"), yes("d3"), yes("d4"), yes("b1"), yes("b2"), skipped("u1")];

describe("topicOf", () => {
  it("is the first tag only", () => {
    expect(topicOf(question("x", ["Doprava", "Ignored"]))).toBe("Doprava");
  });

  it("is undefined without tags", () => {
    expect(topicOf(question("x"))).toBeUndefined();
    expect(topicOf({ tags: [] })).toBeUndefined();
  });
});

describe("buildAnswerDistribution", () => {
  it("splits the questions across the four states", () => {
    expect(buildAnswerDistribution(questions, [yes("d1"), no("d2"), neutral("d3")])).toEqual({ agree: 1, disagree: 1, neutral: 1, unanswered: 4, total: 7 });
  });

  it("reads an explicit skip and a never-reached question the same", () => {
    expect(buildAnswerDistribution(questions, [skipped("d1")])).toEqual({ agree: 0, disagree: 0, neutral: 0, unanswered: 7, total: 7 });
  });

  it("always accounts for every question", () => {
    // Six yes answers plus the skipped u1: 6 + 0 + 0 + 1 = 7.
    expect(buildAnswerDistribution(questions, allYes)).toEqual({ agree: 6, disagree: 0, neutral: 0, unanswered: 1, total: 7 });
  });

  it("ignores stored answers to questions this calculator no longer asks", () => {
    expect(buildAnswerDistribution(questions, [yes("retired-question")])).toEqual({ agree: 0, disagree: 0, neutral: 0, unanswered: 7, total: 7 });
  });
});

describe("buildTopicMatches", () => {
  it("names the closest candidate for a topic", () => {
    // Doprava, user yes on d1–d4: alfa +4/4 → 100 %, beta −4/4 → 0 %, gama +2/4 → 75 %, ghost nothing to compare.
    expect(buildTopicMatches(questions, allYes, candidates, candidatesAnswers)).toEqual([{ topic: "Doprava", questionCount: 4, answeredCount: 4, best: { candidate: alfa, matchPercentage: 100 } }]);
  });

  it("drops a topic with too few answers behind it", () => {
    // Bydlení has two questions — one short of the threshold.
    expect(buildTopicMatches(questions, allYes, candidates, candidatesAnswers).map((match) => match.topic)).toEqual(["Doprava"]);
  });

  it("counts answers rather than questions against the threshold", () => {
    // Every Doprava question exists, but only two were answered.
    expect(buildTopicMatches(questions, [yes("d1"), yes("d2")], candidates, candidatesAnswers)).toEqual([]);
  });

  it("lets the threshold be lowered", () => {
    expect(buildTopicMatches(questions, allYes, candidates, candidatesAnswers, 2).map((match) => match.topic)).toEqual(["Doprava", "Bydlení"]);
  });

  it("scores a topic only on that topic's own questions", () => {
    // beta opposes on all of Doprava but agrees on Bydlení, so it must win
    // Bydlení outright despite losing overall: alfa 0/2 → 50 %, beta +2/2 → 100 %, gama 0/2 → 50 %.
    const [, bydleni] = buildTopicMatches(questions, allYes, candidates, candidatesAnswers, 2);

    expect(bydleni).toEqual({ topic: "Bydlení", questionCount: 2, answeredCount: 2, best: { candidate: beta, matchPercentage: 100 } });
  });

  it("ignores questions with no topic", () => {
    expect(buildTopicMatches(questions, allYes, candidates, candidatesAnswers, 1).map((match) => match.topic)).toEqual(["Doprava", "Bydlení"]);
  });

  it("reports how much the number rests on", () => {
    // Three of the four Doprava questions answered: alfa +3/3 and gama +3/3 tie
    // at 100 %, and the tie goes to the lower id.
    expect(buildTopicMatches(questions, [yes("d1"), yes("d2"), yes("d3")], candidates, candidatesAnswers)).toEqual([
      { topic: "Doprava", questionCount: 4, answeredCount: 3, best: { candidate: alfa, matchPercentage: 100 } },
    ]);
  });

  it("orders by how many answers back the topic, not by score", () => {
    expect(buildTopicMatches(questions, allYes, candidates, candidatesAnswers, 1).map((match) => match.answeredCount)).toEqual([4, 2]);
  });

  it("defaults the threshold to the exported constant", () => {
    expect(MIN_TOPIC_ANSWERS).toBe(3);

    // Exactly three Doprava answers clear the default; the two Bydlení answers do not.
    const threeAndTwo = [yes("d1"), yes("d2"), yes("d3"), yes("b1"), yes("b2")];
    expect(buildTopicMatches(questions, threeAndTwo, candidates, candidatesAnswers).map((match) => match.topic)).toEqual(["Doprava"]);
  });

  it("breaks a tie on candidate id, whatever the candidates' order", () => {
    const tied = [question("x1", ["Tie"]), question("x2", ["Tie"]), question("x3", ["Tie"])];
    const second = candidate("b-strana");
    const first = candidate("a-strana");
    const tiedAnswers = { "b-strana": answersFor({ x1: true, x2: true, x3: true }), "a-strana": answersFor({ x1: true, x2: true, x3: true }) };

    expect(buildTopicMatches(tied, [yes("x1"), yes("x2"), yes("x3")], [second, first], tiedAnswers)).toEqual([
      { topic: "Tie", questionCount: 3, answeredCount: 3, best: { candidate: first, matchPercentage: 100 } },
    ]);
  });

  it("never names a candidate with nothing comparable in the topic", () => {
    // With only ghost there is no percentage to show, so the topic is left out
    // even though the user answered enough; beta alone is named at 0 %.
    expect(buildTopicMatches(questions, allYes, [ghost], candidatesAnswers)).toEqual([]);
    expect(buildTopicMatches(questions, allYes, [ghost, beta], candidatesAnswers)).toEqual([{ topic: "Doprava", questionCount: 4, answeredCount: 4, best: { candidate: beta, matchPercentage: 0 } }]);
  });
});

describe("buildQuestionConsensus", () => {
  it("sorts the candidates onto each side", () => {
    const [first] = buildQuestionConsensus(questions, allYes, candidates, candidatesAnswers);

    expect(first).toEqual({ question: d1, userAnswer: true, important: false, agreeing: [alfa, gama], opposing: [beta], respondedCount: 3 });
  });

  it("covers every answered question in question order and leaves out the rest", () => {
    const ids = buildQuestionConsensus(questions, allYes, candidates, candidatesAnswers).map((entry) => entry.question.id);

    expect(ids).toEqual(["d1", "d2", "d3", "d4", "b1", "b2"]);
  });

  it("does not count a candidate who never answered as responding", () => {
    const [first] = buildQuestionConsensus(questions, allYes, candidates, candidatesAnswers);

    // alfa, beta and gama answered; ghost did not.
    expect(first?.respondedCount).toBe(3);
  });

  it("puts a neutral on neither side but still counts it as a response", () => {
    const withNeutral = { ...candidatesAnswers, alfa: answersFor({ d1: null }) };

    // alfa's neutral counts as a response but joins neither side.
    expect(buildQuestionConsensus(questions, [yes("d1")], candidates, withNeutral)).toEqual([
      { question: d1, userAnswer: true, important: false, agreeing: [gama], opposing: [beta], respondedCount: 3 },
    ]);
  });

  it("puts everyone on neither side when the user's own answer is neutral", () => {
    expect(buildQuestionConsensus(questions, [neutral("d1")], candidates, candidatesAnswers)).toEqual([
      { question: d1, userAnswer: null, important: false, agreeing: [], opposing: [], respondedCount: 3 },
    ]);
  });

  it("carries the important flag through", () => {
    expect(buildQuestionConsensus(questions, [important(yes("d1"))], candidates, candidatesAnswers)[0]?.important).toBe(true);
  });

  it("ignores stored answers to questions this calculator no longer asks", () => {
    expect(buildQuestionConsensus(questions, [yes("retired-question")], candidates, candidatesAnswers)).toEqual([]);
  });
});

describe("selectImportant", () => {
  it("keeps only the starred questions, in question order", () => {
    const starred = allYes.map((answer) => (answer.questionId === "b1" || answer.questionId === "d2" ? important(answer) : answer));
    const picked = selectImportant(buildQuestionConsensus(questions, starred, candidates, candidatesAnswers));

    expect(picked.map((entry) => entry.question.id)).toEqual(["d2", "b1"]);
  });
});

describe("selectAgainstTheGrain", () => {
  it("surfaces the questions where fewest parties stood with you", () => {
    // d4 and b2 each leave the user with one party of three (a share of a
    // third); d1–d3 and b1 have the user in the majority. Same share and same
    // respondent count, so the id decides: b2 before d4.
    const picked = selectAgainstTheGrain(buildQuestionConsensus(questions, allYes, candidates, candidatesAnswers));

    expect(picked.map((entry) => entry.question.id)).toEqual(["b2", "d4"]);
  });

  it("leaves out questions where you were in the majority", () => {
    // All three candidates agree on b1 — nothing contrarian about it.
    expect(selectAgainstTheGrain(buildQuestionConsensus(questions, [yes("b1")], candidates, candidatesAnswers))).toEqual([]);
  });

  it("respects the limit", () => {
    const picked = selectAgainstTheGrain(buildQuestionConsensus(questions, allYes, candidates, candidatesAnswers), 1);

    expect(picked.map((entry) => entry.question.id)).toEqual(["b2"]);
  });

  it("judges by share rather than raw count", () => {
    // `few` drew one response and it opposed — a share of 0. `many` drew three,
    // one of which agreed — a share of a third, but two opponents rather than
    // one. Ranking on the raw number of opponents would invert these.
    const sparse = [question("few"), question("many")];
    const sparseAnswers = {
      alfa: answersFor({ few: false, many: true }),
      beta: answersFor({ many: false }),
      gama: answersFor({ many: false }),
    };

    const picked = selectAgainstTheGrain(buildQuestionConsensus(sparse, [yes("few"), yes("many")], candidates, sparseAnswers));

    expect(picked.map((entry) => entry.question.id)).toEqual(["few", "many"]);
  });

  it("prefers more respondents at the same share", () => {
    // Both leave the user with nobody; `q` was answered by two parties, `p` by one.
    const pair = [question("p"), question("q")];
    const pairAnswers = { alfa: answersFor({ p: false, q: false }), beta: answersFor({ q: false }) };

    const picked = selectAgainstTheGrain(buildQuestionConsensus(pair, [yes("p"), yes("q")], candidates, pairAnswers));

    expect(picked.map((entry) => entry.question.id)).toEqual(["q", "p"]);
  });

  it("drops questions nobody answered", () => {
    const lonely = [question("lonely")];

    expect(selectAgainstTheGrain(buildQuestionConsensus(lonely, [yes("lonely")], candidates, {}))).toEqual([]);
  });
});

describe("buildAnswerGroups", () => {
  // Every kind of stance in one place: yes, no, an explicit "nevím" carrying a
  // comment, and a candidate with no record at all.
  const mixed = [d1, u1];
  const mixedAnswers: Record<string, CandidateAnswer[]> = {
    alfa: [
      { questionId: "d1", answer: true, comment: "pro" },
      { questionId: "u1", answer: false },
    ],
    beta: [{ questionId: "d1", answer: false }],
    gama: [{ questionId: "d1", answer: null, comment: "váháme" }],
  };

  it("covers every question, answered by the user or not", () => {
    expect(buildAnswerGroups(mixed, candidates, mixedAnswers).map((group) => group.question.id)).toEqual(["d1", "u1"]);
  });

  it("sorts candidates by their own answer and keeps comments", () => {
    const [d1Groups] = buildAnswerGroups(mixed, candidates, mixedAnswers);

    expect(d1Groups?.yes).toEqual([{ candidate: alfa, answer: true, comment: "pro" }]);
    expect(d1Groups?.no).toEqual([{ candidate: beta, answer: false }]);
  });

  it("merges neutrals and silent candidates into one group, neutrals first", () => {
    const [d1Groups] = buildAnswerGroups(mixed, candidates, mixedAnswers);

    // The neutral is a recorded answer — its comment survives; the silent
    // candidate has no answer to distinguish from "nevím" except `undefined`.
    expect(d1Groups?.other).toEqual([{ candidate: gama, answer: null, comment: "váháme" }, { candidate: ghost }]);
    expect(d1Groups?.other[1]?.answer).toBeUndefined();
  });

  it("accounts for every candidate on every question", () => {
    const [, u1Groups] = buildAnswerGroups(mixed, candidates, mixedAnswers);

    expect(u1Groups).toEqual({ question: u1, yes: [], no: [{ candidate: alfa, answer: false }], other: [{ candidate: beta }, { candidate: gama }, { candidate: ghost }] });
  });

  it("treats a recorded entry without a position as silent", () => {
    const blank: Record<string, CandidateAnswer[]> = { alfa: [{ questionId: "d1" }] };

    expect(buildAnswerGroups([d1], [alfa], blank)).toEqual([{ question: d1, yes: [], no: [], other: [{ candidate: alfa }] }]);
  });
});

/**
 * Six questions across three topics and three candidates, with every case the
 * dashboard has to get right at once: an important answer, a skipped question,
 * an explicit neutral, a question never reached, a candidate silent on a
 * question, and a coalition with no answers of its own that is scored on its
 * two members.
 */
describe("shared fixture", () => {
  const dop1 = question("dop1", ["Doprava"]);
  const dop2 = question("dop2", ["Doprava"]);
  const dop3 = question("dop3", ["Doprava"]);
  const byd1 = question("byd1", ["Bydlení"]);
  const byd2 = question("byd2", ["Bydlení"]);
  const kul1 = question("kul1", ["Kultura"]);
  const fixtureQuestions = [dop1, dop2, dop3, byd1, byd2, kul1];

  const levice = candidate("levice");
  const zeleni = candidate("zeleni");
  /** The coalition — nested members, no entry of its own in the answers. */
  const koalice = candidate("koalice", [levice, zeleni]);
  const fixtureCandidates = [alfa, beta, koalice];

  const fixtureCandidatesAnswers: Record<string, CandidateAnswer[]> = {
    alfa: [
      { questionId: "dop1", answer: true, comment: "pro" },
      { questionId: "dop2", answer: true },
      { questionId: "dop3", answer: true },
      { questionId: "byd1", answer: true },
      { questionId: "byd2", answer: false },
      { questionId: "kul1", answer: true },
    ],
    // Silent on byd1.
    beta: [
      { questionId: "dop1", answer: false },
      { questionId: "dop2", answer: true },
      { questionId: "dop3", answer: null, comment: "váháme" },
      { questionId: "byd2", answer: true },
      { questionId: "kul1", answer: false },
    ],
    levice: [
      { questionId: "dop1", answer: true },
      { questionId: "dop2", answer: false },
      { questionId: "dop3", answer: false },
      { questionId: "byd1", answer: false },
      { questionId: "byd2", answer: true },
      { questionId: "kul1", answer: false, comment: "jen levice" },
    ],
    // Silent on kul1.
    zeleni: [
      { questionId: "dop1", answer: true },
      { questionId: "dop2", answer: false },
      { questionId: "dop3", answer: true },
      { questionId: "byd1", answer: null },
      { questionId: "byd2", answer: true },
    ],
  };

  /** dop1 yes and important, dop2 no, dop3 neutral, byd1 yes, byd2 skipped, kul1 never reached. */
  const fixtureAnswers: Answer[] = [important(yes("dop1")), no("dop2"), neutral("dop3"), yes("byd1"), skipped("byd2")];

  it("distributes the answers, merging the skip and the unreached question", () => {
    expect(buildAnswerDistribution(fixtureQuestions, fixtureAnswers)).toEqual({ agree: 2, disagree: 1, neutral: 1, unanswered: 2, total: 6 });
  });

  it("scores a coalition on its members with the ranking's maths", () => {
    // Doprava, answered dop1 (yes, important — doubled), dop2 (no), dop3 (neutral):
    //   alfa     dop1 +2/2 · dop2 −1/1 · dop3 0/1                     → +1/4 → 62.5 %
    //   beta     dop1 −2/2 · dop2 −1/1 · dop3 0/1                     → −3/4 → 12.5 %
    //   koalice  levice +2/2 +1/1 0/1 and zeleni +2/2 +1/1 0/1        → +6/8 → 87.5 %
    // Bydlení has one answer and Kultura none, so both stay under the threshold.
    expect(buildTopicMatches(fixtureQuestions, fixtureAnswers, fixtureCandidates, fixtureCandidatesAnswers)).toEqual([
      { topic: "Doprava", questionCount: 3, answeredCount: 3, best: { candidate: koalice, matchPercentage: 87.5 } },
    ]);
  });

  it("scores a coalition on its own entry when it has one, like the ranking does", () => {
    // koalice now files its own Doprava answers: dop1 −2/2 · dop2 +1/1 · dop3 0/1 → −1/4 → 37.5 %, so alfa leads.
    const withOwn = { ...fixtureCandidatesAnswers, koalice: answersFor({ dop1: false, dop2: false, dop3: false }) };

    expect(buildTopicMatches(fixtureQuestions, fixtureAnswers, fixtureCandidates, withOwn)).toEqual([
      { topic: "Doprava", questionCount: 3, answeredCount: 3, best: { candidate: alfa, matchPercentage: 62.5 } },
    ]);
  });

  it("orders a topic with more answers first even when a thinner topic scores higher", () => {
    // Bydlení, answered byd1 (yes) only: alfa +1/1 → 100 %, beta silent → not comparable,
    // koalice levice −1/1 and zeleni 0/1 → −1/2 → 25 %. Its 100 % beats Doprava's
    // 87.5 %, yet Doprava rests on three answers and comes first. Kultura has no
    // answers at all and is dropped even with the threshold at one.
    expect(buildTopicMatches(fixtureQuestions, fixtureAnswers, fixtureCandidates, fixtureCandidatesAnswers, 1)).toEqual([
      { topic: "Doprava", questionCount: 3, answeredCount: 3, best: { candidate: koalice, matchPercentage: 87.5 } },
      { topic: "Bydlení", questionCount: 2, answeredCount: 1, best: { candidate: alfa, matchPercentage: 100 } },
    ]);
  });

  it("sorts every answered question, counting a coalition as one respondent", () => {
    expect(buildQuestionConsensus(fixtureQuestions, fixtureAnswers, fixtureCandidates, fixtureCandidatesAnswers)).toEqual([
      // alfa yes, beta no; both members yes.
      { question: dop1, userAnswer: true, important: true, agreeing: [alfa, koalice], opposing: [beta], respondedCount: 3 },
      // User no: alfa and beta yes oppose; both members no agree.
      { question: dop2, userAnswer: false, important: false, agreeing: [koalice], opposing: [alfa, beta], respondedCount: 3 },
      // User neutral: everyone responded, nobody takes a side.
      { question: dop3, userAnswer: null, important: false, agreeing: [], opposing: [], respondedCount: 3 },
      // beta is silent; levice no and zeleni neutral net to opposing.
      { question: byd1, userAnswer: true, important: false, agreeing: [alfa], opposing: [koalice], respondedCount: 2 },
    ]);
  });

  it("picks the starred question and the one where the user was outnumbered", () => {
    const consensus = buildQuestionConsensus(fixtureQuestions, fixtureAnswers, fixtureCandidates, fixtureCandidatesAnswers);

    expect(selectImportant(consensus)).toEqual([{ question: dop1, userAnswer: true, important: true, agreeing: [alfa, koalice], opposing: [beta], respondedCount: 3 }]);
    // Only dop2 has fewer agreeing than opposing; byd1 is one-all.
    expect(selectAgainstTheGrain(consensus)).toEqual([{ question: dop2, userAnswer: false, important: false, agreeing: [koalice], opposing: [alfa, beta], respondedCount: 3 }]);
  });

  it("groups every question by stance, reading a split coalition as neutral", () => {
    expect(buildAnswerGroups(fixtureQuestions, fixtureCandidates, fixtureCandidatesAnswers)).toEqual([
      {
        question: dop1,
        yes: [
          { candidate: alfa, answer: true, comment: "pro" },
          { candidate: koalice, answer: true },
        ],
        no: [{ candidate: beta, answer: false }],
        other: [],
      },
      {
        question: dop2,
        yes: [
          { candidate: alfa, answer: true },
          { candidate: beta, answer: true },
        ],
        no: [{ candidate: koalice, answer: false }],
        other: [],
      },
      // levice no and zeleni yes cancel out: the coalition reads as neutral, after beta's own neutral.
      {
        question: dop3,
        yes: [{ candidate: alfa, answer: true }],
        no: [],
        other: [
          { candidate: beta, answer: null, comment: "váháme" },
          { candidate: koalice, answer: null },
        ],
      },
      // beta is silent; levice no and zeleni neutral net to no.
      { question: byd1, yes: [{ candidate: alfa, answer: true }], no: [{ candidate: koalice, answer: false }], other: [{ candidate: beta }] },
      {
        question: byd2,
        yes: [
          { candidate: beta, answer: true },
          { candidate: koalice, answer: true },
        ],
        no: [{ candidate: alfa, answer: false }],
        other: [],
      },
      // Only levice answered for the coalition, so its comment is the coalition's.
      {
        question: kul1,
        yes: [{ candidate: alfa, answer: true }],
        no: [
          { candidate: beta, answer: false },
          { candidate: koalice, answer: false, comment: "jen levice" },
        ],
        other: [],
      },
    ]);
  });
});
