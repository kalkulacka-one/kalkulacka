import { Field as FieldHeadlessOriginal, type FieldProps } from '@headlessui/react';
import React, { type Ref } from 'react';

type Props = FieldProps;

const FieldHeadless = FieldHeadlessOriginal as React.ForwardRefExoticComponent<FieldProps & React.RefAttributes<HTMLFieldSetElement>>;
export function FieldComp({ children, ...props }: Props, ref: Ref<HTMLFieldSetElement>) {
  return (
    <FieldHeadless {...props} ref={ref}>
      {children}
    </FieldHeadless>
  );
}

export const Field = React.forwardRef<HTMLFieldSetElement, Props>(FieldComp);
