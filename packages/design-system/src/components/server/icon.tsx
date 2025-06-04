import { type VariantProps, cva } from "class-variance-authority";
import React from "react";
import type { IconType } from "../../types/icon-types";
import * as Icons from "./icons";

export const iconVariants = {
  variants: {
    size: {
      small: "ko:size-4",
      medium: "ko:size-6",
      large: "ko:size-8",
      extraLarge: "ko:size-10",
      extraHuge: "ko:size-14",
    },
  },
} as const;

const iconStyles = cva("", {
  variants: iconVariants.variants,
  defaultVariants: {
    size: "medium",
  },
});

type IconVariants = VariantProps<typeof iconStyles>;
type IconSize = IconVariants["size"];
export const iconSizes = Object.keys(iconVariants.variants.size) as IconSize[];

type IconProps = {
  name: IconType;
  title: string;
} & VariantProps<typeof iconStyles>;

export function Icon({ name, size, title, ...props }: IconProps) {
  const className = iconStyles({ size });
  const IconComponent = React.createElement(Icons[name], { ...props, title, className });
  return IconComponent;
}
