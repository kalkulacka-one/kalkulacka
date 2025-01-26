"use client";
import { Badge } from "@repo/design-system/badge";
import { YesIcon, NoIcon, NeutralIcon } from "@repo/design-system/icons";
import {
  Button,
  Card,
  RecapYesToggleButton,
  RecapNoToggleButton,
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
      className="k1-flex k1-min-w-full k1-flex-col k1-gap-6 k1-p-recapitulationCardMobile lg:k1-py-recapitulationCardDesktop"
    >
      {/* top wrapper */}
      <div className="k1-grid k1-grid-cols-[min-content_1fr_min-content_min-content] k1-items-center k1-gap-x-2">
        {/* toggle star */}
        {/* icon edit large icon size and wrapper */}
        <StarIconButton
          iconSize="large"
          iconWrapper="default"
          starPressed={isImportant ? true : undefined}
          onClick={() => onClick("toggleImportant")}
        />
        {/* top toggled wrapper */}

        <div
          className={`${detailToggled ? "k1-flex k1-w-full k1-gap-4  min-[701px]:k1-hidden" : "k1-hidden"}`}
        >
          <RecapYesToggleButton
            pressed={answerType === true ? true : undefined}
            onClick={() => onClick("Yes")}
          />
          <RecapNoToggleButton
            pressed={answerType === false ? true : undefined}
            onClick={() => onClick("No")}
          />
        </div>

        <div
          className={`${detailToggled ? "k1-mr-auto k1-flex k1-flex-col max-[700px]:k1-hidden" : "k1-mr-auto k1-flex k1-flex-col"}`}
        >
          <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-2">
            <span className=" k1-text-sm k1-font-light  k1-text-neutral">
              {currentQuestion}/{questionCount}
            </span>
            <span className="k1-hidden k1-font-primary k1-text-sm k1-font-light k1-text-neutral min-[700px]:k1-inline  sm:k1-inline">
              {title}
            </span>
            <Badge color="neutral">{tags}</Badge>
          </div>
          <div>
            {/* TODO: line height fix value */}
            {/* replace with typo compoment */}
            <p className="k1-hidden k1-font-primary k1-font-semibold k1-leading-normal k1-tracking-wide k1-text-neutral min-[700px]:k1-block  sm:k1-text-base">
              {statement}
            </p>
            {/* mobile title */}
            <p className="k1-font-primary k1-text-sm k1-font-light k1-leading-tight k1-text-neutral min-[700px]:k1-hidden">
              {title}
            </p>
          </div>
        </div>
        <div
          className={`${detailToggled ? "k1-hidden min-[701px]:k1-invisible" : "k1-block"}`}
        >
          {/* rendering buttons here */}
          {switchButton(answerType)}
        </div>
        <DetailIconButton onClick={toggleDetail} />
      </div>
      {detailToggled && (
        // detail wrapper
        <>
          {/* button wrapper */}
          <div
            className={`${detailToggled ? "k1-hidden k1-w-full k1-gap-4  min-[701px]:k1-flex" : null}`}
          >
            <RecapYesToggleButton
              pressed={answerType === true ? true : undefined}
              onClick={() => onClick("Yes")}
            />
            <RecapNoToggleButton
              pressed={answerType === false ? true : undefined}
              onClick={() => onClick("No")}
            />
          </div>
          {/* detail wrapper */}
          <div>
            {/* top toggled wrapper */}
            <div className="k1-mb-4 k1-flex k1-flex-col k1-gap-4 min-[701px]:k1-hidden">
              <div className="k1-flex k1-items-center k1-gap-2">
                <span className=" k1-text-sm k1-font-light  k1-text-neutral">
                  {currentQuestion}/{questionCount}
                </span>
                <Badge color="neutral">{tags}</Badge>
              </div>
              <div>
                <p className="k1-block k1-font-primary k1-text-sm k1-font-light k1-leading-tight k1-text-neutral min-[701px]:k1-hidden">
                  {title}
                </p>
                <p className="k1-hidden k1-font-primary k1-font-semibold k1-leading-normal k1-tracking-wide k1-text-neutral max-[700px]:k1-block  sm:k1-text-base">
                  {statement}
                </p>
              </div>
            </div>

            <p className="k1-text-base k1-font-light k1-text-neutral">
              {detail}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

// TODO:
// 1. Fix custom paddings behaviour on card (desktop)
// 2. Simplify structure (toggle behaviour content order), if possible
