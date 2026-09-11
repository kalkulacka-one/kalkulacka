// Ported from kalkulacka-2026/packages/core/src/insights/insights.ts (and `topicOf` from recap/recap.ts), adapted to the
// schema's `Answer[]` and `Question`, this package's `CandidateViewModel` / `CandidateAnswer` shapes, and its
// `result-calculation` primitives — which are reused as they are so every number here agrees with `calculateMatches`.
import type { Answer, Question } from "@kalkulacka-one/schema";

import { answersByQuestion, hasAnswer } from "@/answers";
import { aggregateAnswersMatchScore } from "@/result-calculation/aggregate-answers-match-score";
import { booleanAnswerToNumber } from "@/result-calculation/boolean-answer-to-number";
import { calculateMatchScorePercentage } from "@/result-calculation/calculate-match-score-percentage";
import { processSingleAnswer } from "@/result-calculation/process-single-answer";
import type { CandidateAnswer, CandidateViewModel } from "@/view-models";

/**
 * What the results dashboard reads off the answers.
 *
 * Same reasoning as `recap.ts`: the shapes here are presentational, but every
 * judgement in them — which topics carry enough answers to be worth a number,
 * what counts as agreeing with a party, which questions put you in a minority —
 * is domain logic with consequences, and it must agree with the percentage
 * `calculateMatches` produced. So it is computed from the same primitives, in
 * one place, and tested without rendering a screen.
 */

/** Candidates' answers keyed by candidate id — the calculator's `candidatesAnswers`, or its view model. */
export type CandidatesAnswersLookup = Record<string, CandidateAnswer[]>;

/**
 * A question's topic — the first tag, or none.
 *
 * Only the first tag is ever shown or filtered on, so the "which one counts"
 * decision lives in one place rather than at each `tags[0]`.
 */
export function topicOf(question: Pick<Question, "tags">): string | undefined {
  return question.tags?.[0];
}

/* --- The answers a candidate is scored on --------------------------------- */

type ScoredCandidate = {
  candidate: CandidateViewModel;
  /** Every answer the candidate is scored on, in data order — what `calculateMatches` feeds `aggregateAnswersMatchScore`. */
  answers: CandidateAnswer[];
  /** The same answers grouped by question; a coalition scored on its members can hold several per question. */
  byQuestion: Map<string, CandidateAnswer[]>;
};

/**
 * The answers a candidate is scored on.
 *
 * Mirrors `calculateMatches` exactly: a candidate with an entry of its own is
 * scored on that entry (even an empty one), and only a candidate with no entry
 * at all is represented by its nested members' answers, flattened — so a
 * coalition that filed nothing is scored on its members. Resolved in one place
 * so the percentage on the ranking and the numbers on the dashboard come from
 * the same answers; deriving them twice is how the two quietly drift apart.
 */
function scoredAnswersFor(candidate: CandidateViewModel, candidatesAnswers: CandidatesAnswersLookup): CandidateAnswer[] {
  if (candidate.id in candidatesAnswers) return candidatesAnswers[candidate.id] ?? [];

  return (candidate.nestedCandidates ?? []).flatMap((member) => candidatesAnswers[member.id] ?? []);
}

/**
 * Indexed once and reused across every topic and question — resolving a
 * coalition's members' answers per topic per candidate is the same work
 * repeated eleven times.
 */
function indexScoredAnswers(candidates: readonly CandidateViewModel[], candidatesAnswers: CandidatesAnswersLookup): ScoredCandidate[] {
  return candidates.map((candidate) => {
    const answers = scoredAnswersFor(candidate, candidatesAnswers);
    const byQuestion = new Map<string, CandidateAnswer[]>();

    for (const answer of answers) {
      const bucket = byQuestion.get(answer.questionId);
      if (bucket) bucket.push(answer);
      else byQuestion.set(answer.questionId, [answer]);
    }

    return { candidate, answers, byQuestion };
  });
}

/* --- How you answered ----------------------------------------------------- */

/**
 * The donut on the dashboard.
 *
 * `unanswered` merges explicitly-skipped with never-reached, the same call the
 * recap makes: both are "no position taken", and the results screen doesn't act
 * on the difference any more than the recap did.
 */
export type AnswerDistribution = {
  agree: number;
  disagree: number;
  /** Explicit "nevím" — a real answer that carries no direction. */
  neutral: number;
  unanswered: number;
  total: number;
};

export function buildAnswerDistribution(questions: readonly Pick<Question, "id">[], answers: readonly Answer[]): AnswerDistribution {
  const lookup = answersByQuestion(answers);
  const distribution: AnswerDistribution = { agree: 0, disagree: 0, neutral: 0, unanswered: 0, total: questions.length };

  for (const question of questions) {
    const answer = lookup.get(question.id)?.answer;

    if (answer === true) distribution.agree += 1;
    else if (answer === false) distribution.disagree += 1;
    else if (answer === null) distribution.neutral += 1;
    else distribution.unanswered += 1;
  }

  return distribution;
}

