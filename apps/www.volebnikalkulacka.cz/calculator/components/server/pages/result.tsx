import type { ResultViewModel } from "../../../view-models";
import { ResultCard } from "../components";

export type ResultPage = {
  resultViewModel: ResultViewModel;
};

export function ResultPage({ resultViewModel }: ResultPage) {
  return (
    <>
      {resultViewModel.results.map((result) => (
        <ResultCard key={result.candidate.id} candidate={result.candidate} order={result.order} matchPercentage={result.percentage} />
      ))}
    </>
  );
}
