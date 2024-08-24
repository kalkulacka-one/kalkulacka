import React from "react";
import BadgeStarIcon from "./Badge/BadgeStarIcon";
import { cva } from "class-variance-authority";

export interface BadgeProps {
  icon?: boolean,
  color?: "neutral" | "secondary",
  size?: "with_icon" | "no_icon",
  children?: React.ReactNode,
}


const badge = cva(["k1-flex k1-flex-row k1-justify-center k1-items-center rounded-[0.375rem] px-[0.5rem] py-[0.25rem] k1-gap-1 m-0 font-bold uppercase relative"], {
  variants: {
      color: {
          neutral: [
              "k1-text-[#565252]",
              "bg-[#FFF4F5]"
          ],
          secondary: [
              "k1-text-[#821414]",
               "bg-[#F8F7F7]"
          ]     
          },
      size: {
          with_icon: [
              "k1-w-[4.5rem]",
              "k1-h-[1.625rem]"
          ],
          no_icon: [
              "k1-w-[3.125rem]", 
              "k1-h-[1.5rem]"
          ]
      }
  },
})

const Badge: React.FC<BadgeProps> = ({
  icon = false,
  color,
  size,
  children,
}) => {
  const showIcon = icon || size === "with_icon";
  const neutralVariant = color === "neutral";

  return (
    <div className={badge({ color: neutralVariant ? 'neutral' : 'secondary', size: showIcon ? 'with_icon' : 'no_icon' })}
    >    
        {showIcon && (
        <div className="k1-inline-block k1-items-center">
          <BadgeStarIcon />
        </div>
      )}
      <div
        className={`flex text-[0.625rem] font-bold leading-[1.125rem] k1-border-hidden k1-outline-none w-[2.125rem] h-[1.125rem] k1-items-center k1-justify-center k1-inline-block`}   
      >
        {children}
      </div>
    </div>
  );
};

export { Badge };
