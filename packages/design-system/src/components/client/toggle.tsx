import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import * as React from "react";

// biome-ignore lint/suspicious/noExplicitAny: allow any for generic `as` prop support
export type Toggle = SwitchPropsHeadless<any>;

// biome-ignore lint/suspicious/noExplicitAny: allow any for loose ref signature
function ToggleComponent(props: Toggle, ref: React.Ref<any>) {
  return <SwitchHeadless {...props} ref={ref} />;
}

const Toggle = React.forwardRef(ToggleComponent) as unknown as typeof SwitchHeadless;
Object.assign(Toggle, SwitchHeadless);
// biome-ignore lint/style/useExportType: we export a type *and* a value Toggle
export { Toggle };
