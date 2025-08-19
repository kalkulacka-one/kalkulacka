"use client";
import { ToggleButton } from "@repo/design-system/client";
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
        {answers.map((answer, index) => (
          <Card color="white" key={answer.id}>
            <div>{answer.id}</div>

            <div className="flex gap-4">
              <ToggleButton variant="answer" color="neutral" checked={answer.isImportant} onChange={() => handleAnswer(questions[index].id, "important")}>
                Pro mě důležité
              </ToggleButton>
              <ToggleButton variant="answer" checked={answer.answerType === 1} color="primary" onChange={() => handleAnswer(questions[index].id, "yes")}>
                Jsem pro
              </ToggleButton>
              <ToggleButton variant="answer" checked={answer.answerType === 2} color="secondary" onChange={() => handleAnswer(questions[index].id, "no")}>
                Jsem proti
              </ToggleButton>
            </div>
          </Card>
        ))}
      </div>
      <Link href={`/kalkulacka/${params.electionName}/otazka`}>Otázky</Link>
    </div>
  );
}
