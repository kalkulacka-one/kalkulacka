import type { Answer, Candidate, CandidatesAnswers, ImageUrls, Question } from "@kalkulacka-one/schema";

import { findImageByType, resolveImageUrls } from "@/data-fetching";

import type { OrganizationViewModel } from "./organization";
import type { PersonViewModel } from "./person";

export type CandidateViewModel = Omit<Candidate, "nestedCandidates"> & {
  /**
   * The name as the legacy screens have always shown it — the short form for
   * an organization. Unchanged so those screens stay untouched; the new
   * screens read `name` and `shortName` instead.
   */
  displayName: string | undefined;
  /**
   * The full preferred name — a ranking row's headline. A coalition's own
   * `displayName` ("SPOLU"), else the referenced organization's `name` or the
   * person's display name, else the id: a candidate always resolves to
   * *something*, and a stray id on screen is a data bug made visible rather
   * than an empty row. Mirrors 2026's platform adapter.
   */
  name: string;
  /**
   * The short form for tight places — the comparison pane's heading and column,
   * an avatar's caption: the candidate's own `displayName`, else the
   * organization's short name (a person has none, so their name serves), else
   * `name`.
   */
  shortName: string;
  organization?: string | undefined;
  avatar?: {
    type: "avatar" | "logo" | "portrait";
    urls: ImageUrls;
  };
  type?: "person" | "organization";
  nestedCandidates?: CandidateViewModel[];
};

function getCandidateDisplayName(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): string | undefined {
  if (candidate.displayName) {
    return candidate.displayName;
  }

  const firstReference = candidate.references?.[0];
  if (firstReference) {
    if (firstReference.type === "person") {
      return personsMap.get(firstReference.id)?.displayName;
    }
    if (firstReference.type === "organization") {
      return organizationsMap.get(firstReference.id)?.displayName;
    }
  }

  return undefined;
}

/**
 * The full and the short name together, resolved once: the two must come from
 * the same reference, or a coalition's own `displayName` would head the row
 * while a member's short name labelled the column.
 */
function getCandidateNames(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): { name: string; shortName: string } {
  const referenced = getReferencedNames(candidate, personsMap, organizationsMap);
  const name = candidate.displayName ?? referenced?.name ?? candidate.id;
  return { name, shortName: candidate.displayName ?? referenced?.shortName ?? name };
}

/** What the first reference is called — an organization's two names, or a person's one name serving as both. */
function getReferencedNames(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): { name: string; shortName: string } | undefined {
  const firstReference = candidate.references?.[0];
  if (firstReference?.type === "organization") return organizationsMap.get(firstReference.id);
  if (firstReference?.type === "person") {
    const person = personsMap.get(firstReference.id);
    return person ? { name: person.displayName, shortName: person.displayName } : undefined;
  }
  return undefined;
}

function getCandidateOrganization(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): string | undefined {
  const firstReference = candidate.references?.[0];
  if (firstReference?.type === "person") {
    const person = personsMap.get(firstReference.id);
    if (person?.memberOf && person.memberOf.length > 0) {
      const firstOrganizationId = person.memberOf[0]?.id;
      return firstOrganizationId ? organizationsMap.get(firstOrganizationId)?.displayName : undefined;
    }
  }

  return undefined;
}

function getCandidateAvatar(
  candidate: Candidate,
  personsMap: Map<string, PersonViewModel>,
  organizationsMap: Map<string, OrganizationViewModel>,
  baseUrl: string,
): { type: "avatar" | "logo" | "portrait"; urls: ImageUrls } | undefined {
  const avatar = findImageByType(candidate.images, "avatar");
  if (avatar) return { type: "avatar", urls: resolveImageUrls(avatar.urls, baseUrl) };

  const logo = findImageByType(candidate.images, "logo");
  if (logo) return { type: "logo", urls: resolveImageUrls(logo.urls, baseUrl) };

  const portrait = findImageByType(candidate.images, "portrait");
  if (portrait) return { type: "portrait", urls: resolveImageUrls(portrait.urls, baseUrl) };

  const firstReference = candidate.references?.[0];
  if (!firstReference) return undefined;

  if (firstReference.type === "person") {
    return personsMap.get(firstReference.id)?.avatar;
  }

  if (firstReference.type === "organization") {
    return organizationsMap.get(firstReference.id)?.avatar;
  }

  return undefined;
}

