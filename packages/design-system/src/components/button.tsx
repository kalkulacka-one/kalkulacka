import * as Headless from '@headlessui/react';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const ButtonStyles = cva(
  [
    'ko:data-disabled:bg-gray-400 ko:data-disabled:border-gray-400 ko:data-disabled:cursor-not-allowed ko:data-disabled:data-hover:text-white',
    'ko:p-4',
    'ko:select-none ko:data-hover:cursor-pointer',
    'ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]',
    'ko:rounded-tr-none ko:rounded-2xl',
    'ko:text-xs',
  ],
  {
    variants: {
      kind: {
        filled: ['ko:bg-black', 'ko:text-white', 'ko:data-hover:bg-white ko:data-hover:text-black', 'ko:border-2', 'ko:border-black'],
      },
    },
  },
);

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonStyles>;

function ButtonComponent({ children, kind, ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return (
    <Headless.Button className={ButtonStyles({ kind })} ref={ref} {...props}>
      {children}
    </Headless.Button>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
