import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import { Button } from "@repo/design-system/client";
import * as React from "react";

export type ToggleButton = Omit<SwitchPropsHeadless<typeof Button>, "as">;

function ToggleComponent(props: ToggleButton, ref: React.Ref<HTMLButtonElement>) {
  return <SwitchHeadless {...props} as={Button} ref={ref} />;
}

export const ToggleButton = React.forwardRef(ToggleComponent);
