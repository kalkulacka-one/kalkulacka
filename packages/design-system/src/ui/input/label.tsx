import { Label as LabelPrimitive } from '@headlessui/react';
import { type VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// need to add font Inter and create custom label text

const labelVariants = cva(
  [
    'ko:absolute ko:left-4 ko:px-1 ko:uppercase',
    'ko:font-bold',
    'ko:bg-white',
    'ko:text-base',
    'ko:peer-data-[empty=false]:ml-0',
    'ko:peer-data-[focus]:ml-0',
    'ko:peer-data-[empty=false]:text-xs',
    'ko:peer-data-[focus]:text-xs',
    'ko:transition-all ko:duration-200 ko:peer-data-[focus]:translate-y-[-120%]',
    'ko:transition-all ko:duration-200 ko:peer-data-[empty=false]:translate-y-[-120%]',
  ],
  {
    variants: {
      state: {
        default: 'ko:text-neutral-strong',
        error: 'ko:text-secondary-strong',
      },
      hasIcon: {
        true: 'ko:ml-10 ko:peer-data-[empty=false]:pl-1 ko:peer-data-[focus]:pl-1',
      },
    },
    defaultVariants: {
      state: 'default',
      hasIcon: false,
    },
  },
);

const Label = forwardRef<React.ElementRef<typeof LabelPrimitive>, React.ComponentPropsWithoutRef<typeof LabelPrimitive> & VariantProps<typeof labelVariants>>(
  ({ className, state, hasIcon, ...props }, ref) => (
    <LabelPrimitive
      ref={ref}
      className={twMerge(
        labelVariants({
          state,
          hasIcon,
        }),
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = LabelPrimitive.displayName;

export { Label };
