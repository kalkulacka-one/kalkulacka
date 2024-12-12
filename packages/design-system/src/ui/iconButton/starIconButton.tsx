import React, { ComponentProps } from "react";
import { ToggleIconButton } from "@repo/design-system/ui";
import { StarIcon } from "@repo/design-system/icons";
import { StarIconFilled } from "@repo/design-system/icons";

type Props = {
  starPressed?: boolean;
  onClick: () => void;
} & Omit<
  ComponentProps<typeof ToggleIconButton>,
  "iconDefault" | "iconPressed"
>;

const StarIconButton = ({ starPressed, onClick, ...props }: Props) => {
  return (
    <ToggleIconButton
      iconDefault={StarIcon}
      iconPressed={StarIconFilled}
      onClick={onClick}
      togglePressed={starPressed}
      {...props}
    >
      Pro mě důležité
    </ToggleIconButton>
  );
};

export { StarIconButton };
