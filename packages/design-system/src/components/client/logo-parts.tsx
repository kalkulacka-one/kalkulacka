import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";

// Base variants for all logo parts
const LogoPartVariants = cva("ko:inline-block", {
  variants: {
    size: {
      small: "ko:text-[0.25rem]",
      medium: "ko:text-[0.375rem]",
      large: "ko:text-[0.5rem]",
      default: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type LogoPartProps = {
  title?: string;
  className?: string;
} & VariantProps<typeof LogoPartVariants>;

// Check mark component (✓)
export function LogoCheck({ title = "Check", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 78 64"
    >
      <title id={titleId}>{title}</title>
      <path
        fill="currentColor"
        className="ko:text-logo-check"
        d="M65.9601 1.38557e-05L77.9054 11.964L37.9138 52.0168L25.9684 63.9807L0 37.9722L11.9454 26.0083L25.9684 40.053L65.9601 1.38557e-05Z"
      />
    </svg>
  );
}

// Slash component (/)
export function LogoSlash({ title = "Slash", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 64 64"
    >
      <title id={titleId}>{title}</title>
      <path 
        fill="currentColor" 
        className="ko:text-logo-slash" 
        d="M52 0L0 52.0167L11.9454 63.9807L63.8826 11.964L52 0Z" 
      />
    </svg>
  );
}

// Cross component (×)
export function LogoCross({ title = "Cross", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 64 64"
    >
      <title id={titleId}>{title}</title>
      <path
        fill="currentColor"
        className="ko:text-logo-cross"
        d="M51.9369 0.000134698L63.8823 11.9641L43.8863 31.9906L63.8823 52.0171L51.9369 63.981L31.9409 43.9544L11.9449 63.9809L0 52.0169L19.9959 31.9905L0 11.9639L11.9449 1.38557e-05L31.9409 20.0267L51.9369 0.000134698Z"
      />
    </svg>
  );
}

// Percent symbol component (%)
export function LogoPercent({ title = "Percent", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 64 64"
    >
      <title id={titleId}>{title}</title>
      <path
        fill="currentColor"
        className="ko:text-logo-percent-numerator"
        d="M19.0969 9.56323C19.0969 14.8449 14.8221 19.1265 9.54845 19.1265C4.27484 19.1265 0 14.8449 0 9.56323C0 4.28161 4.27484 1.38557e-05 9.54845 1.38557e-05C14.8221 1.38557e-05 19.0969 4.28161 19.0969 9.56323Z"
      />
      <path 
        fill="currentColor" 
        className="ko:text-logo-percent-slash" 
        d="M51.9369 1.38557e-05L0 52.0167L11.9454 63.9807L63.8823 11.964L51.9369 1.38557e-05Z" 
      />
      <path
        fill="currentColor"
        className="ko:text-logo-percent-denominator"
        d="M63.9009 54.4368C63.9009 59.7184 59.626 64 54.3524 64C49.0788 64 44.804 59.7184 44.804 54.4368C44.804 49.1552 49.0788 44.8736 54.3524 44.8736C59.626 44.8736 63.9009 49.1552 63.9009 54.4368Z"
      />
    </svg>
  );
}

// Individual percent parts for more granular control
export function LogoPercentNumerator({ title = "Percent numerator", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 20 20"
    >
      <title id={titleId}>{title}</title>
      <path
        fill="currentColor"
        className="ko:text-logo-percent-numerator"
        d="M19.0969 9.56323C19.0969 14.8449 14.8221 19.1265 9.54845 19.1265C4.27484 19.1265 0 14.8449 0 9.56323C0 4.28161 4.27484 1.38557e-05 9.54845 1.38557e-05C14.8221 1.38557e-05 19.0969 4.28161 19.0969 9.56323Z"
      />
    </svg>
  );
}

export function LogoPercentSlash({ title = "Percent slash", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 64 64"
    >
      <title id={titleId}>{title}</title>
      <path 
        fill="currentColor" 
        className="ko:text-logo-percent-slash" 
        d="M51.9369 1.38557e-05L0 52.0167L11.9454 63.9807L63.8823 11.964L51.9369 1.38557e-05Z" 
      />
    </svg>
  );
}

export function LogoPercentDenominator({ title = "Percent denominator", size, className }: LogoPartProps) {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
      focusable="false"
      role="img"
      className={twMerge("ko:h-[4em] ko:shrink-0", LogoPartVariants({ size }), className)}
      viewBox="0 0 20 20"
    >
      <title id={titleId}>{title}</title>
      <path
        fill="currentColor"
        className="ko:text-logo-percent-denominator"
        d="M19.0969 9.56323C19.0969 14.8449 14.8221 19.1265 9.54845 19.1265C4.27484 19.1265 0 14.8449 0 9.56323C0 4.28161 4.27484 1.38557e-05 9.54845 1.38557e-05C14.8221 1.38557e-05 19.0969 4.28161 19.0969 9.56323Z"
      />
    </svg>
  );
}
