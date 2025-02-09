import { cva, VariantProps } from "class-variance-authority";

const ButtonTextVariants = cva(
  "k1-font-secondary k1-font-bold k1-uppercase k1-tracking-wider",
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

export function ButtonText({ children, variant }: Props) {
  return <span className={ButtonTextVariants({ variant })}>{children}</span>;
}
