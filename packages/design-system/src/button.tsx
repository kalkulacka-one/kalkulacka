import React from "react";
import { Button as HeadlessUIButton } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "k1-inline-flex k1-items-center k1-justify-center hover:k1-cursor-pointer k1-text-nowrap disabled:k1-pointer-events-none k1-uppercase k1-font-bold",
  {
    variants: {
      variant: {
        default:
          "k1-rounded-l k1-rounded-br k1-text-left k1-w-full k1-text-neutral-inverse k1-bg-primary-strong hover:k1-bg-primary-strong-hover active:k1-bg-primary-strong-active disabled:k1-bg-neutral-disaled",
        filled:
          "k1-rounded-l k1-rounded-br k1-w-full k1-text-neutral-inverse k1-bg-primary-strong hover:k1-bg-primary-strong-hover active:k1-bg-primary-strong-active disabled:k1-bg-neutral-disaled",
        outline:
          "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-neutral k1-border-neutral-strong hover:k1-text-neutral-strong hover:k1-bg-neutral-backdrop-hover active:k1-bg-neutral-backdrop-active active:k1-text-neutral-active disabled:k1-text-neutral-disabled disabled:k1-bg-neutral-disaled disabled:k1-border-neutral-disabled",
        link: "k1-gap-2 k1-w-auto k1-text-neutral hover:k1-text-neutral-hover active:k1-text-neutral-active disabled:k1-text-neutral-disabled ",
        answerInFavour:
          "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-primary k1-border-primary-strong hover:k1-bg-primary-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-primary-strong-hover active:k1-bg-primary-strong active:k1-text-neutral-inverse active:k1-border-primary-strong",
        answerAgainst:
          "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-secondary k1-border-secondary-strong hover:k1-bg-secondary-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-secondary-strong-hover active:k1-bg-secondary-strong active:k1-text-neutral-inverse active:k1-border-secondary-strong",
        answerNeutral:
          "k1-rounded-l k1-rounded-br k1-w-full k1-border-2 k1-text-neutral k1-border-neutral-strong hover:k1-bg-neutral-strong-hover hover:k1-text-neutral-inverse hover:k1-shadow-neutral-70 hover:k1-border-neutral-strong-hover active:k1-bg-neutral-strong-active active:k1-text-neutral-inverse active:k1-border-neutral-active",
        icon: "k1-p-2 k1-rounded-full k1-text-neutral hover:k1-bg-neutral-backdrop-hover active:k1-bg-neutral-backdrop-active",
      },
      size: {
        default: "k1-h-14 k1-px-4 k1-text-sm k1-tracking-wider k1-leading-6",
        sm: "k1-h-10 k1-px-4 k1-text-xs k1-tracking-wider k1-leading-4",
        iconSm: "k1-h-8 k1-w-8",
        iconDefault: "k1-h-10 k1-w-10",
        iconLg: "k1-h-14 k1-w-14",
        linkDefault: "k1-h-6",
        linkSm: "k1-h-4",
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : HeadlessUIButton;
    return (
      <Comp
        className={`${buttonVariants({ variant, size })} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
