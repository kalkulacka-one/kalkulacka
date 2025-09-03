import { twMerge } from "@repo/design-system/utils";
import { cva } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

const TypographyVariants = cva("", {
  variants: {
    size: {
      xs: "ko:text-xs ko:sm:text-xs ko:md:text-xs ko:lg:text-xs",
      sm: "ko:text-xs ko:sm:text-sm ko:md:text-sm ko:lg:text-sm",
      base: "ko:text-sm ko:sm:text-base ko:md:text-base ko:lg:text-base",
      lg: "ko:text-base ko:sm:text-lg ko:md:text-lg ko:lg:text-lg",
      xl: "ko:text-lg ko:sm:text-xl ko:md:text-xl ko:lg:text-xl",
      "2xl": "ko:text-xl ko:sm:text-2xl ko:md:text-2xl ko:lg:text-2xl",
      "3xl": "ko:text-2xl ko:sm:text-3xl ko:md:text-3xl ko:lg:text-3xl",
      "4xl": "ko:text-3xl ko:sm:text-4xl ko:md:text-4xl ko:lg:text-4xl",
      "5xl": "ko:text-4xl ko:sm:text-5xl ko:md:text-5xl ko:lg:text-5xl",
    },
    family: {
      display: "ko:font-display",
      sans: "ko:font-sans",
      mono: "ko:font-mono",
    },
    weight: {
      light: "ko:font-light",
      normal: "ko:font-normal",
      medium: "ko:font-medium",
      semibold: "ko:font-semibold",
      bold: "ko:font-bold",
    },
    leading: {
      none: "ko:leading-none",
      tight: "ko:leading-tight",
      snug: "ko:leading-snug",
      normal: "ko:leading-normal",
      relaxed: "ko:leading-relaxed",
      loose: "ko:leading-loose",
    },
  },
  defaultVariants: {
    size: "base",
    family: "sans",
    weight: "normal",
    leading: "normal",
  },
});

export type TypographyProps<T extends ElementType = "span"> = {
  as?: T;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  family?: "display" | "sans" | "mono";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  className?: string;
} & ComponentProps<T>;

export const Typography = <T extends ElementType = "span">({ as, size, family, weight, leading, className, ...props }: TypographyProps<T>) => {
  const Component = as || ("span" as T);

  return <Component className={twMerge(TypographyVariants({ size, family, weight, leading }), className)} {...props} />;
};

Typography.displayName = "Typography";
