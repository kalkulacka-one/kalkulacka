import { cva, type VariantProps } from "class-variance-authority";

export type IconBadge = {
  children?: React.ReactNode;
} & VariantProps<typeof IconBadgeVariants>;

const IconBadgeVariants = cva("ko:rounded-full", {
  variants: {
    color: {
      primary: "",
      secondary: "",
      neutral: "",
    },
    variant: {
      tint: "",
      solid: "",
      dashed: "ko:border ko:border-dashed ko:border-border",
    },
    size: {
      medium: "ko:p-2 ko:w-fit",
      small: "ko:inline-flex ko:size-6 ko:shrink-0 ko:items-center ko:justify-center ko:[&>svg]:size-3 ko:[&>svg]:min-w-3",
    },
  },
  compoundVariants: [
    { variant: "tint", color: "primary", class: "ko:text-primary ko:bg-primary/10" },
    { variant: "tint", color: "secondary", class: "ko:text-secondary ko:bg-secondary/10" },
    { variant: "tint", color: "neutral", class: "ko:text-neutral ko:bg-neutral/10" },
    { variant: "solid", color: "primary", class: "ko:bg-primary ko:text-on-bg-primary" },
    { variant: "solid", color: "secondary", class: "ko:bg-secondary ko:text-on-bg-secondary" },
    { variant: "solid", color: "neutral", class: "ko:bg-surface-sunken ko:text-text-muted" },
  ],
  defaultVariants: {
    color: "primary",
    variant: "tint",
    size: "medium",
  },
});

export function IconBadge({ children, color, variant, size }: IconBadge) {
  return <div className={IconBadgeVariants({ color, variant, size })}>{children}</div>;
}
