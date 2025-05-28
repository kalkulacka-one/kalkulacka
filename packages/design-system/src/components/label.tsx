import { Label as LabelHeadless, type LabelProps as LabelPropsHeadless } from '@headlessui/react';
import React from 'react';

type Props = LabelPropsHeadless;

export function LabelComp({ children, ...props }: Props, ref: React.Ref<HTMLLabelElement>) {
  return (
    <LabelHeadless {...props} ref={ref}>
      {children}
    </LabelHeadless>
  );
}

export const Label = React.forwardRef<HTMLLabelElement, Props>(LabelComp);
