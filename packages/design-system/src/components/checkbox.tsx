import { Checkbox as CheckboxHeadless, type CheckboxProps as CheckboxPropsHeadless } from '@headlessui/react';
import React from 'react';

type Props = CheckboxPropsHeadless;

export function CheckboxComp({ children, ...props }: Props, ref: React.Ref<HTMLElement>) {
  return <CheckboxHeadless {...props} ref={ref} />;
}

export const Checkbox = React.forwardRef<HTMLElement, Props>(CheckboxComp);

// import { Checkbox as CheckboxHeadless, type CheckboxProps } from '@headlessui/react';
// import React, { type ElementType } from 'react';

// const DEFAULT_CHECKBOX_TAG = 'span';

// type Props<TTag extends ElementType = typeof DEFAULT_CHECKBOX_TAG, TType = string> = CheckboxProps<TTag, TType>;

// type GenericCheckboxComp = <TTag extends ElementType = typeof DEFAULT_CHECKBOX_TAG, TType = string>(props: Props<TTag, TType> & React.RefAttributes<HTMLElement>) => React.ReactNode;

// export function CheckboxComp<TTag extends ElementType = typeof DEFAULT_CHECKBOX_TAG, TType = string>({ children, ...props }: Props<TTag, TType>, ref: React.Ref<HTMLElement>) {
//   return <CheckboxHeadless {...props} ref={ref} />;
// }

// export const Checkbox: GenericCheckboxComp = React.forwardRef(CheckboxComp);
