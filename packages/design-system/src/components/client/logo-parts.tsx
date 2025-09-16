import { calculatorLogoCheck, calculatorLogoCross, calculatorLogoPercentDenominator, calculatorLogoPercentNumerator, calculatorLogoPercentSlash, calculatorLogoSlash } from "@repo/design-system/icons";
import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Icon } from "./icon";

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
  className?: string;
} & VariantProps<typeof LogoPartVariants>;

export function LogoCheck({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoCheck}
      title="Check"
      decorative={false}
      size="custom"
      viewBox="0 0 78 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-check", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoSlash({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoSlash}
      title="Slash"
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-slash", LogoPartVariants({ size }), className)}
    />
  );
}
export function LogoCross({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoCross}
      title="Cross"
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-cross", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoPercent({ size, className }: LogoPartProps) {
  return (
    <div role="img" aria-label="Percent" className={twMerge("ko:relative ko:inline-block ko:h-[4em] ko:w-[4em] ko:shrink-0 ko:align-bottom", LogoPartVariants({ size }), className)}>
      <Icon
        icon={calculatorLogoPercentNumerator}
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
export function LogoPercentNumerator({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercentNumerator}
      title="Percent numerator"
      decorative={false}
      size="custom"
      viewBox="0 0 20 20"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-numerator", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoPercentSlash({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercentSlash}
      title="Percent slash"
      decorative={false}
      size="custom"
      viewBox="0 0 64 64"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-slash", LogoPartVariants({ size }), className)}
    />
  );
}

export function LogoPercentDenominator({ size, className }: LogoPartProps) {
  return (
    <Icon
      icon={calculatorLogoPercentDenominator}
      title="Percent denominator"
      decorative={false}
      size="custom"
      viewBox="0 0 20 20"
      className={twMerge("ko:h-[4em] ko:shrink-0 ko:text-logo-percent-denominator", LogoPartVariants({ size }), className)}
    />
  );
}
