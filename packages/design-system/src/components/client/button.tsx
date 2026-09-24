import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon } from "./icon";

export type Button = {
  children: React.ReactNode;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

/*
 * Colour is expressed through the "ano/ne" pair (agree/disagree) plus the
 * neutral ink, not through party-agnostic primary/secondary names, so a
 * themed instance can restyle the yes/no meaning without touching this
 * component. `primary`/`secondary`/`neutral` are kept as the prop values —
 * every caller already spells them that way — they just resolve to the new
 * tokens instead of the old flat `--color-primary`/`--color-secondary`.
 */
export const ButtonVariants = cva(
  [
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-semibold ko:tracking-[.01em]",
    "ko:rounded-pill",
    "ko:text-s",
    "ko:border-2",
    "ko:transition-[background-color,color,border-color,transform] ko:duration-base ko:data-active:duration-fast",
    "ko:data-disabled:cursor-not-allowed ko:data-disabled:opacity-45",
    "ko:grid ko:grid-flow-col ko:place-items-center ko:place-content-center ko:gap-1",
    "ko:data-active:scale-[0.97]",
    "ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
  ],
  {
    variants: {
      size: {
        small: "ko:h-10 ko:px-4",
        medium: "ko:h-12 ko:px-5",
      },
      variant: {
        fill: [""],
        outline: ["ko:bg-transparent"],
        link: ["ko:bg-transparent"],
        answer: ["ko:rounded-control ko:px-6"],
      },
      color: {
        primary: ["ko:border-agree", "ko:data-disabled:border-agree"],
        secondary: ["ko:border-disagree", "ko:data-disabled:border-disagree"],
        neutral: ["ko:border-neutral-ink", "ko:data-disabled:border-neutral-ink"],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "fill",
      color: "primary",
    },
    compoundVariants: [
      {
        variant: "link",
        class: ["ko:border-transparent", "ko:data-disabled:border-transparent"],
      },
      {
        variant: "fill",
        color: "primary",
        class: ["ko:bg-agree", "ko:text-on-agree", "ko:data-hover:bg-agree-hover", "ko:data-focus:bg-agree-hover", "ko:data-active:bg-agree-active", "ko:data-hover:data-active:bg-agree-active"],
      },
      {
        variant: "fill",
        color: "secondary",
        class: [
          "ko:bg-disagree",
          "ko:text-on-disagree",
          "ko:data-hover:bg-disagree-hover",
          "ko:data-focus:bg-disagree-hover",
          "ko:data-active:bg-disagree-active",
          "ko:data-hover:data-active:bg-disagree-active",
        ],
      },
      {
        variant: "fill",
        color: "neutral",
        class: [
          "ko:bg-neutral-ink",
          "ko:text-on-neutral-ink",
          "ko:data-hover:bg-neutral-ink/90",
          "ko:data-focus:bg-neutral-ink/90",
          "ko:data-active:bg-neutral-ink/80",
          "ko:data-hover:data-active:bg-neutral-ink/80",
        ],
      },
      {
        variant: "outline",
        color: "primary",
        class: [
          "ko:text-agree",
          "ko:data-hover:bg-agree-wash ko:data-focus:bg-agree-wash",
          "ko:data-active:bg-agree-wash-strong",
          "ko:data-hover:data-active:bg-agree-wash-strong",
          "ko:data-disabled:text-agree",
        ],
      },
      {
        variant: "outline",
        color: "secondary",
        class: [
          "ko:text-disagree",
          "ko:data-hover:bg-disagree-wash ko:data-focus:bg-disagree-wash",
          "ko:data-active:bg-disagree-wash-strong",
          "ko:data-hover:data-active:bg-disagree-wash-strong",
          "ko:data-disabled:text-disagree",
        ],
      },
      {
        variant: "outline",
        color: "neutral",
        class: [
          "ko:text-neutral-ink",
          "ko:data-hover:bg-neutral-wash ko:data-focus:bg-neutral-wash",
          "ko:data-active:bg-neutral-wash-strong",
          "ko:data-hover:data-active:bg-neutral-wash-strong",
          "ko:data-disabled:text-neutral-ink",
        ],
      },
      {
        variant: "link",
        color: "primary",
        class: [
          "ko:text-agree",
          "ko:data-hover:bg-agree-wash ko:data-hover:text-agree-hover ko:data-focus:text-agree-hover",
          "ko:data-active:text-agree-active ko:data-active:bg-agree-wash",
          "ko:data-hover:data-active:text-agree-active",
          "ko:data-disabled:text-agree",
        ],
      },
      {
        variant: "link",
        color: "secondary",
        class: [
          "ko:text-disagree",
          "ko:data-hover:bg-disagree-wash ko:data-hover:text-disagree-hover ko:data-focus:text-disagree-hover",
          "ko:data-active:text-disagree-active ko:data-active:bg-disagree-wash",
          "ko:data-hover:data-active:text-disagree-active",
          "ko:data-disabled:text-disagree",
        ],
      },
      {
        variant: "link",
        color: "neutral",
        class: [
          "ko:text-neutral-ink",
          "ko:data-hover:bg-neutral-wash ko:data-hover:text-text-strong ko:data-focus:text-text-strong",
          "ko:data-active:text-text-strong ko:data-active:bg-neutral-wash",
          "ko:data-hover:data-active:text-text-strong",
          "ko:data-disabled:text-neutral-ink",
        ],
      },
      {
        variant: "answer",
        color: "primary",
        class: [
          "ko:text-agree",
          "ko:hover:bg-agree ko:hover:text-on-agree",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-agree",
          "ko:data-checked:bg-agree ko:data-checked:text-on-agree",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-agree ko:data-checked:active:bg-agree-wash-strong ko:data-checked:active:border-agree",
          "ko:data-checked:data-[just-clicked]:hover:!bg-agree ko:data-checked:data-[just-clicked]:hover:!text-on-agree",
          "ko:data-active:bg-agree-active ko:data-active:border-agree-active ko:data-active:hover:bg-agree-active ko:data-active:text-on-agree",
        ],
      },
      {
        variant: "answer",
        color: "secondary",
        class: [
          "ko:text-disagree",
          "ko:hover:bg-disagree ko:hover:text-on-disagree",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-disagree",
          "ko:data-checked:bg-disagree ko:data-checked:text-on-disagree",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-disagree ko:data-checked:active:bg-disagree-wash-strong ko:data-checked:active:border-disagree",
          "ko:data-checked:data-[just-clicked]:hover:!bg-disagree ko:data-checked:data-[just-clicked]:hover:!text-on-disagree",
          "ko:data-active:bg-disagree-active ko:data-active:border-disagree-active ko:data-active:hover:bg-disagree-active ko:data-active:text-on-disagree",
        ],
      },
      {
        variant: "answer",
        color: "neutral",
        class: [
          "ko:text-neutral-ink",
          "ko:hover:bg-neutral-ink ko:hover:text-on-neutral-ink",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-neutral-ink",
          "ko:data-checked:bg-neutral-ink ko:data-checked:text-on-neutral-ink",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-neutral-ink ko:data-checked:active:bg-neutral-wash-strong ko:data-checked:active:border-neutral-ink",
          "ko:data-checked:data-[just-clicked]:hover:!bg-neutral-ink ko:data-checked:data-[just-clicked]:hover:!text-on-neutral-ink",
          "ko:data-active:bg-neutral-ink/80 ko:data-active:border-neutral-ink ko:data-active:hover:bg-neutral-ink/80 ko:data-active:text-on-neutral-ink",
        ],
      },
    ],
  },
);

function ButtonComponent({ children, size, variant, color, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  const isIconOnly = React.isValidElement(children) && (children as React.ReactElement).type === Icon;

  const iconOnlyClasses = isIconOnly ? "ko:aspect-square ko:!p-0 ko:!rounded-full ko:grid ko:place-items-center" : "";

  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ size, variant, color }), iconOnlyClasses)} {...props} ref={ref}>
      {children}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
