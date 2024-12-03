import React, { ComponentProps } from "react";
import { ToggleIconButton } from "@repo/design-system/toggleIconButton";
import { StarIcon } from "@repo/design-system/starIcon";
import { StarIconFilled } from "@repo/design-system/starIconFilled";

type Props = Omit<
  ComponentProps<typeof ToggleIconButton>,
  "iconDefault" | "iconPressed"
>;

const StarIconButton = (props: Props) => {
  return (
    <ToggleIconButton
      iconDefault={StarIcon}
      iconPressed={StarIconFilled}
      {...props}
    >
      Pro mě důležité
    </ToggleIconButton>
  );
};

export { StarIconButton };
