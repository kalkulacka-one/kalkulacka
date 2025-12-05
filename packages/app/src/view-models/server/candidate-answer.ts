import type { Answer } from "../../../../schema/schemas/answer.schema";

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
