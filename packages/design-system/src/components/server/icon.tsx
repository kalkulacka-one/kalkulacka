import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type SvgIconProps = {
  title?: string;
  titleId?: string;
  decorative?: boolean;
} & React.SVGProps<SVGSVGElement>;

type SvgIcon = React.FunctionComponent<SvgIconProps>;

type BaseIconProps = {
  icon: string | SvgIcon;
} & VariantProps<typeof IconStyles> &
  React.SVGProps<SVGSVGElement>;

type ConditionalIconProps =
  | {
      title: string;
      decorative: false;
    }
  | { title?: string; decorative: true };

type IconProps = BaseIconProps & ConditionalIconProps;

const IconStyles = cva("", {
  variants: {
    size: {
      small: "ko:size-4",
      medium: "ko:size-6",
      large: "ko:size-8",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
export function Icon({ icon, size, title, decorative, className, ...props }: IconProps) {
  if (typeof icon === "string") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={decorative ? "true" : "false"}
        focusable="false"
        role="img"
        className={twMerge(IconStyles({ size }), className)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {title && <title id={titleId}>{title}</title>}
        <path d={icon} fill="currentColor" />
      </svg>
    );
  }
  const SvgIcon = icon;
  return <SvgIcon title={title} focusable="false" role="img" aria-hidden={decorative ? "true" : "false"} {...props} className={twMerge(IconStyles({ size }), className)} />;
}
