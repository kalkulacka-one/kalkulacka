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

export type AnswerComparison = {
  questionId: string;
  questionText?: string;
  userAnswer: boolean | null | undefined;
  candidateAnswer: boolean | null | undefined;
  candidateComment?: string;
  candidateSources?: Answer["sources"];
  expertAnswer?: boolean | null | undefined;
  expertComment?: string;
  expertSources?: Answer["sources"];
  isImportant?: boolean;
};

export function getCandidateAnswerComparison(candidateId: string, userAnswers: Answer[], candidatesAnswers: CandidatesAnswers, questions: Question[] = []): AnswerComparison[] {
  const candidateAnswers = candidatesAnswers[candidateId] || [];
  const expertAnswers = candidatesAnswers.expert || [];

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

    return {
      questionId,
      questionText: question?.statement || question?.title || questionId,
      userAnswer: userAnswer?.answer,
      candidateAnswer: candidateAnswer?.answer,
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
