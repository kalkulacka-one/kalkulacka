import { Input as InputHeadless, type InputProps as InputPropsHeadless } from '@headlessui/react';
import React from 'react';

type Props = React.ComponentProps<'input'> & InputPropsHeadless;

export function InputComp({ ...props }: Props, ref: React.Ref<HTMLInputElement>) {
  return <InputHeadless ref={ref} {...props} className="ko:w-full ko:border ko:border-black ko:rounded-2xl ko:rounded-br-none ko:p-4" />;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(InputComp);
