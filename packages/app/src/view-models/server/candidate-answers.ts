import { type CandidateAnswer, type CandidateAnswerViewModel, candidateAnswerViewModel } from "./candidate-answer";

export type CandidatesAnswersViewModel = Record<string, CandidateAnswerViewModel[]>;

export function candidatesAnswersViewModel(candidatesAnswers: Record<string, CandidateAnswer[]>): CandidatesAnswersViewModel {
  const viewModel: CandidatesAnswersViewModel = {};

  for (const [candidateId, answers] of Object.entries(candidatesAnswers)) {
    viewModel[candidateId] = answers.map(candidateAnswerViewModel);
  }

  return viewModel;
}
