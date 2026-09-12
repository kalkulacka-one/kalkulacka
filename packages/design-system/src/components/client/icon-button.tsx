import type { IconDefinition } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon } from "./icon";

export type IconButton = {
  icon: IconDefinition | string;
  /**
   * The accessible name. Required rather than optional — an icon-only control
   * with no label is invisible to a screen reader, and there is no sensible
   * fallback to derive from a path.
   */
  label: string;
} & Omit<ButtonPropsHeadless, "className" | "as" | "children"> &
  VariantProps<typeof IconButtonVariants>;

export const IconButtonVariants = cva(
  [
    "ko:inline-flex ko:items-center ko:justify-center ko:flex-none",
    "ko:p-0 ko:border-0 ko:rounded-pill",
    "ko:text-text ko:cursor-pointer",
    "ko:transition-[background-color,box-shadow,color,transform] ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)]",
    "ko:data-active:scale-[0.94]",
    "ko:data-disabled:opacity-45 ko:data-disabled:cursor-default",
    "ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
  ],
  {
    variants: {
      variant: {
        ghost: ["ko:bg-transparent", "ko:data-hover:bg-neutral-wash"],
        /*
         * Its own plate, for the shell header — the backdrop drifting underneath
         * means the contrast behind this button is never the same two frames
         * running. Deliberately the same values as Button's `plate` variant.
         */
        surface: [
          "ko:bg-surface/72",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:backdrop-blur-[12px] ko:backdrop-saturate-[1.4]",
          "ko:data-hover:bg-surface ko:data-hover:shadow-[inset_0_0_0_1.5px_var(--ko-color-border-strong),var(--ko-shadow-card-back)]",
        ],
      },
      size: {
        /* The 44px touch-target minimum, not a visual size. */
        medium: "ko:size-11",
        large: "ko:size-12",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "medium",
    },
  },
);

/**
 * A square, icon-only control.
 *
 * `surface` is the variant that has to work anywhere: the shell's menu trigger
 * sits over the animated backdrop on every screen, so it carries its own
 * translucent plate rather than trusting whatever colour happens to be behind
 * it that frame.
 */
function IconButtonComponent({ icon, label, variant, size, ...props }: IconButton, ref: React.Ref<HTMLButtonElement>) {
  return (
    <ButtonHeadless className={twMerge(IconButtonVariants({ variant, size }))} {...props} aria-label={label} ref={ref}>
      <Icon icon={icon} size={size === "large" ? "medium" : "regular"} decorative />
    </ButtonHeadless>
  );
}

const IconButton = React.forwardRef(IconButtonComponent);

export { IconButton };
