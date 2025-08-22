"use client";
import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";

export default function Page() {
  const params = useParams();
  const answers = useElectionStore((state) => state.answers);
  const questions = useElectionStore((state) => state.questions);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);

  console.log(answers);

  return (
    <div>
      <div className="flex flex-col gap-2">
        {answers?.map((answer, index) => (
          <Card color="white" key={answer.questionId}>
            <div>{answer.questionId}</div>

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
        <Link href={`/kalkulacka/${params.electionName}/otazka`}>
          <Button color="neutral" variant="link">
            Otázky
          </Button>
        </Link>
        <Link href={`/kalkulacka/${params.electionName}/vysledek`}>
          <Button color="neutral" variant="link">
            Výsledek
          </Button>
        </Link>
      </div>
    </div>
  );
}
