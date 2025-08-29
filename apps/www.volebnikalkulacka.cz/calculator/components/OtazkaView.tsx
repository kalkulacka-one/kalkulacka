import { mdiArrowLeft, mdiArrowRight, mdiStar, mdiStarOutline } from "@mdi/js";
import { Button, Icon, ToggleButton } from "@repo/design-system/client";
import React from "react";
import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { Answers } from "../../../../packages/schema/schemas/answers.schema";
import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { QuestionCard } from "./questionCard";
import { SteppedProgressBar } from "./steppedProgressBar";

export type OtazkaView = {
  isLoading: boolean;
  question?: Question;
  questionStep: number;
  maxQuestionStep: number;
  answers?: Answers | undefined;
  answer?: Answer;
  onImportantToggle: () => void;
  onYes: () => void;
  onNo: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onRecap: () => void;
  onNavod: () => void;
};

export const OtazkaView = ({ isLoading, question, questionStep, maxQuestionStep, answer, answers, onImportantToggle, onYes, onNo, onPrevious, onSkip, onRecap, onNavod }: OtazkaView) => {
  if (isLoading || !question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <QuestionCard question={question} questionCurrent={questionStep} questionTotal={maxQuestionStep} />
      <SteppedProgressBar stepTotal={maxQuestionStep} stepItems={answers} stepCurrent={questionStep} statusKey="answer" idKey="questionId" />
      <div className="flex gap-8">
        <ToggleButton variant="link" color="neutral" checked={answer?.isImportant} onChange={onImportantToggle}>
          <div className="flex items-center gap-2">
            <Icon size="large" icon={answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} className={answer?.isImportant ? "text-[var(--ko-color-yellow)]" : "text-black"} />
            <span className="font-sans text-base font-normal normal-case">Pro mě důležité</span>
          </div>
        </ToggleButton>

        <ToggleButton variant="answer" checked={answer?.answer === true} color="primary" onChange={onYes}>
          Jsem pro
        </ToggleButton>
        <ToggleButton variant="answer" checked={answer?.answer === false} color="secondary" onChange={onNo}>
          Jsem proti
        </ToggleButton>
      </div>
      <div className="flex gap-8">
        <div>
          <Button variant="link" color="neutral" onClick={questionStep > 1 ? onPrevious : onNavod}>
            <div className="flex gap-4 items-center">
              <Icon size="large" icon={mdiArrowLeft} title="arrowLeft" decorative={false} />
              <span>{questionStep > 1 ? "Předchozí otázka" : "Návod"}</span>
            </div>
          </Button>
        </div>
        <div>
          <Button variant="link" color="neutral" onClick={questionStep < maxQuestionStep ? onSkip : onRecap}>
            <div className="flex gap-4 items-center">
              <span>{questionStep < maxQuestionStep ? "Přeskočit otázku" : "Rekapitulace"}</span>
              <Icon size="large" icon={mdiArrowRight} title="arrowRight" decorative={false} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
