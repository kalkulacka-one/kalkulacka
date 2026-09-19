import type { Election, ElectionCalculatorGroup, TimePeriod } from "@kalkulacka-one/schema";

export type ElectionSummaryViewModel = {
  groupKey: string;
  title: string;
  shortTitle: string;
  description?: string;
  votingHours: TimePeriod[];
  calculatorCount: number;
};

export function electionSummaryViewModel(group: ElectionCalculatorGroup, election: Election): ElectionSummaryViewModel {
  return {
    groupKey: group.key,
    title: election.title,
    shortTitle: election.shortTitle,
    description: group.description ?? election.description,
    votingHours: election.votingHours ?? election.rounds?.find((round) => round.number === 1)?.votingHours ?? [],
    calculatorCount: group.calculators.length,
  };
}
