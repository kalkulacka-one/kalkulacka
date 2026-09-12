// Ported from kalkulacka-2026/packages/ui/src/chip/chip.tsx and chip.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type Chip = {
  children: React.ReactNode;
} & VariantProps<typeof ChipVariants>;

export const ChipVariants = cva(
  ["ko:inline-flex ko:items-center", "ko:px-[0.8125rem] ko:py-[0.4375rem] ko:rounded-chip", "ko:font-sans ko:text-fluid-chip ko:font-medium ko:leading-[1.2] ko:text-text"],
  {
    variants: {
      variant: {
        /** The topic — a filled, recessed chip. */
        filled: "ko:bg-surface-sunken",
        /** The question's short name — outlined against the card. */
        outline: "ko:bg-surface ko:shadow-[inset_0_0_0_1px_var(--ko-color-border)]",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

export function Chip({ children, variant }: Chip) {
  return <span className={twMerge(ChipVariants({ variant }))}>{children}</span>;
}
