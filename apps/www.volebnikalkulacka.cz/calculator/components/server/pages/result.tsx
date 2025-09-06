import type { ResultViewModel } from "../../../view-models";
import { MatchCard } from "../components";

export type ResultPage = {
  resultViewModel: ResultViewModel;
};

export function ResultPage({ resultViewModel }: ResultPage) {
  return (
    <>
      {resultViewModel.results.map((result) => (
        <MatchCard key={result.candidate.id} candidate={result.candidate} order={result.order} matchPercentage={result.percentage} />
      ))}
    </>
  );
}
