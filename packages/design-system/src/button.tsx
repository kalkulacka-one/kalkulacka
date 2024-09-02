import React from "react";
import { Button as HeadlessUIButton } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "k1-uppercase k1-font-bold k1-rounded-tl-2xl k1-rounded-bl-2xl k1-rounded-br-2xl",
  {
    variants: {
      variant: {
        // defaul == filled ??
        default:
          "k1-text-[#FFFFFF] k1-bg-[#0070F4] hover:k1-bg-[#0A3EAF] active:k1-bg-[#091233] disabled:k1-bg-[#DAD8D7]",
        filled:
          "k1-text-[#FFFFFF] k1-bg-[#0070F4] hover:k1-bg-[#0A3EAF] active:k1-bg-[#091233] disabled:k1-bg-[#DAD8D7]",
        // backdrop colors use predefined by designer or opacity tw class?
        outline:
          "k1-text-[#565252] hover:k1-bg-[#DAD8D7] hover:k1-bg-opacity-20 active:k1-bg-[#DAD8D7] active:k1-bg-opacity-60 k1-border-2 disabled:k1-bg-[#DAD8D7] disabled:k1-border-[#DAD8D7] k1-border-[#565252]",
        link: "k1-text-[#565252] k1-p-0 hover:k1-bg-[#ADA6A6] active:k1-bg-[#000000] disabled:k1-bg-[#DAD8D7]",
        // fix borders shit, shadows
        answerInFavour:
          "k1-border-[#0070F4] k1-border-2 k1-py-4 k1-px-6 k1-text-[#0070F4] hover:k1-bg-[#0A3EAF] hover:k1-text-[#FFFFFF] hover:k1-border-none active:k1-bg-[#0070F4] active:k1-text-[#FFFFFF]",
        answerAgainst:
          "k1-border-[#D04646] k1-border-2 k1-py-4 k1-px-6 k1-text-[#D04646] hover:k1-bg-[#821414] hover:k1-text-[#FFFFFF] hover:k1-border-none active:k1-bg-[#D04646] active:k1-text-[#FFFFFF]",

        answerNeutral:
          "k1-border-[#565252] k1-border-2 k1-py-4 k1-px-6 k1-text-[#565252] hover:k1-bg-[#565252] hover:k1-text-[#FFFFFF] active:k1-bg-[#1D1C1C] active:k1-text-[#FFFFFF]",
      },
      size: {
        default: "k1-p-4 k1-text-sm k1-tracking-wider k1-leading-6",
        sm: "k1-px-4 k1-py-2 k1-text-xs k1-tracking-wider k1-leading-4",
        icon: "k1-p-4",
      },
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
