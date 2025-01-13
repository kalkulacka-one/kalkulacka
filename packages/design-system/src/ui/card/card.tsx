import React from "react";
import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof cardVariants> &
  HTMLAttributes<HTMLDivElement>;

const cardVariants = cva(
  "focus:k1-ring-8 focus:k1-ring-purple-500 disabled:k1-pointer-events-none disabled:k1-bg-neutral-disabled",
  {
    variants: {
      color: {
        white:
          // TODO: add white as neutral-fg-inverse to the config?
          "k1-bg-white active:k1-bg-neutral-backdrop-active",
        blue: "k1-bg-primary hover:k1-bg-primary-strong-hover active:k1-bg-primary-strong-active",
        transparent:
          "k1-bg-transparent hover:k1-bg-neutral-backdrop-hover active:k1-bg-neutral-backdrop-active",
      },
      corner: {
        topRight: "k1-rounded-l k1-rounded-br",
        topLeft: "k1-rounded-r k1-rounded-bl",
        bottomRight: "k1-rounded-t k1-rounded-bl",
        bottomLeft: "k1-rounded-t k1-rounded-br",
      },
      border: {
        default: "k1-border k1-border-neutral",
        strong: "k1-border k1-border-primary-strong",
        none: null,
      },
      shadow: {
        default: "k1-shadow-neutral",
        none: null,
      },
    },
    defaultVariants: {
      color: "white",
      corner: "topRight",
      border: "default",
      shadow: "default",
    },
  },
);

const Card = ({
  children,
  color,
  corner,
  border,
  shadow,
  className,
  ...rest
}: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        cardVariants({ color, corner, border, shadow }),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export { Card, cardVariants };
