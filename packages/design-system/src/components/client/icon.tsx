import { twMerge } from "@kalkulacka-one/design-system/utils";

import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";

export type Icon = {
  icon:
    | string
    | React.FunctionComponent<
        {
          title?: string;
          titleId?: string;
          decorative?: boolean;
        } & React.SVGProps<SVGSVGElement>
      >;
  isIcon?: true;
} & VariantProps<typeof IconVariants> &
  React.SVGProps<SVGSVGElement> &
  ({ title: string; decorative: false } | { title?: string; decorative: true });

// TODO: Update after spacing & sizing is finalized.
const IconVariants = cva("", {
  variants: {
    size: {
      small: "ko:size-4 ko:min-w-4",

      medium: "ko:size-6 ko:min-w-6",

      large: "ko:size-8 ko:min-w-8",
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export function Icon({ icon, size, title, decorative, isIcon = true, className, ...props }: Icon) {
  const titleId = useId();

  // Don't pass isIcon to DOM elements
  const { isIcon: _, ...domProps } = { isIcon, ...props };

  if (typeof icon === "string") {
    return (
      <svg
        {...domProps}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={decorative ? "true" : "false"}
        aria-labelledby={!decorative ? titleId : undefined}
        focusable="false"
        role={decorative ? undefined : "img"}
        className={twMerge(IconVariants({ size }), className)}
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
      {...domProps}
      title={title}
      titleId={titleId}
      decorative={decorative}
      focusable="false"
      role={decorative ? undefined : "img"}
      aria-labelledby={!decorative ? titleId : undefined}
      aria-hidden={decorative ? "true" : "false"}
      className={twMerge(IconVariants({ size }), className)}
    />
  );
}
