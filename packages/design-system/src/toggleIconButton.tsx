import React, { ComponentProps } from "react";
import { IconButton } from "@repo/design-system/iconButton";

type Props = {
  iconDefault: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPressed: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
} & Omit<ComponentProps<typeof IconButton>, "icon" | "onClick">;

const ToggleIconButton = React.forwardRef<
  React.ElementRef<typeof IconButton>,
  Props
>(({ children, iconPressed, iconDefault }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);
  function handleToggle() {
    setIsPressed((prevState) => !prevState);
  }

  return (
    <IconButton
      pressed={isPressed}
      onClick={handleToggle}
      icon={isPressed ? iconPressed : iconDefault}
      size="default"
      iconSize="default"
      iconWrapper="default"
      aria-pressed={isPressed}
      ref={ref}
    >
      {children}
    </IconButton>
  );
});

export { ToggleIconButton };
