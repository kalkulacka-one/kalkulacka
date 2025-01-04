import { cva, VariantProps } from "class-variance-authority";

const TitleVariants = cva(
  "k1-font-secondary, k1-font-bold, k1-tracking-tight",
  {
    variants: {
      variant: {
        large: "k1-text-3xl",
        medium: "k1-text-2xl",
      },
    },
  },
);

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof TitleVariants>;

// solve h1,h2,h3 problem ?

export default function Title({ children, variant }: Props) {
  return <span className={TitleVariants({ variant })}>{children}</span>;
}

{
  /* <h1 className="k1-font-secondary k1-text-3xl k1-font-bold k1-tracking-tight">
Title large
</h1>
<h1 className="k1-font-secondary k1-text-2xl k1-font-bold k1-tracking-tight">
Title medium
</h1> */
}
