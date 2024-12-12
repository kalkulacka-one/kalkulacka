import React, { ComponentProps } from "react";
import { IconButton } from "@repo/design-system/ui";

type Props = {
  togglePressed?: boolean;
  iconDefault: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPressed: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
} & Omit<ComponentProps<typeof IconButton>, "icon">;

const ToggleIconButton = React.forwardRef<
  React.ElementRef<typeof IconButton>,
  Props
>(({ children, iconPressed, iconDefault, onClick, togglePressed }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    setIsPressed((prevState) => !prevState);
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <IconButton
      pressed={isPressed}
      onClick={handleToggle}
      icon={isPressed || togglePressed ? iconPressed : iconDefault}
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
