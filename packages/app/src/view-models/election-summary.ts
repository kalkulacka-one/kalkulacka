import type { CalculatorGroup, Election, TimePeriod } from "@kalkulacka-one/schema";

export type ElectionSummaryViewModel = {
  key: string;
  title: string;
  shortTitle: string;
  description?: string;
  votingHours: TimePeriod[];
  calculatorCount: number;
};

export function electionSummaryViewModel(group: CalculatorGroup, election: Election): ElectionSummaryViewModel {
  return {
    key: group.key,
    title: election.title,
    shortTitle: election.shortTitle,
    description: group.description ?? election.description,
    votingHours: election.votingHours ?? election.rounds?.[0]?.votingHours ?? [],
    calculatorCount: group.calculators.length,
  };
}
