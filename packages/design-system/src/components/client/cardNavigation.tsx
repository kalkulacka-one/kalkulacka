"use client";

import { twMerge } from "@repo/design-system/utils";
import { type PropsWithChildren, useEffect, useMemo } from "react";

import { ChevronLeftIcon, ChevronRightIcon, DoubleChevronLeftIcon, DoubleChevronRightIcon } from "../icons";
import { Button } from "./button";

export type NavigationButton = {
  onClick: () => void;
  label: string;
  shortLabel: string;
  disabled?: boolean;
  icon?: "chevron" | "doubleChevron";
};

export type CardNavigationProps = PropsWithChildren<{
  previous?: NavigationButton;
  next?: NavigationButton;
  className?: string;
}>;

export function CardNavigation({ children, previous, next, className }: CardNavigationProps) {
  const PreviousIcon = useMemo(() => (previous?.icon === "doubleChevron" ? DoubleChevronLeftIcon : ChevronLeftIcon), [previous?.icon]);
  const NextIcon = useMemo(() => (next?.icon === "doubleChevron" ? DoubleChevronRightIcon : ChevronRightIcon), [next?.icon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && previous && !previous.disabled) {
        event.preventDefault();
        previous.onClick();
      } else if (event.key === "ArrowRight" && next && !next.disabled) {
        event.preventDefault();
        next.onClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [previous, next]);

  return (
    <div className={twMerge("ko:min-h-screen ko:flex ko:items-start ko:lg:items-center ko:justify-center ko:p-4", className)}>
      <div className="ko:w-full ko:max-w-5xl ko:grid ko:gap-4 ko:grid-cols-2 ko:grid-rows-[auto_1fr] ko:lg:grid-cols-[auto_1fr_auto] ko:lg:grid-rows-1">
        {/* Previous button */}
        <div className="ko:flex ko:items-start ko:justify-start ko:lg:items-center">
          {previous ? (
            <Button onClick={previous.onClick} disabled={previous.disabled} variant="link" color="neutral" size="small">
              <span className="ko:flex ko:items-center ko:gap-2">
                <PreviousIcon className="ko:h-4 ko:w-4 ko:flex-shrink-0" />
                <span className="ko:inline ko:sm:hidden">{previous.shortLabel}</span>
                <span className="ko:hidden ko:sm:inline">{previous.label}</span>
              </span>
            </Button>
          ) : (
            <div />
          )}
        </div>

        {/* Content area */}
        <div className="ko:col-span-2 ko:row-start-2 ko:lg:col-span-1 ko:lg:row-start-1 ko:lg:col-start-2 ko:flex ko:items-start ko:lg:items-center ko:justify-center">{children}</div>

        {/* Next button */}
        <div className="ko:flex ko:items-start ko:justify-end ko:col-start-2 ko:row-start-1 ko:lg:col-start-3 ko:lg:items-center">
          {next ? (
            <Button onClick={next.onClick} disabled={next.disabled} variant="link" color="neutral" size="small">
              <span className="ko:flex ko:items-center ko:gap-2">
                <span className="ko:inline ko:sm:hidden">{next.shortLabel}</span>
                <span className="ko:hidden ko:sm:inline">{next.label}</span>
                <NextIcon className="ko:h-4 ko:w-4 ko:flex-shrink-0" />
              </span>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
