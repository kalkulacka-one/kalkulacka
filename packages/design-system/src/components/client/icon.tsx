import type { IconDefinition } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";

export type Icon = {
  icon:
    | string
    | IconDefinition
    | React.FunctionComponent<
        {
          title?: string;
          titleId?: string;
          decorative?: boolean;
        } & React.SVGProps<SVGSVGElement>
      >;
  /** Fill a stroked definition as well as outlining it — used by the active "important" star. */
  filled?: boolean;
  isIcon?: true;
} & VariantProps<typeof IconVariants> &
  React.SVGProps<SVGSVGElement> &
  ({ title: string; decorative: false } | { title?: string; decorative: true });

// TODO: Update after spacing & sizing is finalized.
const IconVariants = cva("", {
  variants: {
    size: {
      xsmall: "ko:size-3.5 ko:min-w-3.5",

      small: "ko:size-4 ko:min-w-4",

      regular: "ko:size-5 ko:min-w-5",

      medium: "ko:size-6 ko:min-w-6",

      large: "ko:size-8 ko:min-w-8",
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export function Icon({ icon, size, title, decorative, filled = false, isIcon = true, className, ...props }: Icon) {
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

  if (typeof icon === "object") {
    const stroked = icon.mode === "stroke";

    return (
      <svg
        {...domProps}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={decorative ? "true" : "false"}
        aria-labelledby={!decorative ? titleId : undefined}
        focusable="false"
        role={decorative ? undefined : "img"}
        className={twMerge(IconVariants({ size }), className)}
        viewBox={icon.viewBox}
        fill={stroked && !filled ? "none" : "currentColor"}
        stroke={stroked ? "currentColor" : undefined}
        strokeWidth={stroked ? icon.strokeWidth : undefined}
        strokeLinejoin={stroked ? icon.strokeLinejoin : undefined}
        strokeLinecap={stroked ? icon.strokeLinecap : undefined}
      >
        {!decorative && title && <title id={titleId}>{title}</title>}
        {icon.paths.map((d) => (
          <path key={d} d={d} />
        ))}
        {/* Dots are solid regardless of the icon's mode — they're the thin set's
            one filled element, so they opt out of the stroke attributes above. */}
        {icon.dots?.map(([cx, cy, r]) => (
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
        ))}
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