function getCandidateType(candidate: Candidate): "person" | "organization" | undefined {
  const firstReference = candidate.references?.[0];
  if (!firstReference) return undefined;

  if (firstReference.type === "person") return "person";
  if (firstReference.type === "organization") return "organization";

  return undefined;
}

export function candidateViewModel(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>, baseUrl: string): CandidateViewModel {
  const displayName = getCandidateDisplayName(candidate, personsMap, organizationsMap);
  const { name, shortName } = getCandidateNames(candidate, personsMap, organizationsMap);
  const organization = getCandidateOrganization(candidate, personsMap, organizationsMap);
  const avatar = getCandidateAvatar(candidate, personsMap, organizationsMap, baseUrl);
  const type = getCandidateType(candidate);
  const nestedCandidates = candidate.nestedCandidates?.map((nested) => candidateViewModel(nested, personsMap, organizationsMap, baseUrl));

  return {
    ...candidate,
    displayName,
    name,
    shortName,
    organization,
    avatar,
    type,
    nestedCandidates,
  };
}

/**
 * The smallest picture the data layer serves — a stack of faces, or the small
 * avatar on a party's row, needs no more.
 */
export function avatarSrc(candidate: Pick<CandidateViewModel, "avatar">): string | undefined {
  const urls = candidate.avatar?.urls;
  if (!urls) return undefined;
  return urls.xs ?? urls.sm ?? urls.md ?? urls.original;
}

/** How many of a candidate's members voted the way the mark shows, out of how many voted at all. */
export type CandidateAnswerTally = { agreeing: number; total: number };

export type AnswerComparison = {
  questionId: string;
  questionText?: string;
  userAnswer: boolean | null | undefined;
  candidateAnswer: boolean | null | undefined;
  /** Present only where `candidateAnswer` summarises the members rather than being one recorded answer. */
  candidateTally?: CandidateAnswerTally;
  candidateComment?: string;
  candidateSources?: Answer["sources"];
  expertAnswer?: boolean | null | undefined;
  expertComment?: string;
  expertSources?: Answer["sources"];
  isImportant?: boolean;
};

/**
 * How a candidate's members voted on one question, reduced to the one answer a
 * single mark can carry — the majority — and the count behind it.
 *
 * An evenly split club has no majority to show, so it gets no mark at all
 * rather than an arbitrary one: "half of them voted each way" is not "Ano".
 * Abstentions are votes here, the same as they are in the score.
 */
function majorityAnswer(votes: Answer[]): { answer: boolean | null | undefined; tally: CandidateAnswerTally } | undefined {
  if (votes.length === 0) return undefined;

  const counts = new Map<string, { answer: boolean | null; count: number }>();
  for (const vote of votes) {
    if (vote.answer === undefined) continue;
    const key = String(vote.answer);
    const seen = counts.get(key);
    if (seen) seen.count += 1;
    else counts.set(key, { answer: vote.answer, count: 1 });
  }

  const ranked = [...counts.values()].sort((a, b) => b.count - a.count);
  const top = ranked[0];
  if (!top) return undefined;

  const total = ranked.reduce((sum, entry) => sum + entry.count, 0);
  const tied = ranked[1]?.count === top.count;

  return { answer: tied ? undefined : top.answer, tally: { agreeing: tied ? 0 : top.count, total } };
}

/**
 * The answers to show for a candidate that holds none of its own.
 *
 * In an Inventura hlasování a party never voted — its councillors did, one by
 * one. The score above already pools their votes; this pools them the other
 * way, into the one position a row can draw, so the comparison says what the
 * percentage is made of instead of showing an empty column beside it.
 */
