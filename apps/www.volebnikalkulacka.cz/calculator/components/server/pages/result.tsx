import type { ResultViewModel } from "../../../view-models";
import { MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
};

export function ResultPage({ result }: ResultPage) {
  return (
    <>
      {result.matches.map((match) => (
        <MatchCard key={match.candidate.id} candidate={match.candidate} order={match.order} match={match.match} />
      ))}
    </>
  );
}
