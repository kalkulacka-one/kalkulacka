import { cva, type VariantProps } from "class-variance-authority";

import { twMerge } from "../../utilities";

export type Badge = {
  children: React.ReactNode;
} & VariantProps<typeof BadgeVariants>;

const BadgeVariants = cva("ko:flex ko:gap-1.5 ko:items-center ko:px-1.5 ko:border ko:w-fit ko:rounded-sm ko:text-xs ko:[&>svg]:opacity-70", {
  variants: {
    color: {
      primary: "ko:bg-primary/8 ko:text-primary ko:border-transparent",
      secondary: "ko:bg-secondary/8 ko:text-secondary ko:border-transparent",
      yellow: "ko:bg-yellow/8 ko:text-yellow ko:border-transparent",
      green: "ko:bg-green/8 ko:text-green ko:border-transparent",
      neutral: "ko:bg-neutral/8 ko:text-neutral ko:border-transparent",
      transparent: "ko:border ko:text-neutral ko:border-neutral/10",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
export function Badge({ children, color }: Badge) {
  return <div className={twMerge(BadgeVariants({ color }))}>{children}</div>;
}
