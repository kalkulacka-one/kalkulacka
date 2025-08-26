import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

interface Question {
  id: string;
  title: string;
  statement: string;
  detail: string;
  tags: string;
}

interface Answer {
  answer: boolean | null;
  isImportant: boolean;
}

interface QuestionViewProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  answer?: Answer;
  onImportantToggle: () => void;
  onAnswerYes: () => void;
  onAnswerNo: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  LinkComponent?: React.ElementType;
  footerLinkHref?: string;
  footerLinkText?: string;
}

export function QuestionView({
  question,
  currentStep,
  totalSteps,
  answer,
  onImportantToggle,
  onAnswerYes,
  onAnswerNo,
  onPrevious,
  onSkip,
  LinkComponent,
  footerLinkHref,
  footerLinkText,
}: QuestionViewProps) {
  return (
    <div>
      <div>
        <Card color="white">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span>
                {currentStep}/{totalSteps}
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
        <ToggleButton variant="answer" checked={answer?.answer === true} color="primary" onChange={onAnswerYes}>
          Jsem pro
        </ToggleButton>
        <ToggleButton variant="answer" checked={answer?.answer === false} color="secondary" onChange={onAnswerNo}>
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
      {LinkComponent && footerLinkHref && footerLinkText && (
        <div className="flex gap-4">
          <LinkComponent href={footerLinkHref}>
            <Button color="neutral" variant="link">
              {footerLinkText}
            </Button>
          </LinkComponent>
        </div>
      )}
    </div>
  );
}
