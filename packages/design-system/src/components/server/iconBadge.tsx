import { cva, type VariantProps } from "class-variance-authority";

export type IconBadge = {
  children: React.ReactNode;
} & VariantProps<typeof IconBadgeVariants>;

const IconBadgeVariants = cva("ko:rounded-full ko:p-2 ko:w-fit", {
  variants: {
    color: {
      primary: "ko:text-primary ko:bg-primary/10",
      secondary: "ko:text-secondary ko:bg-secondary/10",
      neutral: "ko:text-neutral ko:bg-neutral/10",
    },
  },

  defaultVariants: {
    color: "primary",
  },
});

export function IconBadge({ children, color }: IconBadge) {
  return <div className={IconBadgeVariants({ color })}>{children}</div>;
}
