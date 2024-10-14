import React from "react";
import { cva } from "class-variance-authority";
import { BadgeStarIcon } from "./Badge/BadgeStarIcon";

export interface BadgeProps {
  icon?: boolean;
  color?: "neutral" | "secondary";
  children?: React.ReactNode;
}

const badge = cva(
  [
    "k1-inline-flex k1-rounded k1-px-xs k1-py-xxs k1-gap-1 k1-font-bold k1-text-xs k1-font-sans k1-flex-nowrap k1-items-center k1-uppercase k1-leading-4 k1-tracking-wider",
  ],
  {
    variants: {
      color: {
        neutral: ["k1-text-neutral", "k1-bg-neutral"],
        secondary: ["k1-text-secondary-strong k1-bg-secondary"],
      },
    },
  },
);

const Badge: React.FC<BadgeProps> = ({ icon = false, color, children }) => {
  const neutralVariant = color === "neutral";

  return (
    <div
      className={badge({
        color: neutralVariant ? "neutral" : "secondary",
      })}
    >
      {icon && <BadgeStarIcon className="k1-w-[18px] k1-h-[18px]" />}
      <div className="k1-whitespace-nowrap">{children}</div>
    </div>
  );
};

export { Badge };
