import { Logo } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import React from "react";

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
};

export function AppHeader({ children, condensed = false, calculator }: AppHeaderProps) {
  const t = useTranslations("koa");
  const embed = useEmbed();
  const hasPageHeading = hasChildOfType(children, AppHeaderBottom);
  const hasBottomLeft = hasNestedChildOfType(children, AppHeaderBottom, AppHeaderBottomLeft);
  const expand = hasPageHeading && !condensed;

  const gridClasses = "koa:grid koa:grid-cols-[auto_1fr_auto] koa:items-center";
  const expandedRowsClasses = "koa:grid-rows-[3rem_auto]";
  const collapsedRowsClasses = "koa:grid-rows-[3rem]";
  const gridSpacingClasses = "koa:gap-x-2 koa:sm:gap-x-3 koa:gap-y-1";
  const headerGridClasses = twMerge(gridClasses, expand ? expandedRowsClasses : collapsedRowsClasses, gridSpacingClasses);

  const mainGrid = "koa:grid koa:grid-flow-col koa:grid-cols-[auto_1fr] koa:gap-2";
  const mainExpandedOrNoLeftContent = expand || !hasBottomLeft ? "koa:col-span-2" : "";
  const mainCondensedWithLeftContent = condensed && hasBottomLeft ? "koa:col-start-2" : "";
  const mainClasses = twMerge(mainGrid, mainExpandedOrNoLeftContent, mainCondensedWithLeftContent);

  const bottomExpanded = "koa:col-span-3 koa:flex koa:items-center koa:h-full";
  const bottomCondensed = "koa:row-start-1";
  const bottomClasses = expand ? bottomExpanded : bottomCondensed;

  return (
    <header className="koa:@container koa:sticky koa:top-0 koa:p-2 koa:sm:p-3 koa:bg-white/60 koa:backdrop-blur-md">
      <div className={headerGridClasses}>
        <div className={mainClasses}>
          <AppHeaderMain title={t("appTitle")} calculator={calculator} logoMonochrome={embed.isEmbed && embed.config?.logo === "monochrome"} />
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
  calculator?: CalculatorViewModel;
  logoMonochrome?: boolean;
};

function AppHeaderMain({ children, title, calculator, logoMonochrome }: AppHeaderMain) {
  return (
    <div className="koa:grid koa:grid-flow-col koa:items-center koa:gap-2">
      <Logo title={title} size="small" monochrome={logoMonochrome} />
      <div className="koa:grid koa:text-sm koa:text-slate-700 koa:leading-none">
        <h1 className="koa:font-light">{title}</h1>
        <div>
          <h2 className="koa:font-semibold koa:inline">{calculator?.title}</h2>
          {calculator?.title && calculator?.secondaryTitle && <span className="koa:font-light koa:hidden koa:@[24rem]:inline"> • </span>}
          <span className="koa:font-light koa:hidden koa:@[24rem]:inline">{calculator?.secondaryTitle}</span>
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
