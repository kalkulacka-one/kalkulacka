import { Button, ToggleButton } from "@repo/design-system/client";

import type { AnswerViewModel } from "../../../view-models";
import { NavigationCard } from "../../server/components/navigation-card";

export type QuestionNavigationCard = {
  current: number;
  total: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

export function QuestionNavigationCard({ current, total, onPreviousClick, onNextClick, answer, onAgreeChange, onDisagreeChange, onImportantChange }: QuestionNavigationCard) {
  return (
    <NavigationCard>
      <div>
        <div>
          <Button variant="link" onClick={onPreviousClick}>
            Předchozí
          </Button>
          <span>
            {current}/{total}
          </span>
          <Button variant="link" onClick={onNextClick}>
            Další
          </Button>
        </div>
        <div>
          <ToggleButton variant="answer" color="primary" checked={answer.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            Ano
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            Ne
          </ToggleButton>
        </div>
        <div>
          <ToggleButton variant="link" checked={answer.isImportant} onChange={(checked: boolean) => onImportantChange(checked)}>
            Pro mě důležité
          </ToggleButton>
        </div>
      </div>
    </NavigationCard>
  );
}
