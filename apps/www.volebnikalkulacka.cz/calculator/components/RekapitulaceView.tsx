"use client";

import { Button } from "@repo/design-system/client";
import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { RecapQuestionCard } from "./recapQuestionCard";

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
        {answers?.map((answer, index) => {
          const question = questions[index];
          if (!question) {
            return null;
          }
          return (
            <RecapQuestionCard
              key={answer.questionId}
              question={question}
              answer={answer}
              questionCurrent={index + 1}
              questionTotal={questions.length}
              starClick={() => onAnswerChange(answer.questionId, "important")}
              yesClick={() => onAnswerChange(answer.questionId, "yes")}
              noClick={() => onAnswerChange(answer.questionId, "no")}
            />
          );
        })}
      </div>
      <div className="flex gap-4">
        <Button color="neutral" variant="link" onClick={onGoToQuestions}>
          Otázky
        </Button>
        <Button color="primary" variant="filled" onClick={onGoToResults}>
          Zobrazit výsledky
        </Button>
      </div>
    </div>
  );
};
