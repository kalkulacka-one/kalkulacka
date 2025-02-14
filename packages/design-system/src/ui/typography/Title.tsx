import { cva, VariantProps } from "class-variance-authority";

const TitleVariants = cva("k1-font-secondary k1-font-bold k1-tracking-tight", {
  variants: {
    variant: {
      large: "k1-text-3xl",
      medium: "k1-text-2xl",
    },
  },
});

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof TitleVariants>;

export function Title({ children, variant }: Props) {
  return <span className={TitleVariants({ variant })}>{children}</span>;
}
