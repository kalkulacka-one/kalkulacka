import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";

export type Card = {
  children: React.ReactNode;
} & VariantProps<typeof CardVariants>;

const CardVariants = cva("", {
  variants: {
    color: {
      white: "ko:bg-white",
      transparent: "ko:bg-transparent",
    },
    corner: { topRight: "ko:rounded-l ko:rounded-br", topLeft: "ko:rounded-r ko:rounded-bl", bottomRight: "ko:rounded-t ko:rounded-bl", bottomLeft: "ko:rounded-t ko:rounded-br" },
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
