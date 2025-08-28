import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

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
      {results.map((result) => (
        <Card key={result.id}>
          <div>{result.name}</div>
          <div>{Math.round(result.percentage)} %</div>
          <details>
            <summary>Výsledky členů</summary>
            <ul>
              {result.memberResults.map((memberResult: any) => (
                <li className="flex justify-between" key={memberResult.id}>
                  <span>{memberResult.id}</span>
                  <span>{memberResult.percentage} %</span>
                </li>
              ))}
            </ul>
          </details>
        </Card>
      ))}
      <Button color="neutral" variant="link" onClick={onGoToRecap}>
        Rekapitulace
      </Button>
    </div>
  );
};
