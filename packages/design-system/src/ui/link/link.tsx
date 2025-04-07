import { type VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import React from 'react';

const linkCompStyles = cva('', {
  variants: {
    kind: {
      button: '',
      link: '',
    },
    color: {
      neutral: 'ko:text-neutral-30',
      primary: 'ko:text-primary ko:hover:text-primary-30',
    },
    underline: {
      true: 'ko:hover:underline',
      false: '',
    },
    linkArrow: {
      true: 'ko:after:content-["_↗"]',
      false: '',
    },
  },
});

type LinkComponentProps = {
  children: React.ReactNode;
} & LinkProps &
  VariantProps<typeof linkCompStyles>;

function LinkComponent({ children, color, kind, underline, linkArrow, ...props }: LinkComponentProps, ref: React.Ref<HTMLAnchorElement>) {
  return (
    <Link className={linkCompStyles({ color, underline, kind, linkArrow })} ref={ref} {...props}>
      {children}
    </Link>
  );
}

const LinkComp = React.forwardRef<HTMLAnchorElement, LinkComponentProps>(LinkComponent);

export { LinkComp };
