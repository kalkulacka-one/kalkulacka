import React from "react";
import BadgeStarIcon from "./Badge/BadgeStarIcon";
import { cva } from "class-variance-authority";

export interface BadgeProps {
  icon?: boolean,
  color?: "neutral" | "secondary",
  size?: "with_icon" | "no_icon",
  children?: React.ReactNode,
}


const badge = cva(
  [
    "k1-flex k1-flex-row k1-rounded-[0.375rem] k1-px-[0.5rem] k1-py-[0.25rem] k1-gap-1 k1-m-0 k1-font-bold k1-uppercase k1-relative k1-inline-block k1-max-w-fit",
  ],
  {
    variants: {
      color: {
        neutral: ["k1-text-neutral", "k1-bg-neutral"],
        secondary: ["k1-text-secondary-hover", "k1-bg-secondary"],
      },
    },
  },
);

const Badge: React.FC<BadgeProps> = ({
  icon = false,
  color,
  size,
  children,
}) => {
  const showIcon = icon || size === "with_icon";
  const neutralVariant = color === "neutral";

  return (
    <div
      className={badge({
        color: neutralVariant ? "neutral" : "secondary",
      })}
    >
      {showIcon && (
        <div className="k1-inline-block k1-items-center">
          <BadgeStarIcon />
        </div>
      )}
      <div
        className={`k1-text-[0.625rem] k1-font-bold k1-leading-4 k1-border-hidden k1-outline-none w-[2.125rem] h-[1.125rem] k1-items-center k1-justify-center k1-inline-block k1-tracking-[0.04] k1-align-bottom`}
      >
        {children}
      </div>
    </div>
  );
};

export { Badge };
