import type { CandidateViewModel } from "./candidate";

export type CandidateResultViewModel = {
  candidate: CandidateViewModel;
  percentage: number;
  order: number;
  nestedResults?: CandidateResultViewModel[];
};

export type ResultViewModel = {
  results: CandidateResultViewModel[];
};
