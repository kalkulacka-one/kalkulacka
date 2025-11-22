import { twMerge } from "@kalkulacka-one/design-system/utilities";

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
      true: "ko:border ko:border-neutral",
      false: "",
    },
    shadow: {
      elevated: "ko:drop-shadow-2xl",
      hard: "ko:drop-shadow-hard",
      false: "",
    },
    interactive: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    color: "white",
    corner: "topLeft",
    border: false,
    shadow: true,
    interactive: false,
  },
});

export function Card({ children, color, corner, border, shadow, interactive, className }: Card) {
  return <div className={twMerge(CardVariants({ color, corner, border, shadow, interactive }), className)}>{children}</div>;
}
