import { cva, VariantProps } from "class-variance-authority";

const ButtonTextVariants = cva(
  "k1-font-secondary, k1-font-bold, k1-uppercase k1-tracking-wider",
  {
    variants: {
      variant: {
        small: "k1-text-sm",
        extraSmall: "k1-text-xs",
      },
    },
  },
);

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof ButtonTextVariants>;

export default function ButtonText({ children, variant }: Props) {
  return <span className={ButtonTextVariants({ variant })}>{children}</span>;
}

// <span className="k1-font-secondary k1-text-sm k1-font-bold k1-uppercase k1-tracking-wider">
// Button text
// </span>

// <span className="k1-font-secondary k1-text-xs k1-font-bold k1-uppercase k1-tracking-wider">
// Small button text (radio canada).
// </span>
