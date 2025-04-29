import { Input as InputHeadless, type InputProps } from '@headlessui/react';
import React from 'react';

type InputCompProps = React.ComponentProps<'input'> & InputProps;

export function InputComp({ invalid, type, placeholder, ...props }: InputCompProps, ref: React.Ref<HTMLInputElement>) {
  return <InputHeadless invalid={invalid} ref={ref} {...props} type={type} placeholder={placeholder} className="ko:w-full ko:border ko:border-black ko:rounded-2xl ko:rounded-br-none ko:p-4" />;
}

export const Input = React.forwardRef<HTMLInputElement, InputCompProps>(InputComp);
