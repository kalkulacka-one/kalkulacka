"use client";
import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";
export default function RekapitulacePage() {
  const answers = useElectionStore((state) => state.answers);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const params = useParams();
  const calculator = useElectionStore((state) => state.calculator);
  const questionStep = useElectionStore((state) => state.questionStep);

  if (!calculator) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="flex flex-col gap-2">
        {answers?.map((answer, index) => (
          <Card color="white" key={answer.questionId}>
            <div>{calculator.questions[index].title}</div>
            <div>{calculator.questions[index].statement}</div>
            <div>{calculator.questions[index].detail}</div>
            <div className="flex gap-4">
              <ToggleButton variant="answer" color="neutral" checked={answers?.[index]?.isImportant} onChange={() => handleAnswer(answer.questionId, "important")}>
                Pro mě důležité
              </ToggleButton>
              <ToggleButton variant="answer" checked={answers?.[index]?.answer === true} color="primary" onChange={() => handleAnswer(answer.questionId, "yes")}>
                Jsem pro
              </ToggleButton>
              <ToggleButton variant="answer" checked={answers?.[index]?.answer === false} color="secondary" onChange={() => handleAnswer(answer.questionId, "no")}>
                Jsem proti
              </ToggleButton>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Link href={`/kalkulacka/${params.group}/${params.calculator}/otazka/${answers?.length}`}>
          <Button color="neutral" variant="link">
            Otázky
          </Button>
        </Link>
        <Link href={`/kalkulacka/${params.group}/${params.calculator}/vysledek`}>
          <Button color="neutral" variant="link">
            Výsledek
          </Button>
        </Link>
      </div>
    </div>
  );
}
