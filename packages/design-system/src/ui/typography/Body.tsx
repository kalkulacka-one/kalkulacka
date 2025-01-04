import { cva, VariantProps } from "class-variance-authority";

const BodyVariants = cva("k1-font-primary, k1-font-bold, k1-tracking-tighter", {
  variants: {
    variant: {
      large: "k1-text-xl k1-tracking-tight",
      medium: "k1-text-base",
      small: "k1-text-sm",
      extraSmall: "k1-text-xs k1-tracking-tighter",
    },
  },
});

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof BodyVariants>;

export default function Body({ children, variant }: Props) {
  return <p className={BodyVariants({ variant })}>{children}</p>;
}
