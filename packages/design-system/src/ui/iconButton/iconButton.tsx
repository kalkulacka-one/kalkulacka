import React from "react";
import { Button, ButtonProps } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";

const IconButtonVariants = cva(
  ["k1-inline-flex k1-w-auto k1-select-none k1-items-center k1-gap-2"],

  {
    variants: {
      size: {
        small: "k1-h-8 k1-w-8",
        default: "k1-h-10 k1-w-10",
        large: "k1-h-14 k1-w-14",
      },
    },
  },
);

const IconVariants = cva(
  [
    "k1-flex k1-items-center k1-justify-center k1-rounded-full hover:k1-bg-neutral-backdrop-hover active:k1-bg-neutral-backdrop-active",
  ],
  {
    variants: {
      iconWrapper: {
        small: "k1-h-8 k1-w-8",
        default: "k1-h-10 k1-w-10",
        large: "k1-h-14 k1-w-14",
      },
      iconSize: {
        small: "k1-h-4 k1-w-4",
        default: "k1-h-6 k1-w-6",
        large: "k1-h-10 k1-w-10",
      },
    },
  },
);

type Props = {
  pressed?: boolean;
  children?: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  "aria-label"?: string;
} & VariantProps<typeof IconButtonVariants> &
  VariantProps<typeof IconVariants> &
  ButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon: Icon, size, iconWrapper, iconSize, children, ...props }, ref) => {
    return (
      <Button ref={ref} className={IconButtonVariants({ size })} {...props}>
        <div className={IconVariants({ iconWrapper })}>
          <Icon className={IconVariants({ iconSize })} />
        </div>

        <div className="k1-hidden md:k1-block">{children}</div>
      </Button>
    );
  },
);

export { IconButton, IconButtonVariants, IconVariants };

//TODO:
// 1. fix wrapper/icon hover bug
// 2. iconWrapper hover on button hover
