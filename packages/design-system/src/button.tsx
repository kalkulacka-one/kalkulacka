import React from "react";
import { Button as HeadlessUIButton } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "k1-inline-flex k1-items-center k1-justify-center k1-min-w-fit",
    "data-[hover]:k1-cursor-pointer k1-text-nowrap data-[disabled]:k1-pointer-events-none",
    "k1-uppercase k1-font-bold",
    "k1-rounded-l k1-rounded-br",
    "k1-select-none",
  ],
  {
    variants: {
      kind: {
        filled:
          "k1-p-4 data-[active]:k1-bg-primary-strong-active data-[disabled]:k1-bg-neutral-disaled",
        outline: "k1-border-2 k1-bg-transparent k1-p-4",
        link: [
          "k1-bg-transparent k1-text-neutral k1-p-0 k1-gap-2",
          "k1-border-0",
          "data-[hover]:k1-text-neutral-hover",
          "data-[active]:k1-text-neutral-active",
          "data-[disabled]:k1-text-neutral-disabled",
        ],
      },
      hasIcon: {
        true: "k1-justify-between",
        false: "k1-justify-center",
      },
      iconPosition: {
        left: "k1-flex-row",
        right: "k1-flex-row-reverse",
      },
      color: {
        primary: [
          "k1-text-neutral-inverse k1-bg-primary-strong",
          "data-[hover]:k1-bg-primary-strong-hover data-[hover]-k1-text-white",
        ],
        secondary: [
          "k1-text-neutral-inverse k1-bg-secondary-strong",
          "data-[hover]:k1-bg-secondary-strong-hover",
          "data-[disabled]:k1-bg-neutral-disaled",
        ],
        neutral: [
          "k1-border-2 k1-text-neutral k1-border-neutral-strong",
          "data-[hover]:k1-bg-neutral-backdrop-hover data-[hover]:k1-border-neutral-strong",
          "data-[active]:k1-bg-neutral-backdrop-active data-[active]:k1-text-neutral-active",
          "data-[disabled]:k1-border-neutral-disabled data-[disabled]:k1-text-neutral-disabled",
        ],
      },
      size: {
        default: "k1-h-14 k1-text-sm k1-tracking-wider k1-leading-6",
        small: "k1-h-10 k1-text-xs k1-tracking-wider k1-leading-4",
      },
      wider: {
        true: "k1-px-6",
      },
      fitContent: {
        true: "k1-w-fit",
        false: "k1-w-full",
      },
    },

    defaultVariants: {
      kind: "filled",
      size: "default",
      fitContent: false,
    },

    compoundVariants: [
      {
        kind: "outline",
        color: "primary",
        wider: true,
        className: [
          "k1-border-primary-strong k1-text-primary k1-gap-4",
          "data-[hover]:k1-border-primary-strong-hover data-[hover]:k1-text-neutral-inverse data-[hover]:k1-bg-primary-strong-hover",
          "data-[active]:k1-bg-primary-strong data-[active]:k1-text-neutral-inverse data-[active]:k1-border-primary-strong-active",
        ],
      },
      {
        kind: "outline",
        color: "secondary",
        wider: true,
        className: [
          "k1-border-secondary-strong k1-text-secondary k1-gap-4",
          "data-[hover]:k1-border-secondary-strong-hover data-[hover]:k1-text-neutral-inverse data-[hover]:k1-bg-secondary-strong-hover",
          "data-[active]:k1-bg-secondary-strong data-[active]:k1-text-neutral-inverse data-[active]:k1-border-secondary-strong-active",
        ],
      },
      {
        kind: "outline",
        color: "neutral",
        wider: true,
        className: [
          "k1-border-neutral-strong k1-text-neutral k1-gap-4",
          "data-[hover]:k1-border-neutral-strong-hover data-[hover]:k1-text-neutral-inverse data-[hover]:k1-bg-neutral-strong-hover",
          "data-[active]:k1-bg-neutral-strong-active data-[active]:k1-text-neutral-inverse data-[active]:k1-border-neutral-active",
        ],
      },
    ],
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    compactable?: boolean;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      children,
      kind,
      color,
      iconPosition,
      size,
      wider,
      fitContent,
      compactable,
      ...props
    },
    ref,
  ) => {
    const Icon = props.icon;
    const hasIcon = !!Icon;

    return (
      <HeadlessUIButton
        className={`${buttonVariants({ kind, size, wider, fitContent, iconPosition, hasIcon, color })} ${className || ""}`}
        ref={ref}
        {...props}
      >
        {hasIcon ? <Icon className="k1-w-6 k1-h-6" /> : null}
        {!compactable ? children : null}
      </HeadlessUIButton>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
