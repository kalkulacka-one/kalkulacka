import React, { ComponentProps, ReactHTMLElement, useEffect } from "react";
import { IconButton } from "@repo/design-system/ui";

type Props = {
  togglePressed?: boolean;
  iconDefault: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPressed: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
} & Omit<ComponentProps<typeof IconButton>, "icon">;

const ToggleIconButton = React.forwardRef<
  React.ElementRef<typeof IconButton> & ReactHTMLElement<HTMLButtonElement>,
  Props
>(
  (
    { children, iconPressed, iconDefault, onClick, togglePressed, ...props },
    ref,
  ) => {
    const [isPressed, setIsPressed] = React.useState(togglePressed);

    function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
      setIsPressed((prevState) => !prevState);
      if (onClick) {
        onClick(event);
      }
    }

    useEffect(() => {
      setIsPressed(togglePressed);
    }, [togglePressed]);

    return (
      <IconButton
        pressed={isPressed}
        onClick={handleToggle}
        icon={isPressed || togglePressed ? iconPressed : iconDefault}
        aria-pressed={isPressed}
        {...props}
        ref={ref}
      >
        {children}
      </IconButton>
    );
  },
);

export { ToggleIconButton };
