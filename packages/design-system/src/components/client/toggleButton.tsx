import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import { Button } from "@kalkulacka-one/design-system/client";
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

  return <SwitchHeadless {...props} onChange={handleClick} onMouseLeave={handleMouseLeave} data-just-clicked={justClicked || undefined} as={Button} ref={ref} />;
}

export const ToggleButton = React.forwardRef(ToggleComponent);
