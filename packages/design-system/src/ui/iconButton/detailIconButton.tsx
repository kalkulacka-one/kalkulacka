import React, { ComponentProps } from "react";
import { ToggleIconButton } from "@repo/design-system/ui";
import { DetailDownIcon } from "@repo/design-system/icons";
import { DetailUpIcon } from "@repo/design-system/icons";

type Props = {
  starPressed?: boolean;
  onClick: () => void;
} & Omit<
  ComponentProps<typeof ToggleIconButton>,
  "iconDefault" | "iconPressed"
>;

const DetailIconButton = ({ starPressed, onClick, ...props }: Props) => {
  return (
    <ToggleIconButton
      iconDefault={DetailDownIcon}
      iconPressed={DetailUpIcon}
      onClick={onClick}
      togglePressed={starPressed}
      {...props}
    ></ToggleIconButton>
  );
};

export { DetailIconButton };
