import { Button as HeadlessButton } from '@headlessui/react';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ButtonComponent(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { children, ...rest } = props;
  return (
    <HeadlessButton
      className="ko:flex ko:items-center ko:select-none ko:data-[hover]:cursor-pointer ko:leading-[1.85] ko:tracking-[.07em] ko:uppercase ko:border-2 ko:border-black ko:font-bold ko:p-4 ko:text-sm ko:rounded-2xl ko:rounded-tr-none ko:font-display"
      ref={ref}
      {...rest}
    >
      {children}
    </HeadlessButton>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonComponent);
Button.displayName = 'Button';

export { Button };
