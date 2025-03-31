import { Field as FieldPrimitive } from '@headlessui/react';
import { cva } from 'class-variance-authority';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const fieldVariants = cva(
  [
    'ko:relative ko:flex ko:w-full ko:items-center ko:gap-2 ko:rounded-[1rem] ko:rounded-br-none ko:border ko:border-neutral ko:p-4 ko:focus-within:outline-2 ko:focus-within:outline-offset-2 ko:focus-within:outline-primary-30 ko:disabled:border-neutral-disabled',
  ],
  {
    variants: {
      state: {
        default: ['ko:bg-white ko:text-neutral-strong ko:focus-visible:border-neutral-active', 'ko:focus-within:border-neutral-active ko:focus-visible:text-neutral-active'],
        error:
          // :not(:focus-within) not supported in TW
          'ko:border-secondary-strong ko:text-secondary-strong ko:focus-within:border-secondary-strong ko:hover:border-secondary-strong ko:focus-visible:border-secondary-strong',
      },
    },
  },
);

type Props = PropsWithChildren<{
  error?: string;
  state?: 'default' | 'error';
  className?: string;
}>;

function Field({ state, children }: Props) {
  return <FieldPrimitive className={twMerge(fieldVariants({ state }))}>{children}</FieldPrimitive>;
}

export { Field };
