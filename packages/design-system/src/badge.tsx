import React from "react";
import BadgeStarIcon from "./Badge/BadgeStarIcon";

export interface BadgeProps {
  icon?: boolean;
  variant?: "neutral" | "secondary" | "primary";
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  icon = false,
  variant = "primary",
  children,
}) => {
  const showIcon = icon || variant === "primary";
  const neutralVariant = variant === "primary" || variant === "neutral";

  return (
    <div
      className={`k1-flex k1-flex-row k1-justify-center k1-items-center rounded-[0.375rem] px-[0.5rem] py-[0.25rem] k1-gap-1 m-0 font-bold uppercase relative ${showIcon ? "k1-w-[4.5rem]" : "k1-w-[3.125rem]"} ${showIcon ? "k1-h-[1.625rem]" : "k1-h-[1.5rem]"}`}
    >
      {showIcon && (
        <div className="k1-inline-block k1-items-center">
          <BadgeStarIcon />
        </div>
      )}
      <div
        className={`flex text-[0.625rem] font-bold leading-[1.125rem] k1-border-hidden k1-outline-none w-[2.125rem] h-[1.125rem] k1-items-center k1-justify-center k1-inline-block 
        ${neutralVariant ? "k1-text-[#565252]" : "k1-text-[#821414]"} 
        ${neutralVariant ? "bg-[#FFF4F5]" : "bg-[#F8F7F7]"}`}
      >
        {children}
      </div>
    </div>
  );
};

export { Badge };
