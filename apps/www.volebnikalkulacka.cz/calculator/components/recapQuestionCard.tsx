"use client";
import { mdiCheckBold, mdiChevronDown, mdiCloseThick, mdiSlashForward, mdiStar, mdiStarOutline } from "@mdi/js";
import { Button } from "@repo/design-system/client";
import { ToggleButton } from "@repo/design-system/client";
import { Icon } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../packages/schema/schemas/question.schema";
import type { Tag } from "../../../../packages/schema/schemas/tags.schema";

export type RecapQuestionCard = {
  question: Question;
  answer: Answer;
  questionCurrent: number;
  questionTotal: number;
  starClick: () => void;
  yesClick: () => void;
  noClick: () => void;
};

export function RecapQuestionCard({ question, answer, questionCurrent, questionTotal, starClick, yesClick, noClick }: RecapQuestionCard) {
  const { title, statement, detail, tags } = question;
  return (
    <Card corner="topLeft">
      <details className="group">
        <summary className="flex list-none [&::-webkit-details-marker]:hidden items-center gap-4">
          <ToggleButton checked={answer.isImportant} variant="link" color="neutral" onChange={() => starClick()}>
            <Icon size="large" icon={answer.isImportant ? mdiStar : mdiStarOutline} decorative={true} className={answer.isImportant ? "text-[var(--ko-color-yellow)]" : "text-black"} />
          </ToggleButton>
          <div className="flex flex-col gap-2 flex-grow-1">
            <div className="flex gap-2">
              <span>
                {questionCurrent}/{questionTotal}
              </span>
              <span>{title}</span>
              {tags?.map((tag: Tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h2>{statement}</h2>
          </div>
          <div>
            <Button variant="answer" color="neutral">
              <Icon size="large" icon={answer.answer === true ? mdiCheckBold : answer.answer === false ? mdiCloseThick : answer.answer === null ? mdiSlashForward : mdiChevronDown} decorative={true} />
            </Button>
          </div>
          <div className="group-open:-rotate-180 cursor-pointer">
            <Icon icon={mdiChevronDown} decorative={true} />
          </div>
        </summary>
        <div className="flex flex-col">
          {detail && <div>{detail}</div>}
          <div className="flex">
            <ToggleButton checked={answer.answer === true} variant="answer" color="primary" onChange={() => yesClick()}>
              Jsem pro
            </ToggleButton>
            <ToggleButton checked={answer.answer === false} variant="answer" color="secondary" onChange={() => noClick()}>
              Jsem proti
            </ToggleButton>
          </div>
        </div>
      </details>
    </Card>
  );
}
