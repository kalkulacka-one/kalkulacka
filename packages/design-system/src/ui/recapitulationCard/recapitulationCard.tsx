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
  onClick: (buttonType: string) => void;
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

  function switchButton(answerType: true | false | null | undefined) {
    switch (answerType) {
      case true: {
        return (
          <Button wider fitContent kind="inverse" color="primary">
            <YesIcon className="size-6" />
          </Button>
        );
      }
      case false: {
        return (
          <Button wider fitContent kind="inverse" color="secondary">
            <NoIcon className="size-6" />
          </Button>
        );
      }
      case null: {
        return (
          <Button wider fitContent kind="inverse" color="neutral">
            <NeutralIcon className="size-6" />
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
      color="white"
      // add custom calculated padding
      className="k1-flex k1-flex-col k1-px-2 k1-py-4 k1-gap-6"
    >
      <div className="k1-items-center k1-grid k1-grid-cols-[min-content_1fr_min-content_min-content] k1-gap-6">
        {/* toggle star */}
        {/* icon edit large icon size and wrapper */}
        <StarIconButton
          iconSize="default"
          iconWrapper="default"
          starPressed={isImportant ? true : false}
          onClick={() => onClick("toggleImportant")}
        />

        <div className="k1-mr-auto k1-flex k1-flex-col">
          <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-2">
            <span className=" k1-font-light k1-text-sm  k1-text-neutral">
              {currentQuestion}/{questionCount}
            </span>
            <span className="sm:k1-inline k1-font-light k1-text-neutral k1-text-sm k1-font-primary  hidden">
              {title}
            </span>
            <Badge color="neutral">{tags}</Badge>
          </div>
          <div>
            {/* TODO: line height fix value */}
            {/* replace with typo compoment */}
            <span className="k1-text-neutral k1-font-semibold k1-tracking-wide k1-leading-6 sm:k1-inline hidden font-primary text-base">
              {statement}
            </span>
            {/* mobile title */}
            <span className="k1-font-light k1-text-neutral k1-font-primary k1-inline sm:k1-hidden">
              {title}
            </span>
          </div>
        </div>
        <div className={`${detailToggled ? "k1-invisible" : "k1-block"}`}>
          {switchButton(answerType)}
        </div>
        <DetailIconButton onClick={toggleDetail} />
      </div>
      {detailToggled && (
        <>
          <div className="k1-flex k1-w-full k1-gap-4">
            <Button
              kind="inverse"
              color="primary"
              size="default"
              hasIcon
              icon={YesIcon}
              compactable
              wider
              onClick={() => onClick("Yes")}
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
              onClick={() => onClick("No")}
            >
              Ne
            </Button>
          </div>
          <p className="k1-text-base k1-font-normal k1-text-neutral">
            {detail}
          </p>
        </>
      )}
    </Card>
  );
}
