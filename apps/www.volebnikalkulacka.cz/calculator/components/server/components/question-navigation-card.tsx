import { mdiStar, mdiStarOutline } from "@mdi/js";
import { Button, Icon, ToggleButton } from "@repo/design-system/client";

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
  const previousButtonLabel = current === 1 ? "Návod" : "Předchozí";
  const nextButtonLabel = answer.answer ? "Další" : "Přeskočit";

  return (
    <NavigationCard>
      <div className="grid grid-flow-row gap-4">
        <div className="grid grid-flow-col grid-cols-[1fr_auto_1fr] items-center gap-8">
          <Button variant="link" color="neutral" onClick={onPreviousClick}>
            {previousButtonLabel}
          </Button>
          <span className="tabular-nums">
            <span>
              <span style={{ visibility: "hidden" }}>{current.toString().padStart(2, "0").startsWith("0") ? "0" : ""}</span>
              <span>
                <strong>{current}</strong> / {total}
              </span>
            </span>
          </span>
          <Button variant="link" color="neutral" onClick={onNextClick}>
            {nextButtonLabel}
          </Button>
        </div>
        <div className="grid grid-flow-col grid-cols-[auto_1fr_1fr] gap-4 items-center">
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label="Pro mě důležité">
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            Ano
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            Ne
          </ToggleButton>
        </div>
      </div>
    </NavigationCard>
  );
}
