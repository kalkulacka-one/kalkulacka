// import React, { useState, ComponentProps } from "react";
// import { Button, buttonVariants } from "@repo/design-system/button";
// import { VariantProps } from "class-variance-authority";

// type Props = VariantProps<typeof buttonVariants> &
//   ComponentProps<typeof Button> & {
//     children: React.ReactElement;
//   };

// const ToggleButton = React.forwardRef<React.ElementRef<typeof Button>, Props>(
//   ({ children, ...props }, ref) => {
//     const [isPressed, setIsPressed] = useState(false);

//     function handlePressed() {
//       setIsPressed((prevState) => !prevState);
//     }

//     Child check
//     if (React.isValidElement(children)) {
//       return React.cloneElement(children, {
//         onClick: handlePressed,
//         pressed: isPressed,
//         ref,
//         ...props,
//       });
//     }

//     Fallback
//     return (
//       <Button onClick={handlePressed} pressed={isPressed} ref={ref} {...props}>
//         {children}
//       </Button>
//     );
//   },
// );

// export { ToggleButton };

// original solution

import React, { useState, ComponentProps } from "react";
import { Button, buttonVariants } from "@repo/design-system/button";
import { VariantProps } from "class-variance-authority";

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
        ref={ref}
        {...props}
      />
    );
  },
);

export { ToggleButton };
