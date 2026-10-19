import { Logo } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import React, { useLayoutEffect, useState } from "react";

import { useEmbed } from "@/client/embeds";
import { twMerge } from "@/utilities/tailwind";
import type { CalculatorViewModel } from "@/view-models/calculator";

const hasChildOfType = (children: ReactNode, type: React.ElementType) => React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === type);

const hasNestedChildOfType = (children: ReactNode, parentType: React.ElementType, childType: React.ElementType) =>
  React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && child.type === parentType) {
      const childProps = child.props as { children?: ReactNode };
      return hasChildOfType(childProps.children, childType);
    }
    return false;
  });

type AppHeaderChildProps = {
  condensed?: boolean;
};

type AppHeaderProps = {
  children?: ReactNode;
  condensed?: boolean;
  calculator?: CalculatorViewModel;
  heading?: { title: string; secondaryTitle?: string };
};

// Tracks whether the page has actually scrolled (a few px of hysteresis so it doesn't flicker at the very top),
// independent of any screen's own condense-on-scroll wiring — several screens (intro, review) use `AppHeader`
// without `WithCondenseOnScroll` at all, so the fade below has to work on its own.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useLayoutEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

export function AppHeader({ children, condensed = false, calculator, heading }: AppHeaderProps) {
  const t = useTranslations("koa");
  const embed = useEmbed();
  const scrolled = useScrolled();
  const hasPageHeading = hasChildOfType(children, AppHeaderBottom);
  const hasBottomLeft = hasNestedChildOfType(children, AppHeaderBottom, AppHeaderBottomLeft);
  const expand = hasPageHeading && !condensed;

  const gridClasses = "koa:grid koa:grid-cols-[auto_minmax(0,1fr)_auto] koa:items-center";
  const expandedRowsClasses = "koa:grid-rows-[3rem_auto]";
  const collapsedRowsClasses = "koa:grid-rows-[3rem]";
  const gridSpacingClasses = "koa:gap-x-2 koa:sm:gap-x-3 koa:gap-y-2 koa:sm:gap-y-3";
  const headerGridClasses = twMerge(gridClasses, expand ? expandedRowsClasses : collapsedRowsClasses, gridSpacingClasses);

  const mainGrid = "koa:grid koa:grid-flow-col koa:grid-cols-[auto_minmax(0,1fr)] koa:gap-2 koa:min-w-0";
  const mainExpandedOrNoLeftContent = expand || !hasBottomLeft ? "koa:col-span-2" : "";
  const mainCondensedWithLeftContent = condensed && hasBottomLeft ? "koa:col-start-2" : "";
  const mainClasses = twMerge(mainGrid, mainExpandedOrNoLeftContent, mainCondensedWithLeftContent);

  const bottomExpanded = "koa:col-span-3 koa:flex koa:items-center koa:h-full";
  const bottomCondensed = "koa:row-start-1";
  const bottomClasses = expand ? bottomExpanded : bottomCondensed;

  // Two layers, its own stacking context via `isolate` so `-z-10` stays behind just this header's own content:
  // `before:` is the header's own box in solid page colour, so the wordmark never collides with content
  // scrolling underneath. At rest nothing sits under the header, and a solid band would show against the page
  // backdrop's glow, so it appears together with the tail once `useScrolled` reports real movement.
  // `after:` is the soft page-colour tail below the box, like 2026's bar — but unlike 2026 it is not needed at
  // rest (nothing scrolls under a header that is already opaque), so it stays invisible until `useScrolled`
  // confirms the page has actually moved, then fades in. That keeps the intro/review screens' content (which
  // never wire up condense-on-scroll) from reading dimmed on first paint.
  const headerBoxClasses =
    "koa:@container koa:sticky koa:top-0 koa:isolate koa:before:content-[''] koa:before:pointer-events-none koa:before:absolute koa:before:inset-0 koa:before:-z-10 koa:before:bg-page koa:before:transition-opacity koa:before:duration-base koa:after:content-[''] koa:after:pointer-events-none koa:after:absolute koa:after:inset-x-0 koa:after:top-full koa:after:-z-10 koa:after:h-[var(--ko-spacing-fade-edge)] koa:after:bg-[image:var(--ko-fade-to-top)] koa:after:transition-opacity koa:after:duration-base koa:after:ease-out";
  const headerClasses = twMerge(headerBoxClasses, scrolled ? "koa:before:opacity-100 koa:after:opacity-100" : "koa:before:opacity-0 koa:after:opacity-0");

  return (
    <header className={headerClasses}>
      <div className="koa:w-full koa:px-gutter koa:py-2 koa:sm:py-3">
        <div className={headerGridClasses}>
          <div className={mainClasses}>
            <AppHeaderMain title={t("appTitle")} heading={heading ?? calculator} logoMonochrome={embed.isEmbed && embed.config?.logo === "monochrome"} />
          </div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === AppHeaderRight) {
              return (child.props as { children: ReactNode }).children;
            }
            return null;
          })}
          {(expand || (condensed && hasBottomLeft)) && (
            <div className={bottomClasses}>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type !== AppHeaderMain && child.type !== AppHeaderRight) {
                  return React.cloneElement(child as React.ReactElement<AppHeaderChildProps>, {
                    ...(child.props || {}),
                    condensed,
                  });
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

type AppHeaderLeft = {
  children?: ReactNode;
};

export function AppHeaderLeft({ children }: AppHeaderLeft) {
  return <>{children}</>;
}

type AppHeaderMain = {
  children?: ReactNode;
  title: string;
  heading?: { title: string; secondaryTitle?: string };
  logoMonochrome?: boolean;
};

function AppHeaderMain({ children, title, heading, logoMonochrome }: AppHeaderMain) {
  return (
    <div className="koa:grid koa:grid-flow-col koa:items-center koa:gap-[0.875rem] koa:min-w-0">
      <Logo title={title} size="xsmall" monochrome={logoMonochrome} />
      <div className="koa:grid koa:gap-0.5 koa:leading-none koa:min-w-0">
        <h1 className="koa:font-display koa:text-[11px] koa:leading-[1.2] koa:tracking-[-0.03em] koa:font-bold koa:text-text koa:truncate">{title}</h1>
        <div className="koa:font-display koa:text-[11px] koa:leading-[1.2] koa:tracking-[-0.03em] koa:text-text-muted koa:truncate">
          <h2 className="koa:font-normal koa:inline">{heading?.title}</h2>
          {heading?.title && heading?.secondaryTitle && <span className="koa:font-normal koa:hidden koa:@[24rem]:inline"> • </span>}
          <span className="koa:font-normal koa:hidden koa:@[24rem]:inline">{heading?.secondaryTitle}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

type AppHeaderRight = {
  children: ReactNode;
};

export function AppHeaderRight({ children }: AppHeaderRight) {
  return <>{children}</>;
}

type AppHeaderBottom = {
  children: ReactNode;
};

export function AppHeaderBottom({ children }: AppHeaderBottom) {
  return <div className="koa:grid koa:grid-flow-col koa:items-center koa:gap-2">{children}</div>;
}

export type AppHeaderBottomLeft = {
  children: ReactNode;
  condensed?: boolean;
};

export function AppHeaderBottomLeft({ children, condensed }: AppHeaderBottomLeft) {
  if (condensed) {
    return <div className="koa:row-start-1 koa:col-start-1 koa:grid koa:grid-flow-col koa:items-center koa:gap-1">{children}</div>;
  }
  return <>{children}</>;
}

export type AppHeaderBottomMain = {
  children: ReactNode;
  condensed?: boolean;
};

export function AppHeaderBottomMain({ children, condensed }: AppHeaderBottomMain) {
  if (condensed) {
    return null;
  }
  return <>{children}</>;
}

AppHeader.Left = AppHeaderLeft;
AppHeader.Right = AppHeaderRight;
AppHeader.Bottom = AppHeaderBottom;
AppHeader.BottomLeft = AppHeaderBottomLeft;
AppHeader.BottomMain = AppHeaderBottomMain;
