import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  return <div className="ko:min-h-screen ko:grid ko:grid-rows-[auto_1fr_auto]">{children}</div>;
}

LayoutComponent.displayName = "Layout";

export type LayoutHeader = {
  children: React.ReactNode;
} & VariantProps<typeof LayoutHeaderVariants>;

const LayoutHeaderVariants = cva("ko:top-0 ko:z-50", {
  variants: {
    fixed: {
      true: "ko:fixed ko:left-0 ko:w-full",
      false: "ko:sticky",
    },
  },
  defaultVariants: {
    fixed: false,
  },
});

function Header({ children, fixed }: LayoutHeader) {
  return <div className={LayoutHeaderVariants({ fixed })}>{children}</div>;
}

Header.displayName = "Layout.Header";

export type LayoutContent = {
  children: React.ReactNode;
} & VariantProps<typeof LayoutContentVariants>;

const LayoutContentVariants = cva("ko:mx-auto ko:p-2 ko:sm:p-4", {
  variants: {
    fullWidth: {
      true: "ko:w-full",
      false: "ko:max-w-xl ko:w-full",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

function Content({ children, fullWidth }: LayoutContent) {
  return <main className={LayoutContentVariants({ fullWidth })}>{children}</main>;
}

Content.displayName = "Layout.Content";

export type LayoutBottomNavigation = {
  children: React.ReactNode;
  className?: string;
};

function BottomNavigation({ children, className }: LayoutBottomNavigation) {
  return <div className={twMerge("ko:fixed ko:bottom-0 ko:left-0 ko:right-0 ko:pointer-events-none ko:z-20", className)}>{children}</div>;
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  if (!children) {
    return null;
  }
  return <footer className="ko:grid ko:justify-items-center ko:fixed ko:bottom-0 ko:left-0 ko:right-0 ko:z-5 ko:mt-2 ko:sm:mt-3 ko:lg:mt-4 ko:p-1">{children}</footer>;
}

Footer.displayName = "Layout.Footer";

export type LayoutBottomSpacer = {
  className?: string;
};

function BottomSpacer({ className }: LayoutBottomSpacer) {
  return <div className={className} aria-hidden="true" />;
}

BottomSpacer.displayName = "Layout.BottomSpacer";

type LayoutCompound = React.FC<Layout> & {
  Header: React.FC<LayoutHeader>;
  Content: React.FC<LayoutContent>;
  BottomNavigation: React.FC<LayoutBottomNavigation>;
  Footer: React.FC<LayoutFooter>;
  BottomSpacer: React.FC<LayoutBottomSpacer>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Content,
  BottomNavigation,
  Footer,
  BottomSpacer,
}) satisfies LayoutCompound;
