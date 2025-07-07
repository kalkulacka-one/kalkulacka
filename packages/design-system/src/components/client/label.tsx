// export { Label, type LabelProps } from '@headlessui/react';

import { Label as LabelHeadless, type LabelProps as LabelPropsHeadless } from "@headlessui/react";
import React from "react";

export type Label = LabelPropsHeadless;

function LabelComponent({ children, ...props }: Label, ref: React.Ref<HTMLLabelElement>) {
  return (
    <LabelHeadless {...props} ref={ref}>
      {children}
    </LabelHeadless>
  );
}

export const Label = React.forwardRef<HTMLLabelElement, Label>(LabelComponent);
