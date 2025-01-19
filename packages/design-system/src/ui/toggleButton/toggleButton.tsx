import { Button } from "@repo/design-system/ui";
import { VariantProps } from "class-variance-authority";
import React, { ComponentProps, useState } from "react";
import { buttonVariants } from "..";

type Props = VariantProps<typeof buttonVariants> &
  ComponentProps<typeof Button>;
const ToggleButton = React.forwardRef<React.ElementRef<typeof Button>, Props>(
  ({ onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    function handlePressed(event: React.MouseEvent<HTMLButtonElement>) {
      setIsPressed((prevState) => !prevState);
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
        {...props}
      />
    );
  },
);

export { ToggleButton };
