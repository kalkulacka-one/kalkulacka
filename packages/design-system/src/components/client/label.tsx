import { Label as LabelHeadless, type LabelProps as LabelPropsHeadless } from "@headlessui/react";
import React from "react";

export type Label = LabelPropsHeadless;
function LabelComponent({ ...props }: Label, ref: React.Ref<HTMLLabelElement>) {
  return <LabelHeadless {...props} ref={ref} />;
}

const Label = React.forwardRef<HTMLLabelElement, Label>(LabelComponent);

export { Label };
