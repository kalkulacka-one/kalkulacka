"use client";
import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";

export default function Page() {
  const params = useParams();
  const questions = useElectionStore((state) => state.questions);
  const questionStep = useElectionStore((state) => state.questionStep);
  const handleQuestionStep = useElectionStore((state) => state.handleQuestionStep);
  const answers = useElectionStore((state) => state.answers);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const currentAnswer = answers.find((answer) => answer.id === questions[questionStep - 1].id);

  if (!questions) {
    return null;
  }

  console.log(answers);

  return (
    <div>
      {questions.map((question: any, index: number) => {
        if (questionStep - 1 === index)
          return (
            <Card key={question.id} color="white">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <span>
                    {questionStep}/{questions.length}
                  </span>
                  <span>{question.title}</span>
                  <span>{question.tags}</span>
                </div>
                <div className="text-2xl+">{question.statement}</div>
                <div className="text-2xl+">{question.detail}</div>
              </div>
            </Card>
          );
      })}
      <div className="flex gap-4">
        <ToggleButton variant="answer" color="neutral" checked={currentAnswer?.isImportant} onChange={() => handleAnswer(questions[questionStep - 1].id, "important")}>
          Pro mě důležité
        </ToggleButton>
        <ToggleButton variant="answer" checked={currentAnswer?.answerType === 1} color="primary" onChange={() => handleAnswer(questions[questionStep - 1].id, "yes")}>
          Jsem pro
        </ToggleButton>
        <ToggleButton variant="answer" checked={currentAnswer?.answerType === 2} color="secondary" onChange={() => handleAnswer(questions[questionStep - 1].id, "no")}>
          Jsem proti
        </ToggleButton>
      </div>
      <div className="flex gap-4">
        <Button variant="link" color="neutral" onClick={() => handleQuestionStep("previous")}>
          Předchozí
        </Button>
        <Button variant="link" color="neutral" onClick={() => handleQuestionStep("next")}>
          Přeskočit
        </Button>
      </div>
      <Link href={`/kalkulacka/${params.electionName}/rekapitulace`}>Rekapitulace</Link>
    </div>
  );
}
