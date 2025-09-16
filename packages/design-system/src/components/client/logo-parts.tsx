import { calculatorLogoCheck, calculatorLogoCross, calculatorLogoPercent, calculatorLogoPercentDenominator, calculatorLogoPercentSlash, calculatorLogoSlash } from "@repo/design-system/icons";
import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Icon } from "./icon";

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
  return (
    <Icon
      icon={calculatorLogoCheck}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 78 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-check", LogoPartVariants({ size }), className)}
    />
  );
}

// Slash component (/)
export function LogoSlash({ title = "Slash", size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoSlash}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-slash", LogoPartVariants({ size }), className)}
    />
  );
}

// Cross component (×)
export function LogoCross({ title = "Cross", size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoCross}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-cross", LogoPartVariants({ size }), className)}
    />
  );
}

// Percent symbol component (%) - composed of Icon components for consistency
export function LogoPercent({ title = "Percent", size, className }: LogoPartProps) {
  return (
    <div role="img" aria-label={title} className={twMerge("ko:relative ko:inline-block ko:h-[4em] ko:w-[4em] ko:shrink-0 ko:align-bottom", LogoPartVariants({ size }), className)}>
      <Icon
        icon={calculatorLogoPercent}
        title="Percent numerator"
        decorative={true}
        size="custom"
        viewBox="0 0 64 64"
        className="ko:absolute ko:inset-0 ko:w-full ko:h-full ko:text-logo-percent-numerator"
      />
      <Icon
        icon={calculatorLogoPercentSlash}
        title="Percent slash"
        decorative={true}
        size="custom"
        viewBox="0 0 64 64"
        className="ko:absolute ko:inset-0 ko:w-full ko:h-full ko:text-logo-percent-slash"
      />
      <Icon
        icon={calculatorLogoPercentDenominator}
        title="Percent denominator"
        decorative={true}
        size="custom"
        viewBox="0 0 64 64"
        className="ko:absolute ko:inset-0 ko:w-full ko:h-full ko:text-logo-percent-denominator"
      />
    </div>
  );
}

// Individual percent parts for more granular control
export function LogoPercentNumerator({ title = "Percent numerator", size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercent}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 20 20"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-numerator", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoPercentSlash({ title = "Percent slash", size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercentSlash}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-slash", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoPercentDenominator({ title = "Percent denominator", size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercent}
      title={title}
      decorative={false}
      size="custom"
      viewBox="0 0 20 20"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-denominator", LogoPartVariants({ size }), className)}
    />
  );
}
