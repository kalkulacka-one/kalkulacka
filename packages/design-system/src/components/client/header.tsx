import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type Header = {
  children?: React.ReactNode;
} & VariantProps<typeof HeaderVariants>;

const HeaderVariants = cva("ko:@container ko:sticky ko:top-0 ko:p-2 ko:sm:p-3 ko:bg-white/60 ko:backdrop-blur-md", {
  variants: {
    expanded: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

const HeaderGridVariants = cva("ko:grid ko:grid-cols-[auto_1fr_auto] ko:items-center ko:gap-x-2 ko:sm:gap-x-3 ko:gap-y-1", {
  variants: {
    expanded: {
      true: "ko:grid-rows-[3rem_auto]",
      false: "ko:grid-rows-[3rem]",
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

export function Header({ children, expanded }: Header) {
  return (
    <header className={twMerge(HeaderVariants({ expanded }))}>
      <div className={twMerge(HeaderGridVariants({ expanded }))}>{children}</div>
    </header>
  );
}

export type HeaderMain = {
  children?: React.ReactNode;
} & VariantProps<typeof HeaderMainVariants>;

const HeaderMainVariants = cva("ko:grid ko:grid-flow-col ko:grid-cols-[auto_1fr] ko:gap-2", {
  variants: {
    expanded: {
      true: "ko:col-span-2",
      false: "",
    },
    hasBottomLeftContent: {
      true: "",
      false: "ko:col-span-2",
    },
    condensed: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      condensed: true,
      hasBottomLeftContent: true,
      class: "ko:col-start-2",
    },
  ],
  defaultVariants: {
    expanded: false,
    hasBottomLeftContent: false,
    condensed: false,
  },
});

export function HeaderMain({ children, expanded, hasBottomLeftContent, condensed }: HeaderMain) {
  return <div className={twMerge(HeaderMainVariants({ expanded, hasBottomLeftContent, condensed }))}>{children}</div>;
}

export type HeaderRight = {
  children?: React.ReactNode;
};

export function HeaderRight({ children }: HeaderRight) {
  return <div>{children}</div>;
}

export type HeaderBottom = {
  children?: React.ReactNode;
} & VariantProps<typeof HeaderBottomVariants>;

const HeaderBottomVariants = cva("", {
  variants: {
    expanded: {
      true: "ko:col-span-3 ko:flex ko:items-center ko:h-full",
      false: "ko:row-start-1",
    },
    condensed: {
      true: "",
      false: "",
    },
    hasBottomLeftContent: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    expanded: false,
    condensed: false,
    hasBottomLeftContent: false,
  },
});

export function HeaderBottom({ children, expanded, condensed, hasBottomLeftContent }: HeaderBottom) {
  if (!expanded && !(condensed && hasBottomLeftContent)) {
    return null;
  }

  return <div className={twMerge(HeaderBottomVariants({ expanded, condensed, hasBottomLeftContent }))}>{children}</div>;
}

export type HeaderBottomLeft = {
  children?: React.ReactNode;
} & VariantProps<typeof HeaderBottomLeftVariants>;

const HeaderBottomLeftVariants = cva("", {
  variants: {
    condensed: {
      true: "ko:row-start-1 ko:col-start-1 ko:grid ko:grid-flow-col ko:items-center ko:gap-1",
      false: "",
    },
  },
  defaultVariants: {
    condensed: false,
  },
});

export function HeaderBottomLeft({ children, condensed }: HeaderBottomLeft) {
  return <div className={twMerge(HeaderBottomLeftVariants({ condensed }))}>{children}</div>;
}

export type HeaderBottomMain = {
  children?: React.ReactNode;
} & VariantProps<typeof HeaderBottomMainVariants>;

const HeaderBottomMainVariants = cva("", {
  variants: {
    condensed: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    condensed: false,
  },
});

export function HeaderBottomMain({ children, condensed }: HeaderBottomMain) {
  if (condensed) {
    return null;
  }
  return <div className={twMerge(HeaderBottomMainVariants({ condensed }))}>{children}</div>;
}

Header.Main = HeaderMain;
Header.Right = HeaderRight;
Header.Bottom = HeaderBottom;
Header.BottomLeft = HeaderBottomLeft;
Header.BottomMain = HeaderBottomMain;
