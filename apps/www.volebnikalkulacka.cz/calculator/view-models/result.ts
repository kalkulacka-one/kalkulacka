import type { CandidateViewModel } from "./candidate";

export type CandidateMatchViewModel = {
  candidate: CandidateViewModel;
  match: number;
  order: number;
  nestedMatches?: CandidateMatchViewModel[];
};

export type ResultViewModel = {
  matches: CandidateMatchViewModel[];
};
