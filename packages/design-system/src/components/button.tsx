import * as Headless from '@headlessui/react';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ButtonComponent({ children, ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return (
    <Headless.Button
      className="ko:select-none ko:data-[hover]:cursor-pointer ko:tracking-[.07em] ko:leading-[1.85] ko:uppercase ko:border-2 ko:border-black ko:font-bold ko:p-4 ko:text-sm ko:rounded-2xl ko:rounded-tr-none ko:font-display"
      ref={ref}
      {...props}
    >
      {children}
    </Headless.Button>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
