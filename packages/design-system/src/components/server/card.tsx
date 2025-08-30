import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type Card = {
  children: React.ReactNode;
} & VariantProps<typeof CardVariants>;

const CardVariants = cva("ko:rounded-lg", {
  variants: {
    color: {
      white: "ko:bg-white",
      transparent: "ko:bg-transparent",
    },
    corner: { topRight: "ko:rounded-tr-none", topLeft: "ko:rounded-tl-none", bottomRight: "ko:rounded-br-none", bottomLeft: "ko:rounded-bl-none" },
    border: {
      true: "ko:border ko:border-neutral",
      false: "",
    },
    shadow: {
      true: "ko:shadow-md",
      false: "",
    },
  },
  defaultVariants: {
    color: "white",
    border: true,
    corner: "bottomRight",
    shadow: true,
  },
});

export function Card({ children, color, corner, border, shadow }: Card) {
  return <div className={twMerge(CardVariants({ color, corner, border, shadow }))}>{children}</div>;
}
