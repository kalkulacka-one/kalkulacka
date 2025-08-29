import { Button } from "@repo/design-system/client";
import { ResultCandidateCard } from "./resultCandidateCard";

type Result = any;

export type VysledekView = {
  isLoading: boolean;
  results: Result[];
  noAnswerFromUser: boolean;
  onStartCalculator: () => void;
  onGoToRecap: () => void;
};

export const VysledekView = ({ isLoading, results, noAnswerFromUser, onStartCalculator, onGoToRecap }: VysledekView) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (noAnswerFromUser) {
    return (
      <div>
        <p>Pro zobrazení výsledku musíme mít zodpovězenou alespoň jednu otázku</p>
        <Button color="neutral" variant="link" onClick={onStartCalculator}>
          Spustit kalkulačku
        </Button>
      </div>
    );
  }

  return (
    <div className="h-1/3">
      {results.map((result, index) => (
        <div key={result.id}>
          <ResultCandidateCard strong={index === 0} order={index + 1} result={result} />
          <details key={result.memberResults.id}>
            <summary>Výsledky členů</summary>
            <ul>
              {result.memberResults.map((memberResult: any) => (
                <li className="flex justify-between" key={memberResult.id}>
                  <span>{memberResult.id}</span>
                  <span>{Math.round(memberResult.percentage)} %</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
      <Button color="neutral" variant="link" onClick={onGoToRecap}>
        Rekapitulace
      </Button>
    </div>
  );
};
