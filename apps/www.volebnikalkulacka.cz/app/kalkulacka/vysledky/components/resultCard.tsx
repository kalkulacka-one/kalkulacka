import { Card } from "@repo/design-system/server";
import { ProgressBar } from "@repo/design-system/server";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";

export type ResultCandidateCard = {
  children: React.ReactNode;
};

export function ResultCandidateCard({ children }: ResultCandidateCard) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 justify-between"> {children}</div>
      </div>
    </Card>
  );
}

export type ResultCandidateCardCircle = {
  children: React.ReactNode;
} & VariantProps<typeof resultCandidateCardCircleVariants>;

const resultCandidateCardCircleVariants = cva("flex items-center justify-center rounded-full", {
  variants: {
    strong: {
      true: "text-[var(--ko-color-on-bg-primary)] size-16 bg-[var(--ko-color-primary)]",
      false: "text-gray-400 size-12 bg-blue-100",
    },
  },
  defaultVariants: {
    strong: false,
  },
});

export function ResultCandidateCardCircle({ children, strong }: ResultCandidateCardCircle) {
  return <div className={resultCandidateCardCircleVariants({ strong })}>{children}.</div>;
}

export type ResultCandidateCardProgress = {
  value: number;
};

export function ResultCandidateCardProgress({ value }: ResultCandidateCardProgress) {
  return <ProgressBar value={value} />;
}

export type ResultCandidateCardShortTitle = {
  children: React.ReactNode;
};

export function ResultCandidateCardShortTitle({ children }: ResultCandidateCardShortTitle) {
  return <span className="font-bold text-2xl">{children}</span>;
}

export type ResultCandidateCardLongTitle = {
  children: React.ReactNode;
};

export function ResultCandidateCardLongTitle({ children }: ResultCandidateCardLongTitle) {
  return <span>{children}</span>;
}

export type ResultCandidateCardResult = {
  children: React.ReactNode;
};

export function ResultCandidateCardResult({ children }: ResultCandidateCardResult) {
  return children;
}

ResultCandidateCard.Circle = ResultCandidateCardCircle;
ResultCandidateCard.Progress = ResultCandidateCardProgress;
ResultCandidateCard.ShortTitle = ResultCandidateCardShortTitle;
ResultCandidateCard.LongTitle = ResultCandidateCardLongTitle;