/* --- Who is closest to you, topic by topic -------------------------------- */

export type TopicMatch = {
  topic: string;
  /** Questions carrying this topic, answered or not. */
  questionCount: number;
  /** …that you actually took a position on. This is what the number rests on. */
  answeredCount: number;
  /** The closest candidate over just these questions. */
  best: { candidate: CandidateViewModel; matchPercentage: number };
};

/**
 * Topics you gave fewer than this many answers on are left out entirely.
 *
 * Four of Pardubice's eleven topics carry one or two questions. A single
 * answered question yields 0 % or 100 % and would sit in the list looking
 * exactly like a number derived from ten — so the cheap fix (showing the count
 * next to it) isn't enough. The row is only offered once it means something.
 */
export const MIN_TOPIC_ANSWERS = 3;

/**
 * Per-topic ranking, strongest topic first.
 *
 * "Strongest" is how many answers back it, not how high the percentage is:
 * ordering by score would put a 3-question topic above a 10-question one for
 * being easier to max out, which is the opposite of how much it should be
 * trusted.
 */
export function buildTopicMatches(
  questions: readonly Question[],
  answers: readonly Answer[],
  candidates: readonly CandidateViewModel[],
  candidatesAnswers: CandidatesAnswersLookup,
  minAnswers: number = MIN_TOPIC_ANSWERS,
): TopicMatch[] {
  const byTopic = new Map<string, Question[]>();

  for (const question of questions) {
    const topic = topicOf(question);
    if (!topic) continue;

    const bucket = byTopic.get(topic);
    if (bucket) bucket.push(question);
    else byTopic.set(topic, [question]);
  }

  const scored = indexScoredAnswers(candidates, candidatesAnswers);
  const lookup = answersByQuestion(answers);
  const matches: TopicMatch[] = [];

  for (const [topic, topicQuestions] of byTopic) {
    const answered = topicQuestions.map((question) => lookup.get(question.id)).filter((answer): answer is Answer => hasAnswer(answer));

    if (answered.length < minAnswers) continue;

    let best: TopicMatch["best"] | undefined;

    for (const { candidate, answers: candidateAnswers } of scored) {
      // The ranking's own maths, restricted to this topic's answered questions:
      // `aggregateAnswersMatchScore` sums `processSingleAnswer` over every pair.
      const matchPercentage = calculateMatchScorePercentage(aggregateAnswersMatchScore(answered, candidateAnswers));
      if (matchPercentage === undefined) continue;

      // Ties break on candidate id so repeated runs, and server and client,
      // agree on which of two equally-close parties is named.
      const better = best === undefined || matchPercentage > best.matchPercentage || (matchPercentage === best.matchPercentage && candidate.id.localeCompare(best.candidate.id) < 0);

      if (better) best = { candidate, matchPercentage };
    }

    if (best) {
      matches.push({ topic, questionCount: topicQuestions.length, answeredCount: answered.length, best });
    }
  }

  return matches.sort((a, b) => b.answeredCount - a.answeredCount || a.topic.localeCompare(b.topic));
}

/* --- Every party's answer, question by question ---------------------------- */

/** One candidate's stance on one question, comment included. */
export type CandidatePosition = {
  candidate: CandidateViewModel;
  /** `null` is an explicit "nevím"; `undefined` means no answer was recorded. */
  answer?: boolean | null;
  comment?: string;
};

export type QuestionAnswerGroups = {
  question: Question;
  /** Candidates who answered "ano". */
  yes: CandidatePosition[];
  /** Candidates who answered "ne". */
  no: CandidatePosition[];
  /**
   * "Nevím" plus candidates with no recorded answer, neutrals first. Kept as
   * one group because the view treats both as "took no side" — but the
   * per-entry `answer` still tells them apart, and a neutral can carry a
   * comment worth showing.
   */
  other: CandidatePosition[];
};

/**
 * The direction of a set of answers to one question, as the score sees them.
 *
 * `undefined` when none of them records a position.
 */
function stanceOf(answers: readonly CandidateAnswer[]): boolean | null | undefined {
  let sum = 0;
  let counted = 0;

  for (const answer of answers) {
    const value = booleanAnswerToNumber(answer.answer);
    if (value === undefined) continue;

    sum += value;
    counted += 1;
  }

  if (counted === 0) return undefined;
  if (sum > 0) return true;
  if (sum < 0) return false;
  return null;
}

/**
 * A candidate's position on one question, from the answers it is scored on.
 *
 * A candidate with answers of its own has exactly one, and the position is that
 * answer, comment included. A coalition scored on its members can have several:
 * the position is the direction of their sum — the same +1 / −1 / 0 values the
 * score is built from — so a split coalition reads as neutral rather than as
 * whichever member happened to come last. A comment survives only when there is
 * a single recorded answer to take it from.
 */
