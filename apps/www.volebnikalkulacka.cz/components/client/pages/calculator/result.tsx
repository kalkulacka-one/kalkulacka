import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import type { CandidateViewModel, ResultViewModel } from "../../../../calculator/view-models";
import { useCandidatesViewModel } from "../../../../calculator/view-models";

function mockCalculateResultViewModel(candidates: CandidateViewModel[]): ResultViewModel {
  const mockPercentages = [78, 65, 52, 45, 38, 29, 22, 18];

  const results = candidates.map((candidate, index) => {
    const percentage = mockPercentages[index] || Math.floor(Math.random() * 20) + 10;

    const nestedResults = candidate.nestedCandidates?.map((nested, nestedIndex) => ({
      candidate: nested,
      percentage: percentage + (nestedIndex % 2 === 0 ? 4 : -4),
      order: nestedIndex + 1,
    }));

    return {
      candidate,
      percentage,
      order: index + 1,
      nestedResults,
    };
  });

  return { results };
}

export function ResultPageWithRouting() {
  const candidates = useCandidatesViewModel();
  const result = mockCalculateResultViewModel(candidates);

  return <AppResultPage result={result} />;
}
