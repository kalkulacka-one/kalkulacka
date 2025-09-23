import { Logo } from "@repo/design-system/client";
import { twMerge } from "@repo/design-system/utils";
import type { ReactNode } from "react";
import React from "react";

import { useEmbed } from "../../../components/client";
import type { CalculatorViewModel } from "../../view-models";

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
  fixed?: boolean;
};

export function AppHeader({ children, condensed = false, calculator, fixed = false }: AppHeaderProps) {
  const embed = useEmbed();
  const hasPageHeading = hasChildOfType(children, AppHeaderBottom);
  const hasBottomLeft = hasNestedChildOfType(children, AppHeaderBottom, AppHeaderBottomLeft);
  const expand = hasPageHeading && !condensed;

  const gridClasses = "grid grid-cols-[auto_1fr_auto] items-center";
  const expandedRowsClasses = "grid-rows-[3rem_auto]";
  const collapsedRowsClasses = "grid-rows-[3rem]";
  const gridSpacingClasses = "gap-x-2 sm:gap-x-3 gap-y-1";
  const headerGridClasses = twMerge(gridClasses, expand ? expandedRowsClasses : collapsedRowsClasses, gridSpacingClasses);

  const mainGrid = "grid grid-flow-col grid-cols-[auto_1fr] gap-2";
  const mainExpandedOrNoLeftContent = expand || !hasBottomLeft ? "col-span-2" : "";
  const mainCondensedWithLeftContent = condensed && hasBottomLeft ? "col-start-2" : "";
  const mainClasses = twMerge(mainGrid, mainExpandedOrNoLeftContent, mainCondensedWithLeftContent);

  const bottomExpanded = "col-span-3 flex items-center h-full";
  const bottomCondensed = "row-start-1";
  const bottomClasses = expand ? bottomExpanded : bottomCondensed;

  return (
    <header className={`@container ${fixed ? "fixed top-0 left-0 right-0 z-50" : "sticky top-0"} p-2 sm:p-3 bg-white/60 backdrop-blur-md`}>
      <div className={headerGridClasses}>
        <div className={mainClasses}>
          <AppHeaderMain title="Volební kalkulačka" calculator={calculator} logoMonochrome={embed.isEmbed && embed.config?.logo === "monochrome"} />
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
    <div className="grid grid-flow-col items-center gap-2">
      <Logo title={title} size="small" monochrome={logoMonochrome} />
      <div className="grid text-sm text-slate-700 leading-none">
        <h1 className="font-light">{title}</h1>
        <div>
          <h2 className="font-semibold inline">{calculator?.title}</h2>
          {calculator?.title && calculator?.secondaryTitle && <span className="font-light hidden @[24rem]:inline"> • </span>}
          <span className="font-light hidden @[24rem]:inline">{calculator?.secondaryTitle}</span>
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
  return <div className="grid grid-flow-col items-center gap-2">{children}</div>;
}

export type AppHeaderBottomLeft = {
  children: ReactNode;
  condensed?: boolean;
};

export function AppHeaderBottomLeft({ children, condensed }: AppHeaderBottomLeft) {
  if (condensed) {
    return <div className="row-start-1 col-start-1 grid grid-flow-col items-center gap-1">{children}</div>;
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
