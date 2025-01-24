import { Button, buttonVariants } from "@repo/design-system/ui";
import { VariantProps } from "class-variance-authority";
import React, { ComponentProps, useState } from "react";

type Props = {
  toggleButtonPressed?: boolean;
} & VariantProps<typeof buttonVariants> &
  ComponentProps<typeof Button>;
const ToggleButton = React.forwardRef<React.ElementRef<typeof Button>, Props>(
  ({ toggleButtonPressed, onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(toggleButtonPressed);
    function handlePressed(event: React.MouseEvent<HTMLButtonElement>) {
      setIsPressed((prevState) => !prevState);
      console.log(`From toggleButton: ${isPressed}`);
      if (onClick) {
        onClick(event);
      }
    }

    return (
      <Button
        onClick={handlePressed}
        pressed={isPressed}
        data-active={isPressed ? true : null}
        ref={ref}
        // className="k1-bg-red-400 k1-w-[270px]"
        {...props}
      />
    );
  },
);

export { ToggleButton };