function positionOn(candidate: CandidateViewModel, answers: readonly CandidateAnswer[]): CandidatePosition {
  const recorded = answers.filter((answer) => answer.answer !== undefined);
  const answer = stanceOf(recorded);
  if (answer === undefined) return { candidate };

  const comment = recorded.length === 1 ? recorded[0]?.comment : undefined;
  return comment ? { candidate, answer, comment } : { candidate, answer };
}

/**
 * All candidates sorted by their own answer, for every question.
 *
 * Unlike `buildQuestionConsensus` this is user-independent: it covers questions
 * the user skipped, and it groups by what the party said rather than by
 * agreement with the user. The comparison view lays the user's own answer over
 * it. Candidates keep the calculator's order within each group; the caller
 * re-sorts by ranking where that matters.
 */
export function buildAnswerGroups(questions: readonly Question[], candidates: readonly CandidateViewModel[], candidatesAnswers: CandidatesAnswersLookup): QuestionAnswerGroups[] {
  const scored = indexScoredAnswers(candidates, candidatesAnswers);

  return questions.map((question): QuestionAnswerGroups => {
    const yes: CandidatePosition[] = [];
    const no: CandidatePosition[] = [];
    const neutral: CandidatePosition[] = [];
    const silent: CandidatePosition[] = [];

    for (const { candidate, byQuestion } of scored) {
      const position = positionOn(candidate, byQuestion.get(question.id) ?? []);

      if (position.answer === undefined) silent.push(position);
      else if (position.answer === true) yes.push(position);
      else if (position.answer === false) no.push(position);
      else neutral.push(position);
    }

    return { question, yes, no, other: [...neutral, ...silent] };
  });
}

/* --- Where each question left you ----------------------------------------- */

export type QuestionConsensus = {
  question: Question;
  /** Never `undefined` — only questions you answered appear. */
  userAnswer: boolean | null;
  important: boolean;
  /** Candidates who took the same side. */
  agreeing: CandidateViewModel[];
  /** Candidates who took the opposite side. */
  opposing: CandidateViewModel[];
  /**
   * Candidates who recorded any position at all, including neutrals that fall
   * into neither list. The denominator for "how alone was I here".
   */
  respondedCount: number;
};

/**
 * Every question you answered, with the parties sorted onto your side and against it.
 *
 * One pass over the data feeding two dashboard cards, because both ask the same
 * underlying question — who agreed with you here — and computing it twice is how
 * two cards on the same screen end up disagreeing.
 */
export function buildQuestionConsensus(
  questions: readonly Question[],
  answers: readonly Answer[],
  candidates: readonly CandidateViewModel[],
  candidatesAnswers: CandidatesAnswersLookup,
): QuestionConsensus[] {
  const scored = indexScoredAnswers(candidates, candidatesAnswers);
  const lookup = answersByQuestion(answers);

  return questions.flatMap((question): QuestionConsensus[] => {
    const recorded = lookup.get(question.id);
    if (recorded === undefined || recorded.answer === undefined) return [];

    const agreeing: CandidateViewModel[] = [];
    const opposing: CandidateViewModel[] = [];
    let respondedCount = 0;

    for (const { candidate, byQuestion } of scored) {
      // The scoring step the percentage is built from, summed over the answers
      // the candidate is scored on — one for a party, one per member for a
      // coalition. The important flag doubles both sides and cannot flip the sign.
      let score = 0;
      let weight = 0;

      for (const theirs of byQuestion.get(question.id) ?? []) {
        const step = processSingleAnswer(recorded, theirs);
        score += step.score;
        weight += step.weight;
      }

      if (weight === 0) continue;
      respondedCount += 1;

      // A neutral on either side lands in neither list — it is a real answer
      // that simply takes no side, the same rule the comparison uses.
      if (score > 0) agreeing.push(candidate);
      else if (score < 0) opposing.push(candidate);
    }

    return [{ question, userAnswer: recorded.answer, important: recorded.isImportant === true, agreeing, opposing, respondedCount }];
  });
}

/** The questions you starred, in question order. */
export function selectImportant(consensus: readonly QuestionConsensus[]): QuestionConsensus[] {
  return consensus.filter((entry) => entry.important);
}

/**
 * The questions where you stood with the fewest parties.
 *
 * Ranked by the *share* that agreed rather than the count, so a question only
 * three parties answered is judged on those three. Questions nobody answered
 * carry no information about how alone you were and are dropped.
 */
export function selectAgainstTheGrain(consensus: readonly QuestionConsensus[], limit = 3): QuestionConsensus[] {
  return consensus
    .filter((entry) => entry.respondedCount > 0 && entry.agreeing.length < entry.opposing.length)
    .sort((a, b) => {
      const shareA = a.agreeing.length / a.respondedCount;
      const shareB = b.agreeing.length / b.respondedCount;

      // More respondents is a stronger signal at the same share, so it wins the
      // tie; question id last, so the list is stable run to run.
      return shareA - shareB || b.respondedCount - a.respondedCount || a.question.id.localeCompare(b.question.id);
    })
    .slice(0, limit);
}
