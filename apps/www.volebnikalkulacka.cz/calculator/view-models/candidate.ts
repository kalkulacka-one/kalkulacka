import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { CandidatesAnswers } from "../../../../packages/schema/schemas/candidates-answers.schema";
import type { Candidate } from "../../../../packages/schema/schemas/candidate.schema";
import { useCalculatorStore } from "../stores";
import { useAnswersStore } from "../stores/answers";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export type CandidateViewModel = Omit<Candidate, "nestedCandidates"> & {
  displayName: string | undefined;
  organization?: string | undefined;
  nestedCandidates?: CandidateViewModel[];
};

function getCandidateDisplayName(
  candidate: Candidate,
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): string | undefined {
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

function getCandidateOrganization(
  candidate: Candidate,
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): string | undefined {
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

export function candidateViewModel(
  candidate: Candidate,
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): CandidateViewModel {
  const displayName = getCandidateDisplayName(candidate, personsMap, organizationsMap);
  const organization = getCandidateOrganization(candidate, personsMap, organizationsMap);
  const nestedCandidates = candidate.nestedCandidates?.map((nested) => candidateViewModel(nested, personsMap, organizationsMap));

  return {
    ...candidate,
    displayName,
    organization,
    nestedCandidates,
  };
}

export function useCandidate(id: string): CandidateViewModel | undefined {
  const candidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o)]) ?? []), [organizations]);

  return useMemo(() => {
    const candidate = candidates.find((candidate) => candidate.id === id);
    return candidate ? candidateViewModel(candidate, personsMap, organizationsMap) : undefined;
  }, [candidates, personsMap, organizationsMap, id]);
}

export type AnswerComparison = {
  questionId: string;
  questionText?: string;
  userAnswer: boolean | null | undefined;
  candidateAnswer: boolean | null | undefined;
  isImportant?: boolean;
};

export function getCandidateAnswerComparison(
  candidateId: string,
  userAnswers: Answer[],
  candidatesAnswers: CandidatesAnswers,
  questions: any[] = [],
): AnswerComparison[] {
  const candidateAnswers = candidatesAnswers[candidateId] || [];

  // Create maps for quick lookup
  const userAnswersMap = new Map(userAnswers.map((answer) => [answer.questionId, answer]));
  const candidateAnswersMap = new Map(candidateAnswers.map((answer) => [answer.questionId, answer]));

  // Iterate over the original questions array to preserve order
  return questions.map((question) => {
    const questionId = question.id;
    const userAnswer = userAnswersMap.get(questionId);
    const candidateAnswer = candidateAnswersMap.get(questionId);

    return {
      questionId,
      questionText: question?.statement || question?.title || questionId,
      userAnswer: userAnswer?.answer,
      candidateAnswer: candidateAnswer?.answer,
      isImportant: userAnswer?.isImportant,
    };
  });
}

export function useCandidateAnswerComparison(candidateId: string): AnswerComparison[] {
  const userAnswers = useAnswersStore((state) => state.answers);
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);
  const questions = useCalculatorStore((state) => state.questions);
  
  return useMemo(() => {
    return getCandidateAnswerComparison(candidateId, userAnswers, candidatesAnswers, questions);
  }, [candidateId, userAnswers, candidatesAnswers, questions]);
}

export function hasDirectAnswers(candidateId: string, candidatesAnswers: CandidatesAnswers): boolean {
  return candidateId in candidatesAnswers && (candidatesAnswers[candidateId]?.length ?? 0) > 0;
}

export function useHasDirectAnswers(candidateId: string): boolean {
  const candidatesAnswers = useCalculatorStore((state) => state.candidatesAnswers);
  
  return useMemo(() => {
    return hasDirectAnswers(candidateId, candidatesAnswers);
  }, [candidateId, candidatesAnswers]);
}
