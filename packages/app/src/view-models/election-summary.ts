import type { Election, ElectionCalculatorGroup, TimePeriod } from "@kalkulacka-one/schema";

import { currentRound, type RoundState } from "./rounds";

export type ElectionSummaryViewModel = {
  groupKey: string;
  title: string;
  shortTitle: string;
  description?: string;
  votingHours: TimePeriod[];
  round?: RoundState;
  calculatorCount: number;
};

export function electionSummaryViewModel(group: ElectionCalculatorGroup, election: Election, now: Date = new Date()): ElectionSummaryViewModel {
  const round = election.rounds ? currentRound(election.rounds, now) : undefined;
  const roundVotingHours = election.rounds?.find((entry) => entry.number === round?.current)?.votingHours;
  return {
    groupKey: group.key,
    title: election.title,
    shortTitle: election.shortTitle,
    description: group.description ?? election.description,
    votingHours: roundVotingHours ?? election.votingHours ?? [],
    round,
    calculatorCount: group.calculators.length,
  };
}
