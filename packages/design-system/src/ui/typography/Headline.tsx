import { cva, VariantProps } from "class-variance-authority";

const HeadlineVariants = cva(
  "k1-font-secondary, k1-font-bold, k1-tracking-tighter",
  {
    variants: {
      variant: {
        large: "k1-text-6xl",
        medium: "k1-text-5xl",
        small: "k1-text-4xl",
      },
    },
  },
);

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof HeadlineVariants>;

// TODO: solve h1,h2,h3 problem

export default function Headline({ children, variant }: Props) {
  return <h1 className={HeadlineVariants({ variant })}>{children}</h1>;
}

{
  /* <h1 className="k1-font-secondary k1-text-6xl k1-font-bold k1-tracking-tighter">
Headline large
</h1>
<h2 className="k1-font-secondary k1-text-5xl k1-font-bold k1-tracking-tighter">
Headline medium
</h2>
<h3 className="k1-font-secondary k1-text-4xl k1-font-bold k1-tracking-tighter">
Headline small
</h3> */
}
