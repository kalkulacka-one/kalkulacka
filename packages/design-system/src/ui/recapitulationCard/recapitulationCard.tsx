"use client";
import { Badge } from "@repo/design-system/badge";
import { YesIcon, NoIcon, NeutralIcon } from "@repo/design-system/icons";
import {
  Button,
  Card,
  YesToggleButton,
  NoToggleButton,
} from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import { DetailIconButton } from "@repo/design-system/ui";
import { useState } from "react";
import type { Question } from "@repo/schema/dist/question.schema";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

export interface Props {
  question: ExtendedQuestions;
  currentQuestion: number;
  questionCount: number;
  onClick: (buttonType: string) => void;
}

export function RecapitulationCard({
  question,
  currentQuestion,
  questionCount,
  onClick,
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
            kind="filled"
            color="primary"
            className="k1-pointer-events-none xs:k1-px-6"
          >
            <YesIcon className="k1-size-6" />
          </Button>
        );
      }
      case false: {
        return (
          <Button
            fitContent
            kind="filled"
            color="secondary"
            className="k1-pointer-events-none xs:k1-px-6"
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
            className="k1-pointer-events-none  xs:k1-px-6"
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
            className="k1-pointer-events-none xs:k1-px-6"
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
      className="k1-p-recapitulationCardMobile lg:k1-py-recapitulationCardDesktop k1-flex k1-min-w-full k1-flex-col k1-gap-4"
    >
      <div className="k1-grid k1-grid-cols-[min-content_1fr_min-content_min-content] k1-items-center k1-gap-x-2 min-[700px]:k1-gap-x-6">
        {/* toggle star */}
        {/* icon edit large icon size and wrapper */}
        <StarIconButton
          iconSize="large"
          iconWrapper="default"
          starPressed={isImportant ? true : undefined}
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
            <p className="hidden font-primary k1-font-semibold k1-leading-6 k1-tracking-wide k1-text-neutral sm:k1-inline sm:k1-text-base">
              {statement}
            </p>
            {/* mobile title */}
            <p className="k1-font-primary k1-text-sm k1-font-light k1-leading-tight k1-text-neutral sm:k1-hidden">
              {title}
            </p>
          </div>
        </div>
        <div className={`${detailToggled ? "k1-invisible" : "k1-block"}`}>
          {/* rendering buttons here */}
          {switchButton(answerType)}
        </div>
        <DetailIconButton onClick={toggleDetail} />
      </div>
      {detailToggled && (
        // detail wrapper
        <div>
          <div className="k1-flex k1-w-full k1-gap-4">
            <YesToggleButton
              pressed={answerType === true ? true : undefined}
              onClick={() => onClick("Yes")}
            />
            <NoToggleButton
              pressed={answerType === false ? true : undefined}
              onClick={() => onClick("No")}
            />
          </div>
          <p className="k1-text-base k1-font-normal k1-text-neutral">
            {detail}
          </p>
        </div>
      )}
    </Card>
  );
}

// TODO:
// 1. Fix custom paddings on card (desktop)
// 2.
