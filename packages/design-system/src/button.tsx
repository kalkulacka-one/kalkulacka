import React from "react";
import { Button as HeadlessUIButton } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "k1-inline-flex k1-items-center data-[hover]:k1-cursor-pointer k1-text-nowrap data-[disabled]:k1-pointer-events-none k1-uppercase k1-font-bold",
  {
    variants: {
      // color intead of vartiant?
      variant: {
        filled: "k1-rounded-l k1-rounded-br k1-w-full",
        outline: "k1-rounded-l k1-rounded-br k1-w-full",
        link: "k1-gap-2 k1-w-auto k1-text-neutral data-[hover]:k1-text-neutral-hover data-[active]:k1-text-neutral-active data-[disabled]:k1-text-neutral-disabled ",

        // answerInFavour:
        //   "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-primary k1-border-primary-strong hover:k1-bg-primary-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-primary-strong-hover active:k1-bg-primary-strong active:k1-text-neutral-inverse active:k1-border-primary-strong",
        // answerAgainst:
        //   "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-secondary k1-border-secondary-strong hover:k1-bg-secondary-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-secondary-strong-hover active:k1-bg-secondary-strong active:k1-text-neutral-inverse active:k1-border-secondary-strong",
        // answerNeutral:
        //   "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-neutral k1-border-neutral-strong hover:k1-bg-neutral-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-neutral-strong-hover active:k1-bg-neutral-strong-active active:k1-text-neutral-inverse active:k1-border-neutral-active",
        // icon: "k1-p-2 k1-rounded-full k1-text-neutral hover:k1-bg-neutral-backdrop-hover active:k1-bg-neutral-backdrop-active",
      },
      // button label start / end, flex space between
      // before / after vs right / left naming?
      hasIcon: {
        true: "k1-justify-between",
        false: "k1-justify-center",
      },
      iconPosition: {
        left: "",
        right: "k1-flex-row-reverse",
      },
      iconSize: {
        small: "k1-h-8 k1-w-8",
        default: "k1-h-10 k1-w-10",
        large: "k1-h-14 k1-w-14",
      },
      color: {
        primary:
          "k1-text-neutral-inverse k1-bg-primary-strong data-[hover]:k1-bg-primary-strong-hover data-[active]:k1-bg-primary-strong-active data-[disabled]:k1-bg-neutral-disaled",
        neutral:
          "k1-border-2 k1-text-neutral k1-border-neutral-strong data-[hover]:k1-text-neutral-strong data-[hover]:k1-bg-neutral-backdrop-hover data-[active]:k1-bg-neutral-backdrop-active data-[active]:k1-text-neutral-active data-[disabled]:k1-text-neutral-disabled data-[disabled]:k1-bg-neutral-disaled data-[disabled]:k1-border-neutral-disabled",
      },
      size: {
        large: "k1-h-14 k1-px-4 k1-text-sm k1-tracking-wider k1-leading-6",
        small: "k1-h-10 k1-px-4 k1-text-xs k1-tracking-wider k1-leading-4",
        // linkDefault: "k1-h-6",
        // linkSm: "k1-h-4",
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "large",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      children,
      variant,
      color,
      iconSize,
      iconPosition,
      size,
      ...props
    },
    ref,
  ) => {
    const Icon = props.icon;
    const hasIcon = !!Icon;
    console.log(hasIcon);
    return (
      <HeadlessUIButton
        className={`${buttonVariants({ variant, size, iconPosition, hasIcon, color })} ${className || ""}`}
        ref={ref}
        {...props}
      >
        {hasIcon ? (
          <Icon
            className={buttonVariants({
              iconSize,
              variant: null,
              hasIcon: null,
              iconPosition: null,
              color: null,
              size: null,
            })}
          />
        ) : null}
        {children}
      </HeadlessUIButton>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
