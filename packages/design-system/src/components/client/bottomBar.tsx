"use client";

import { twMerge } from "@repo/design-system/utils";
import type { PropsWithChildren } from "react";

import { Button } from "./button";

export type BottomBarButton = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "filled" | "outline" | "link" | "answer";
  color?: "primary" | "secondary" | "neutral";
  "data-checked"?: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
};

export type BottomBarProps<TItem extends Record<string, unknown>> = PropsWithChildren<{
  stepItems?: TItem[];
  stepCurrent?: number;
  stepTotal?: number;
  idKey?: keyof TItem;
  statusKey?: keyof TItem;
  leftButton?: BottomBarButton;
  centerButton?: BottomBarButton;
  rightButton?: BottomBarButton;
  className?: string;
}>;

function checkAnswer(status: boolean | null | undefined) {
  switch (status) {
    case true:
      return "ko:bg-primary";
    case false:
      return "ko:bg-secondary";
    case null:
    case undefined:
      return "ko:bg-neutral-inactive";
  }
}

export function BottomBar<TItem extends Record<string, unknown>>({ stepItems, stepCurrent, stepTotal, idKey, statusKey, leftButton, centerButton, rightButton, className }: BottomBarProps<TItem>) {
  const showProgressBar = stepItems && stepCurrent && stepTotal && idKey;

  return (
    <div className={twMerge("ko:fixed ko:bottom-0 ko:left-0 ko:right-0 ko:bg-white", className)}>
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="">
          <div
            role="progressbar"
            aria-label="Průběh otázek"
            aria-valuetext={`Otázka ${stepCurrent} z ${stepTotal}`}
            aria-valuenow={stepCurrent}
            aria-valuemin={1}
            aria-valuemax={stepTotal}
            className="ko:flex ko:items-center ko:justify-start"
          >
            {stepItems.map((step, index) => {
              const id = step[idKey] as string;
              const status = statusKey ? (step[statusKey] as boolean | null | undefined) : undefined;

              return (
                <div
                  key={`bar-${id}`}
                  aria-hidden="true"
                  style={{
                    flex: `1 1 calc(100% / ${stepTotal})`,
                    width: `calc(100% / ${stepTotal})`,
                  }}
                  className={twMerge(checkAnswer(status), stepCurrent === index + 1 ? "ko:h-2" : "ko:h-1", stepCurrent === index + 1 ? "ko:bg-neutral-active!" : "")}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Button Container */}
      <div className="ko:flex ko:items-center ko:justify-center ko:p-4 ko:gap-3">
        {leftButton && (
          <Button
            onClick={leftButton.onClick}
            disabled={leftButton.disabled}
            variant={leftButton.variant || "link"}
            color={leftButton.color || "neutral"}
            size="medium"
            data-checked={leftButton["data-checked"]}
            aria-label={leftButton["aria-label"]}
            aria-pressed={leftButton["aria-pressed"]}
          >
            <span className="ko:flex ko:items-center ko:gap-2">
              {leftButton.icon}
              <span>{leftButton.label}</span>
            </span>
          </Button>
        )}

        {centerButton && (
          <Button
            onClick={centerButton.onClick}
            disabled={centerButton.disabled}
            variant={centerButton.variant || "answer"}
            color={centerButton.color || "primary"}
            size="medium"
            data-checked={centerButton["data-checked"]}
            aria-label={centerButton["aria-label"]}
            aria-pressed={centerButton["aria-pressed"]}
          >
            <span className="ko:flex ko:items-center ko:gap-2">
              {centerButton.icon}
              <span>{centerButton.label}</span>
            </span>
          </Button>
        )}

        {rightButton && (
          <Button
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
            variant={rightButton.variant || "answer"}
            color={rightButton.color || "secondary"}
            size="medium"
            data-checked={rightButton["data-checked"]}
            aria-label={rightButton["aria-label"]}
            aria-pressed={rightButton["aria-pressed"]}
          >
            <span className="ko:flex ko:items-center ko:gap-2">
              {rightButton.icon}
              <span>{rightButton.label}</span>
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
