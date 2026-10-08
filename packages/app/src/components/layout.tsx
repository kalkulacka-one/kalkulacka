import React from "react";

import { twMerge } from "@/utilities/tailwind";

export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  const items = React.Children.toArray(children);
  const isSlot = (type: React.ElementType) => (child: React.ReactNode) => React.isValidElement(child) && child.type === type;
  const header = items.filter(isSlot(Header));
  const footer = items.filter(isSlot(Footer));
  const body = items.filter((child) => !isSlot(Header)(child) && !isSlot(Footer)(child));
  // Mobile (< sm) is a grid: Content stretches to fill the viewport, so BottomNavigation sits at the screen's bottom
  // edge on short pages. sm and up switch to a plain column flow: Content sizes to its own content and
  // BottomNavigation follows it. On every breakpoint BottomNavigation sticks to the viewport bottom once the page is
  // taller than the screen.
  //
  // Embeds (styles.css, html[data-embed]) turn this into a frame-tall shell instead: the header stays on top, the body
  // scrolls in its own region below it, and the footer is always visible at the bottom. Outside embeds the body
  // wrapper is `display: contents`, so the layout above is unchanged.
  return (
    <div data-layout className="koa:min-h-dvh koa:grid koa:grid-rows-[auto_1fr_auto] koa:sm:flex koa:sm:flex-col">
      {header}
      <div data-layout-body className="koa:contents">
        {body}
      </div>
      {footer}
    </div>
  );
}

LayoutComponent.displayName = "Layout";

export type LayoutHeader = {
  children: React.ReactNode;
  fixed?: boolean;
};

function Header({ children, fixed }: LayoutHeader) {
  return <div className={` ${fixed ? "koa:fixed koa:left-0 koa:w-full" : "koa:sticky"} koa:top-0 koa:z-50`}>{children}</div>;
}

Header.displayName = "Layout.Header";

export type LayoutContent = {
  children: React.ReactNode;
  fullWidth?: boolean;
  fixed?: boolean;
  // Lets a screen's own column take the space left below the header, so it can anchor its content to the bottom.
  fill?: boolean;
};

function Content({ children, fullWidth, fill }: LayoutContent) {
  return (
    <main className={`${fullWidth ? "koa:w-full" : "koa:max-w-xl koa:w-full"} ${fill ? "koa:flex koa:flex-col koa:sm:flex-1" : ""} koa:mx-auto koa:px-gutter koa:py-2 koa:sm:py-4`}>{children}</main>
  );
}

Content.displayName = "Layout.Content";

export type LayoutBottomNavigation = {
  children: React.ReactNode;
  className?: string;
};

function BottomNavigation({ children, className }: LayoutBottomNavigation) {
  // Sticky in the document flow at every breakpoint now, never docked with `fixed`: iOS Safari clips
  // fixed-positioned content above its bottom glass bar, so the nav has to be real content the page can
  // scroll to, not an overlay. Short pages keep it right under the content; long ones let it stick to the
  // viewport bottom (with a small gap so it clears the glass bar) while the rest scrolls underneath.
  return <div className={twMerge("koa:sticky koa:bottom-4 koa:z-20", className)}>{children}</div>;
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  if (!children) {
    return null;
  }
  // In the document flow as the layout's last child, never `fixed`: embeds are usually shorter than the page
  // (partners use a 600px iframe), and an overlay docked to the frame's bottom covered cards and buttons there.
  // `mt-auto` pushes it to the bottom of short pages (in the mobile grid's last row and the sm+ column alike);
  // on long pages it follows the content, and a sticky BottomNavigation stops right above it.
  return <footer className="koa:grid koa:justify-items-center koa:mt-auto koa:p-1 koa:pt-2 koa:sm:pt-3 koa:lg:pt-4">{children}</footer>;
}

Footer.displayName = "Layout.Footer";

type LayoutCompound = React.FC<Layout> & {
  Header: React.FC<LayoutHeader>;
  Content: React.FC<LayoutContent>;
  BottomNavigation: React.FC<LayoutBottomNavigation>;
  Footer: React.FC<LayoutFooter>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Content,
  BottomNavigation,
  Footer,
}) satisfies LayoutCompound;
