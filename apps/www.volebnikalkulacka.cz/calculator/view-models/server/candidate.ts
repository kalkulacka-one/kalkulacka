import { findImageByType, resolveImageUrls } from "@/calculator/data-fetching/image-url-builder";

import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { Candidate } from "../../../../../packages/schema/schemas/candidate.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";
import type { Question } from "../../../../../packages/schema/schemas/question.schema";
import type { OrganizationViewModel } from "./organization";
import type { PersonViewModel } from "./person";

export type CandidateViewModel = Omit<Candidate, "nestedCandidates"> & {
  displayName: string | undefined;
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
  const organization = getCandidateOrganization(candidate, personsMap, organizationsMap);
  const avatar = getCandidateAvatar(candidate, personsMap, organizationsMap, baseUrl);
  const type = getCandidateType(candidate);
  const nestedCandidates = candidate.nestedCandidates?.map((nested) => candidateViewModel(nested, personsMap, organizationsMap, baseUrl));

  return {
    ...candidate,
    displayName,
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
