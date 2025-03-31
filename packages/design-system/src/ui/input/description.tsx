import { Description as DescriptionPrimitive } from '@headlessui/react';
import { type VariantProps, cva } from 'class-variance-authority';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const descriptionVariants = cva(['ko:absolute ko:-bottom-2.5 ko:right-4 ko:inline-flex ko:items-center ko:gap-1 ko:bg-white ko:px-1 ko:text-sm'], {
  variants: {
    state: {
      default: 'ko:text-neutral-strong',
      error: 'ko:text-secondary',
    },
  },
});

// Description is <p> element, but we don't need to expose it to the caller in our design system.
type Props = PropsWithChildren<{} & VariantProps<typeof descriptionVariants>>;

function Description({ state, children }: Props) {
  return (
    <DescriptionPrimitive
      className={twMerge(
        descriptionVariants({
          state,
        }),
      )}
    >
      {children}
    </DescriptionPrimitive>
  );
}

export { Description };
