"use client";
import { Badge } from "@repo/design-system/badge";
import { YesIcon, NoIcon, NeutralIcon } from "@repo/design-system/icons";
import { Button, Card } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import { DetailIconButton } from "@repo/design-system/ui";
import { useState } from "react";
import type { Question } from "@repo/schema/dist/question.schema";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

// type answerType: true || false || null || undefined;

export interface Props {
  question: ExtendedQuestions;
  currentQuestion: number;
  questionCount: number;
  onClick: (event, buttonType) => void;
  starPressed?: boolean;
}

export function RecapitulationCard({
  question,
  currentQuestion,
  questionCount,
  onClick,
  starPressed,
}: Props) {
  const { id, statement, detail, tags, title, answerType, isImportant } =
    question;
  const [detailToggled, setDetailToggled] = useState(false);

  function toggleDetail() {
    setDetailToggled((prevState) => !prevState);
  }

  function switchButton(answerType) {
    switch (answerType) {
      case true: {
        return (
          <Button
            compactable
            fitContent
            wider
            kind="inverse"
            color="primary"
            icon={YesIcon}
          >
            Ano
          </Button>
        );
      }
      case false: {
        return (
          <Button
            compactable
            fitContent
            wider
            kind="inverse"
            color="secondary"
            icon={NoIcon}
          >
            Ne
          </Button>
        );
      }
      case null: {
        return (
          <Button
            compactable
            fitContent
            wider
            kind="inverse"
            color="neutral"
            icon={NeutralIcon}
          >
            Nevím
          </Button>
        );
      }
      case undefined: {
        return (
          <Button
            compactable
            fitContent
            wider
            kind="inverse"
            color="neutral"
            icon={NeutralIcon}
          >
            Nevím
          </Button>
        );
      }
    }
  }

  return (
    <Card
      data-card-id={id}
      corner="topLeft"
      className="k1-flex k1-w-full k1-flex-col  k1-justify-between k1-gap-4 k1-p-customMobile md:k1-p-customDesktop"
    >
      <div className="k1-flex k1-items-center k1-justify-between">
        {/* toggle star */}
        <StarIconButton
          data-buttonCardId={id}
          starPressed={isImportant ? true : false}
          onClick={(event) => onClick(event, "Togglerecimportant")}
        />

        <div className="k1-mr-auto k1-flex k1-flex-col">
          <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-4">
            <span className="k1-text-sm k1-font-normal">
              {currentQuestion}/{questionCount}
            </span>
            <span className="k1-text-sm k1-font-normal">{title}</span>
            <Badge>{tags}</Badge>
          </div>
          <div>
            {/* TODO: line height fix value */}
            <span className="k1-text-lg k1-font-bold k1-leading-6 k1-tracking-tighter">
              {statement}
            </span>
          </div>
        </div>
        <DetailIconButton onClick={toggleDetail} />
        <div>{switchButton(answerType)}</div>
      </div>
      {detailToggled && (
        <div>
          <div className="k1-flex k1-w-full">
            <Button
              kind="inverse"
              color="primary"
              size="default"
              hasIcon
              icon={YesIcon}
              compactable
              wider
              data-buttonCardId={id}
              onClick={(event) => onClick(event, "Yes")}
            >
              Ano
            </Button>
            <Button
              kind="inverse"
              color="secondary"
              size="default"
              hasIcon
              icon={NoIcon}
              compactable
              wider
              data-buttonCardId={id}
              onClick={(event) => onClick(event, "No")}
            >
              Ne
            </Button>
          </div>
          <div>
            <p className="k1-text-base k1-font-normal k1-text-neutral">
              {detail}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