function aggregatedFromMembers(nested: { id: string }[], candidatesAnswers: CandidatesAnswers): Map<string, { answer: boolean | null | undefined; tally: CandidateAnswerTally }> {
  const byQuestion = new Map<string, Answer[]>();
  for (const member of nested) {
    for (const answer of candidatesAnswers[member.id] ?? []) {
      const votes = byQuestion.get(answer.questionId);
      if (votes) votes.push(answer);
      else byQuestion.set(answer.questionId, [answer]);
    }
  }

  const aggregated = new Map<string, { answer: boolean | null | undefined; tally: CandidateAnswerTally }>();
  for (const [questionId, votes] of byQuestion) {
    const majority = majorityAnswer(votes);
    if (majority) aggregated.set(questionId, majority);
  }
  return aggregated;
}

export function getCandidateAnswerComparison(
  candidateId: string,
  userAnswers: Answer[],
  candidatesAnswers: CandidatesAnswers,
  questions: Question[] = [],
  /** The candidate's own members, where it has any — used only when it answered nothing itself. */
  nestedCandidates: { id: string }[] = [],
): AnswerComparison[] {
  const candidateAnswers = candidatesAnswers[candidateId] || [];
  const expertAnswers = candidatesAnswers.expert || [];

  /*
   * Only when the candidate answered nothing itself. A coalition that answered
   * as one and also lists its member parties keeps its own answers — summarising
   * its members would overwrite what it actually said.
   */
  const aggregated = candidateAnswers.length === 0 ? aggregatedFromMembers(nestedCandidates, candidatesAnswers) : undefined;

  // Create maps for quick lookup
  const userAnswersMap = new Map(userAnswers.map((answer) => [answer.questionId, answer]));
  const candidateAnswersMap = new Map(candidateAnswers.map((answer) => [answer.questionId, answer]));
  const expertAnswersMap = new Map(expertAnswers.map((answer) => [answer.questionId, answer]));

  // Iterate over the original questions array to preserve order
  return questions.map((question) => {
    const questionId = question.id;
    const userAnswer = userAnswersMap.get(questionId);
    const candidateAnswer = candidateAnswersMap.get(questionId);
    const expertAnswer = expertAnswersMap.get(questionId);

    const summarised = aggregated?.get(questionId);

    return {
      questionId,
      questionText: question?.statement || question?.title || questionId,
      userAnswer: userAnswer?.answer,
      candidateAnswer: summarised ? summarised.answer : candidateAnswer?.answer,
      ...(summarised ? { candidateTally: summarised.tally } : {}),
      candidateComment: candidateAnswer?.comment,
      candidateSources: candidateAnswer?.sources,
      expertAnswer: expertAnswer?.answer,
      expertComment: expertAnswer?.comment,
      expertSources: expertAnswer?.sources,
      isImportant: userAnswer?.isImportant,
    };
  });
}

export function hasDirectAnswers(candidateId: string, candidatesAnswers: CandidatesAnswers): boolean {
  return candidateId in candidatesAnswers && (candidatesAnswers[candidateId]?.length ?? 0) > 0;
}

/** As much of a candidate as the question below needs — satisfied by both the schema's shape and the view model's. */
type NestableCandidate = { id: string; nestedCandidates?: NestableCandidate[] };

/**
 * Whether a ranking of these candidates would be a ranking of nothing.
 *
 * An Inventura hlasování records the votes of the individual councillors, so
 * its `candidates-answers` are keyed by the nested candidates and the parties
 * above them hold none of their own. A list of those parties is the wrong
 * thing to land on: the answers — the actual votes — belong to the people.
 *
 * Asked of the data rather than of the calculator's variant key, so any
 * calculator published this way behaves the same without being named here.
 */
export function answersBelongToNestedCandidates(candidates: NestableCandidate[], candidatesAnswers: CandidatesAnswers): boolean {
  const nested = candidates.flatMap((candidate) => candidate.nestedCandidates ?? []);
  if (nested.length === 0) return false;

  const topLevelAnswered = candidates.some((candidate) => hasDirectAnswers(candidate.id, candidatesAnswers));
  const nestedAnswered = nested.some((candidate) => hasDirectAnswers(candidate.id, candidatesAnswers));

  return !topLevelAnswered && nestedAnswered;
}
