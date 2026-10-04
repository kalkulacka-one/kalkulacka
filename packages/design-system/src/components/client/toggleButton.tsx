import { Button } from "@kalkulacka-one/design-system/client";

import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import * as React from "react";

export type ToggleButton = Omit<SwitchPropsHeadless<typeof Button>, "as">;

function ToggleComponent(props: ToggleButton, ref: React.Ref<HTMLButtonElement>) {
  const [justClicked, setJustClicked] = React.useState(false);

  const handleClick = (checked: boolean) => {
    setJustClicked(true);
    props.onChange?.(checked);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setJustClicked(false);
    props.onMouseLeave?.(e);
  };

  // Headless UI's Switch only answers to Space; a button is expected to answer to Enter too.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    props.onKeyDown?.(e);
    if (e.key === "Enter" && !e.defaultPrevented) {
      e.preventDefault();
      handleClick(!props.checked);
    }
  };

  return <SwitchHeadless {...props} onChange={handleClick} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} data-just-clicked={justClicked || undefined} as={Button} ref={ref} />;
}

export const ToggleButton = React.forwardRef(ToggleComponent);
