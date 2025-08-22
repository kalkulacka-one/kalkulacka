"use client";
import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Question } from "../../../../../../packages/schema/schemas/question.schema";
import { useElectionStore } from "../../../stores/electionStore";

export default function Page() {
  const params = useParams();
  const questions = useElectionStore((state) => state.questions);
  const questionStep = useElectionStore((state) => state.questionStep);
  const maxQuestionStep = useElectionStore((state) => state.maxQuestionStep);
  const handleQuestionStep = useElectionStore((state) => state.handleQuestionStep);
  const answers = useElectionStore((state) => state.answers);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);

  console.log(answers);
  console.log(questionStep);
  console.log(maxQuestionStep);

  if (!questions) {
    return null;
  }

  const currentQuestion = questions[questionStep - 1];

  if (!currentQuestion) {
    return null;
  }

  const currentQuestionId = currentQuestion?.id;

  console.log();
  return (
    <div>
      {questions.map((question: Question, index: number) => {
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
                <div className="text-2xl">{question.statement}</div>
                <div className="text-2xl">{question.detail}</div>
              </div>
            </Card>
          );
      })}
      <div className="flex gap-4">
        <ToggleButton variant="answer" color="neutral" checked={answers?.[questionStep - 1]?.isImportant} onChange={() => handleAnswer(currentQuestionId, "important")}>
          Pro mě důležité
        </ToggleButton>
        <ToggleButton variant="answer" checked={answers?.[questionStep - 1]?.answer === true} color="primary" onChange={() => handleAnswer(currentQuestionId, "yes")}>
          Jsem pro
        </ToggleButton>
        <ToggleButton variant="answer" checked={answers?.[questionStep - 1]?.answer === false} color="secondary" onChange={() => handleAnswer(currentQuestionId, "no")}>
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
      <div className="flex gap-4">
        {questionStep === maxQuestionStep ? (
          <Link href={`/kalkulacka/${params.electionName}/rekapitulace`}>
            <Button color="neutral" variant="link">
              Rekapitulace
            </Button>
          </Link>
        ) : (
          <Link href={`/kalkulacka/${params.electionName}/navod`}>
            <Button color="neutral" variant="link">
              Návod
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
