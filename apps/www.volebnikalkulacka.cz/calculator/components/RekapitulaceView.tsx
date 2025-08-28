import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../packages/schema/schemas/question.schema";

export type RekapitulaceView = {
  isLoading: boolean;
  questions: Question[];
  answers: Answer[];
  onAnswerChange: (questionId: string, answerType: "important" | "yes" | "no") => void;
  onGoToQuestions: () => void;
  onGoToResults: () => void;
};

export const RekapitulaceView = ({ isLoading, questions, answers, onAnswerChange, onGoToQuestions, onGoToResults }: RekapitulaceView) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        {answers?.map((answer, index) => (
          <Card color="white" key={answer.questionId}>
            <div>{questions[index]?.title}</div>
            <div>{questions[index]?.statement}</div>
            <div>{questions[index]?.detail}</div>
            <div className="flex gap-4">
              <ToggleButton variant="answer" color="neutral" checked={answers?.[index]?.isImportant} onChange={() => onAnswerChange(answer.questionId, "important")}>
                Pro mě důležité
              </ToggleButton>
              <ToggleButton variant="answer" checked={answers?.[index]?.answer === true} color="primary" onChange={() => onAnswerChange(answer.questionId, "yes")}>
                Jsem pro
              </ToggleButton>
              <ToggleButton variant="answer" checked={answers?.[index]?.answer === false} color="secondary" onChange={() => onAnswerChange(answer.questionId, "no")}>
                Jsem proti
              </ToggleButton>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Button color="neutral" variant="link" onClick={onGoToQuestions}>
          Otázky
        </Button>
        <Button color="neutral" variant="link" onClick={onGoToResults}>
          Výsledek
        </Button>
      </div>
    </div>
  );
};
