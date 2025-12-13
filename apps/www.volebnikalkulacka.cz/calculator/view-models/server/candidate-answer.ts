import type { Answer } from "@kalkulacka-one/schema";

export type CandidateAnswer = Omit<Answer, "respondent"> & {
  respondent?: "candidate" | "expert";
};

export type CandidateAnswerViewModel = Omit<Answer, "respondent"> & {
  respondent: "candidate" | "expert";
};

export function candidateAnswerViewModel(answer: CandidateAnswer): CandidateAnswerViewModel {
  return {
    ...answer,
    respondent: answer.respondent ?? "candidate",
  };
}
