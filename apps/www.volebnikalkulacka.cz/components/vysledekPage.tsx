"use client";
import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateFinalResult } from "../common/calculateFinalResult";
import { useElectionStore } from "../stores/electionStore";

export default function VysledekPage() {
  const params = useParams();
  const calculator = useElectionStore((state) => state.calculator);
  const answers = useElectionStore((state) => state.answers);

  if (!calculator) {
    return <div>Loading...</div>;
  }

  const candidatesAnswers = calculator.candidatesAnswers;

  const candidates = calculator.candidates;

  console.log("Console.log", candidates);

  const results = calculateFinalResult(answers, candidates, candidatesAnswers);
  const noAnswerFromUser = answers.every((answer) => answer.answer === null);
  console.log(results);

  if (noAnswerFromUser) {
    return (
      <div>
        <p>Pro zobrazení výsledku musíme mít zodpovězenou alespoň jednu otázku</p>
        <Link href={`/${params.first}/${params.second}/otazka/1`}>
          <Button color="neutral" variant="link">
            Spustit kalkulačku
          </Button>
        </Link>
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
      <Link href={`/${params.first}/${params.second}/rekapitulace`}>
        <Button color="neutral" variant="link">
          Rekapitulace
        </Button>
      </Link>
    </div>
  );
}
