import { cva, VariantProps } from "class-variance-authority";

const HeadlineVariants = cva(
  "k1-font-secondary k1-font-bold k1-tracking-tighter",
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

type HeadingType = "h1" | "h2" | "h3";

type Props = {
  children: React.ReactNode;
  type: HeadingType;
} & VariantProps<typeof HeadlineVariants>;

export function Headline({ children, variant, type }: Props) {
  switch (type) {
    case "h1": {
      return <h1 className={HeadlineVariants({ variant })}>{children}</h1>;
    }
    case "h2": {
      return <h2 className={HeadlineVariants({ variant })}>{children}</h2>;
    }

    case "h3": {
      return <h3 className={HeadlineVariants({ variant })}>{children}</h3>;
    }
  }
}
