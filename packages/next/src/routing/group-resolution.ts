import type { CalculatorGroup, District, Election, ElectionCalculatorItem } from "@kalkulacka-one/schema";

export type GroupSegmentResolution = { kind: "calculator"; key: string } | { kind: "calculator-picker"; district: District; calculators: ElectionCalculatorItem[] };

export function resolveGroupSegment({ group, election, segment }: { group: CalculatorGroup; election?: Election; segment: string }): GroupSegmentResolution | undefined {
  const district = election?.districts?.find((candidate) => candidate.key === segment);
  if (district) {
    const calculators = group.calculators.filter((item): item is ElectionCalculatorItem => "district" in item && item.district?.key === district.key);
    if (calculators.length > 1) return { kind: "calculator-picker", district, calculators };
    const only = calculators[0];
    return only ? { kind: "calculator", key: only.key } : undefined;
  }

  if (group.calculators.some((item) => item.key === segment)) {
    return { kind: "calculator", key: segment };
  }

  return undefined;
}
