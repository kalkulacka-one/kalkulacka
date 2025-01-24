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
          <Button
            fitContent
            kind="inverse"
            color="primary"
            className="xs:k1-px-6"
          >
            <YesIcon className="k1-size-6" />
          </Button>
        );
      }
      case false: {
        return (
          <Button
            fitContent
            kind="inverse"
            color="secondary"
            className="xs:k1-px-6"
          >
            <NoIcon className="k1-size-6" />
          </Button>
        );
      }
      case null: {
        return (
          <Button
            fitContent
            kind="inverse"
            color="neutral"
            className="xs:k1-px-6"
          >
            <NeutralIcon className="k1-size-6" />
          </Button>
        );
      }
      case undefined: {
        return (
          <Button
            fitContent
            kind="inverse"
            color="neutral"
            className="xs:k1-px-6"
          >
            <NeutralIcon className="k1-size-6" />
          </Button>
        );
      }
    }
  }

  return (
    <Card
      // data-card-id={id}
      corner="topLeft"
      color="white"
      // add custom calculated padding
      className="k1-p-custom k1-flex k1-min-w-full k1-flex-col"
    >
      <div className="k1-grid k1-grid-cols-[min-content_1fr_min-content_min-content] k1-items-center">
        {/* toggle star */}
        {/* icon edit large icon size and wrapper */}
        <StarIconButton
          iconSize="large"
          iconWrapper="default"
          starPressed={isImportant ? true : false}
          onClick={() => onClick("toggleImportant")}
        />

        <div className="k1-mr-auto k1-flex k1-flex-col">
          <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-2">
            <span className=" k1-text-sm k1-font-light  k1-text-neutral">
              {currentQuestion}/{questionCount}
            </span>
            <span className="hidden k1-font-primary k1-text-sm k1-font-light k1-text-neutral  sm:k1-inline">
              {title}
            </span>
            <Badge color="neutral">{tags}</Badge>
          </div>
          <div>
            {/* TODO: line height fix value */}
            {/* replace with typo compoment */}
            {/* <span className="hidden font-primary k1-font-semibold k1-leading-6 k1-tracking-wide k1-text-neutral sm:k1-inline sm:k1-text-base">
              {statement}
            </span> */}
            {/* mobile title */}
            <span className="k1-font-primary k1-text-sm k1-font-light !k1-leading-[10px] k1-text-neutral sm:k1-hidden">
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
