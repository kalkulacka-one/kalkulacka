import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type Pill = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof PillVariants>;

const PillVariants = cva("ko:inline-flex ko:items-center ko:whitespace-nowrap ko:font-semibold ko:uppercase ko:tracking-wider", {
  variants: {
    size: {
      small: "ko:text-xs ko:px-2 ko:py-0.5",
      medium: "ko:text-sm ko:px-3 ko:py-1",
      large: "ko:text-base ko:px-4 ko:py-1.5",
    },
    variant: {
      subtle: "ko:bg-card-border ko:text-neutral",
      solid: "ko:bg-neutral ko:text-white",
      outline: "ko:border ko:border-card-border ko:text-neutral ko:bg-transparent",
    },
    rounded: {
      sm: "ko:rounded",
      md: "ko:rounded-md",
      lg: "ko:rounded-lg",
      full: "ko:rounded-full",
    },
  },
  defaultVariants: {
    size: "medium",
    variant: "subtle",
    rounded: "md",
  },
});

export function Pill({ children, className, size, variant, rounded }: Pill) {
  return <span className={twMerge(PillVariants({ size, variant, rounded }), className)}>{children}</span>;
}
