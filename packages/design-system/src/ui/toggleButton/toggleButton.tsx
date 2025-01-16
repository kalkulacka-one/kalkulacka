import { Button } from "@repo/design-system/ui";
import { VariantProps } from "class-variance-authority";
import React, { ComponentProps, useState } from "react";
import { buttonVariants } from "..";

type Props = VariantProps<typeof buttonVariants> &
  Omit<ComponentProps<typeof Button>, "onClick">;
const ToggleButton = React.forwardRef<React.ElementRef<typeof Button>, Props>(
  ({ ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    function handlePressed() {
      setIsPressed((prevState) => !prevState);
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
