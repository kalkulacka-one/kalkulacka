import { Button as HeadlessUIButton } from '@headlessui/react';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  [
    'ko:inline-flex ko:min-w-fit ko:items-center',
    'ko:text-nowrap ko:data-[disabled]:cursor-not-allowed ko:data-[hover]:cursor-pointer',
    'ko:font-bold ko:uppercase',
    'ko:rounded-l-[16px] ko:rounded-br-[16px]',
    'ko:select-none',
    'ko:gap-2',
  ],
  {
    variants: {
      kind: {
        filled: 'ko:p-4 ko:text-neutral-inverse ko:data-[active]:bg-primary-strong-active ko:data-[disabled]:bg-neutral-disaled',
        inverse: 'ko:gap-4 ko:border-2 ko:bg-transparent ko:p-4 ko:data-[disabled]:border-neutral-disabled ko:data-[disabled]:text-neutral-disabled',
        outline: ['ko:border-2 ko:bg-transparent ko:p-4'],
        link: [
          'ko:gap-2 ko:bg-transparent ko:p-0 ko:text-neutral',
          'ko:border-0',
          'ko:data-[hover]:text-neutral-hover',
          'ko:data-[active]:text-neutral-active',
          'ko:data-[disabled]:text-neutral-disabled',
        ],
      },
      hasIcon: {
        true: 'ko:justify-between',
        false: 'ko:justify-center',
      },
      iconPosition: {
        left: 'ko:flex-row',
        right: 'ko:flex-row-reverse',
      },
      color: {
        primary: ['ko:bg-primary-strong', 'ko:data-[hover]:text-inverse'],
        secondary: ['ko:bg-secondary-strong', 'ko:data-[disabled]:bg-neutral-disaled'],
        neutral: ['ko:text-neutral', 'ko:data-[disabled]:border-neutral-disabled ko:data-[disabled]:text-neutral-disabled'],
      },
      size: {
        default: 'ko:h-14 ko:text-sm ko:leading-6 ko:tracking-wider',
        small: 'ko:h-10 ko:text-xs ko:leading-4 ko:tracking-wider',
        auto: 'ko:h-auto ko:text-sm ko:leading-6 ko:tracking-wider',
      },
      wider: {
        true: 'ko:px-6',
      },
      fitContent: {
        true: 'ko:w-fit',
        false: 'ko:w-full',
      },
    },

    defaultVariants: {
      kind: 'filled',
      size: 'default',
      fitContent: false,
    },

    compoundVariants: [
      {
        kind: 'filled',
        color: 'primary',
        className: [
          'ko:data-[hover]:bg-primary-strong-hover',
          'ko:border-2 ko:border-primary-strong',
          'ko:data-[hover]:border-primary-strong-hover',
          'ko:data-[hover]:data-[active]:bg-primary-strong-active ko:data-[hover]:data-[active]:border-primary-strong-active',
          'ko:data-[disabled]:bg-neutral-disaled ko:data-[disabled]:border-neutral-disabled',
        ],
      },
      {
        kind: 'filled',
        color: 'secondary',
        className: ['ko:data-[hover]:bg-secondary-strong-hover', 'ko:border-2 ko:border-secondary-strong ko:data-[hover]:border-secondary-strong-hover'],
      },
      {
        kind: 'filled',
        color: 'neutral',
        className: [
          'ko:border-2 ko:border-neutral-muted  ko:data-[hover]:border-neutral-strong',
          'ko:bg-neutral ko:text-neutral',
          'ko:data-[hover]:bg-neutral-strong-hover',
          'ko:data-[hover]:text-neutral-inverse',
        ],
      },
      {
        kind: 'inverse',
        color: 'primary',
        className: [
          'ko:border-primary-strong ko:text-primary ko:bg-transparent',
          'ko:data-[hover]:bg-primary-strong-hover ko:data-[hover]:border-primary-strong-hover',
          'ko:data-[hover]:data-[active]:border-primary-strong ko:data-[hover]:data-[active]:bg-primary-strong ko:data-[hover]:text-neutral-inverse',
          'ko:data-[pressed]:bg-primary-strong ko:data-[pressed]:text-neutral-inverse',
          'ko:data-[pressed]:data-[hover]:bg-primary-strong-hover ko:data-[pressed]:data-[hover]:data-[active]:bg-primary-strong',
        ],
      },
      {
        kind: 'inverse',
        color: 'secondary',
        className: [
          'ko:border-secondary-strong ko:text-secondary ko:bg-transparent',
          'ko:data-[hover]:bg-secondary-strong-hover ko:data-[hover]:border-secondary-strong-hover',
          'ko:data-[hover]:data-[active]:border-secondary-strong ko:data-[hover]:data-[active]:bg-secondary-strong ko:data-[hover]:text-neutral-inverse',
          'ko:data-[pressed]:bg-secondary-strong ko:data-[pressed]:text-neutral-inverse',
          'ko:data-[pressed]:data-[hover]:bg-secondary-strong-hover ko:data-[pressed]:data-[hover]:data-[active]:bg-secondary-strong',
        ],
      },
      {
        kind: 'inverse',
        color: 'neutral',
        className: [
          'ko:border-neutral-strong ko:text-neutral ko:bg-transparent',
          'ko:data-[hover]:bg-neutral-strong-hover ko:data-[hover]:border-neutral-strong-hover',
          'ko:data-[hover]:data-[active]:border-neutral-strong ko:data-[hover]:data-[active]:bg-neutral-backdrop-active ko:data-[hover]:text-neutral-inverse',
          'ko:data-[pressed]:bg-neutral-strong-hover ko:data-[pressed]:text-neutral-inverse',
          'ko:data-[pressed]:data-[hover]:bg-neutral-strong-hover ko:data-[pressed]:data-[hover]:data-[active]:bg-neutral-strong',
        ],
      },
      {
        kind: 'outline',
        color: 'primary',
        className: [
          'ko:bg-transparent',
          'ko:text-primary',
          'ko:border-primary-strong',
          'ko:data-[hover]:!bg-primary-backdrop-hover ko:data-[hover]:!text-primary',
          'ko:data-[hover]:data-[active]:!bg-transparent',
        ],
      },
      {
        kind: 'outline',
        color: 'secondary',
        className: [
          'ko:bg-transparent',
          'ko:text-secondary',
          'ko:border-secondary-strong',
          'ko:data-[hover]:!bg-secondary-backdrop-hover ko:data-[hover]:!text-secondary',
          'ko:data-[active]:bg-transparent',
          'ko:data-[hover]:data-[active]:!bg-transparent',
        ],
      },
      {
        kind: 'outline',
        color: 'neutral',
        className: [
          'ko:data-[hover]:bg-neutral-backdrop-hover',
          'ko:data-[active]:bg-transparent',
          'ko:data-[hover]:data-[active]:bg-neutral-backdrop-active ko:data-[hover]:data-[active]:border-neutral-strong ko:data-[hover]:data-[active]:text-neutral-strong',
        ],
      },
    ],
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    pressed?: boolean;
    answerType?: string;
    children?: React.ReactNode;
    compactable?: boolean;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };

const Button = React.forwardRef<HTMLButtonElement, Props>(({ children, kind, color, iconPosition, size, wider, fitContent, compactable, pressed, answerType, className, ...props }, ref) => {
  const Icon = props.icon;
  const hasIcon = !!Icon;

  return (
    <HeadlessUIButton
      className={twMerge(
        buttonVariants({
          kind,
          size,
          wider,
          fitContent,
          hasIcon,
          iconPosition,
          color,
        }),
        className,
      )}
      ref={ref}
      aria-pressed={pressed}
      data-pressed={pressed ? true : null}
      aria-label={pressed ? `Button ${answerType} pressed` : `Press ${answerType} button`}
      {...props}
    >
      {hasIcon ? <Icon className="ko:h-6 ko:w-6" /> : null}
      <div className={compactable ? 'ko:hidden ko:xs:block' : 'ko:block'}>{children}</div>
    </HeadlessUIButton>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
