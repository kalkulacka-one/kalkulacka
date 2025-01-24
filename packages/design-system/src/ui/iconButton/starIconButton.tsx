import React, { ComponentProps, ReactHTMLElement } from "react";
import { ToggleIconButton, IconButtonVariants } from "@repo/design-system/ui";
import { StarIcon } from "@repo/design-system/icons";
import { StarIconFilled } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  children?: React.ReactNode;
  starPressed?: boolean;
  onClick: (currentQuestion: number) => void;
} & Omit<
  ComponentProps<typeof ToggleIconButton>,
  "iconDefault" | "iconPressed"
> &
  VariantProps<typeof IconButtonVariants>;

const StarIconButton = ({
  children,
  starPressed,
  onClick,
  ...props
}: Props) => {
  return (
    <ToggleIconButton
      iconDefault={StarIcon}
      iconPressed={StarIconFilled}
      onClick={onClick}
      iconSize="large"
      togglePressed={starPressed}
      {...props}
    >
      {children}
    </ToggleIconButton>
  );
};

export { StarIconButton };
