import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type Card = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof CardVariants>;

const CardVariants = cva("ko:rounded-3xl", {
  variants: {
    color: {
      white: "ko:bg-white",
      transparent: "ko:bg-transparent",
    },
    corner: { topRight: "ko:rounded-tr-none", topLeft: "ko:rounded-tl-none", bottomRight: "ko:rounded-br-none", bottomLeft: "ko:rounded-bl-none" },
    border: {
      true: "ko:border border-slate-200",
      false: "",
    },
    shadow: {
      elevated: "ko:drop-shadow-2xl shadow-slate-200",
      hard: "ko:shadow-[6px_6px_0px_#f1f5f9]",
      false: "",
    },
  },
  defaultVariants: {
    color: "white",
    corner: "topLeft",
    border: false,
    shadow: true,
  },
});

export function Card({ children, color, corner, border, shadow, className }: Card) {
  return <div className={twMerge(CardVariants({ color, corner, border, shadow }), className)}>{children}</div>;
}
