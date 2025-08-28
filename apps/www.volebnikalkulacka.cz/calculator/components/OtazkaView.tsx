import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import React from "react";
import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../packages/schema/schemas/question.schema";

export type OtazkaView = {
  isLoading: boolean;
  question?: Question;
  questionStep: number;
  maxQuestionStep: number;
  answer?: Answer;
  onImportantToggle: () => void;
  onYes: () => void;
  onNo: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onRecap: () => void;
  onNavod: () => void;
};

export const OtazkaView = ({ isLoading, question, questionStep, maxQuestionStep, answer, onImportantToggle, onYes, onNo, onPrevious, onSkip, onRecap, onNavod }: OtazkaView) => {
  if (isLoading || !question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Card color="white" key={question.id}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span>
                {questionStep}/{maxQuestionStep}
              </span>
              <span>{question.title}</span>
              <span>{question.tags}</span>
            </div>
            <div className="text-2xl">{question.statement}</div>
            <div className="text-2xl">{question.detail}</div>
          </div>
        </Card>
      </div>
      <div className="flex gap-4">
        <ToggleButton variant="answer" color="neutral" checked={answer?.isImportant} onChange={onImportantToggle}>
          Pro mě důležité
        </ToggleButton>
        <ToggleButton variant="answer" checked={answer?.answer === true} color="primary" onChange={onYes}>
          Jsem pro
        </ToggleButton>
        <ToggleButton variant="answer" checked={answer?.answer === false} color="secondary" onChange={onNo}>
          Jsem proti
        </ToggleButton>
      </div>
      <div className="flex gap-4">
        <Button variant="link" color="neutral" onClick={onPrevious}>
          Předchozí
        </Button>
        <Button variant="link" color="neutral" onClick={onSkip}>
          Přeskočit
        </Button>
      </div>
      <div className="flex gap-4">
        {questionStep === maxQuestionStep ? (
          <Button color="neutral" variant="link" onClick={onRecap}>
            Rekapitulace
          </Button>
        ) : (
          <Button color="neutral" variant="link" onClick={onNavod}>
            Návod
          </Button>
        )}
      </div>
    </div>
  );
};
