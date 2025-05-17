import { type VariantProps, cva } from 'class-variance-authority';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

type SvgIconProps = {
  title?: string;
  titleId?: string;
  decorative?: boolean;
} & React.SVGProps<SVGSVGElement>;

type SvgIcon = React.FunctionComponent<SvgIconProps>;

type BaseProps = {
  icon: string | SvgIcon;
} & VariantProps<typeof IconStyles> &
  React.SVGProps<SVGSVGElement>;

type ConditionalProps =
  | {
      title: string;
      decorative: false;
    }
  | { title?: string; decorative: true };

type Props = BaseProps & ConditionalProps;

const IconStyles = cva('', {
  variants: {
    size: {
      small: 'ko:size-4',
      medium: 'ko:size-6',
      large: 'ko:size-8',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
export function Icon({ icon, size, title, decorative, className, ...props }: Props) {
  const titleId = useId();
  if (typeof icon === 'string') {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={decorative ? 'true' : 'false'}
        aria-labelledby={!decorative ? titleId : undefined}
        focusable="false"
        role={decorative ? undefined : 'img'}
        className={twMerge(IconStyles({ size }), className)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {!decorative && title && <title id={titleId}>{title}</title>}
        <path d={icon} fill="currentColor" />
      </svg>
    );
  }
  const SvgIcon = icon;
  return (
    <SvgIcon
      {...props}
      title={title}
      titleId={titleId}
      decorative={decorative}
      focusable="false"
      role={decorative ? undefined : 'img'}
      aria-labelledby={!decorative ? titleId : undefined}
      aria-hidden={decorative ? 'true' : 'false'}
      className={twMerge(IconStyles({ size }), className)}
    />
  );
}
