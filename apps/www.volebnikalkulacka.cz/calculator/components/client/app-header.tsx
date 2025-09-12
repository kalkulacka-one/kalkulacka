import { Logo } from "@repo/design-system/client";
import type { ReactNode } from "react";
import React from "react";

import { useEmbed } from "../../../components/client";
import type { CalculatorViewModel } from "../../view-models";

type AppHeaderChildProps = {
  condensed?: boolean;
};

type AppHeaderProps = {
  children: ReactNode;
  condensed?: boolean;
  logoTitle: string;
};

export function AppHeader({ children, condensed = false, logoTitle }: AppHeaderProps) {
  const embed = useEmbed();
  const hasPageHeading = React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === AppHeaderBottom);

  const expand = hasPageHeading && !condensed;
  const spanLogo = !hasPageHeading && !condensed;

  const headerStyles = {
    gridTemplateAreas: expand
      ? `"left logo main right"
         "bottom-left bottom-left bottom-main bottom-right"`
      : `"left logo main right"`,
    gridTemplateColumns: "max-content max-content 1fr max-content",
    gridTemplateRows: expand ? "auto 3.75rem" : "auto",
  };

  const logoStyles = {
    gridArea: !condensed ? "left" : "logo",
    gridColumnStart: spanLogo ? 1 : undefined,
    gridColumnEnd: spanLogo ? 3 : undefined,
  };

  return (
    <header className="sticky top-0 bg-white/60 backdrop-blur-md p-4 flex flex-wrap justify-between sm:grid gap-4 items-center @container" style={headerStyles}>
      <div style={logoStyles}>
        <Logo title={logoTitle} size="medium" monochrome={embed.isEmbed && embed.config?.logo === "monochrome"} />
      </div>
      {React.Children.map(children, (child) => (React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<AppHeaderChildProps>, { ...(child.props || {}), condensed }) : child))}
    </header>
  );
}

type AppHeaderLeftProps = {
  children?: ReactNode;
};

export function AppHeaderLeft({ children }: AppHeaderLeftProps) {
  return <div style={{ gridArea: "left" }}>{children}</div>;
}

type AppHeaderMainProps = {
  children?: ReactNode;
  title?: string;
  calculator?: CalculatorViewModel;
};

export function AppHeaderMain({ children, title, calculator }: AppHeaderMainProps) {
  return (
    <div style={{ gridArea: "main" }} className="flex-1 sm:grid text-sm leading-none">
      <h1 className="font-light">{title}</h1>
      <div>
        <h2 className="font-semibold inline">{calculator?.title}</h2>
        {calculator?.title && calculator?.secondaryTitle && <span className="font-light hidden @[36rem]:inline"> • </span>}
        <span className="font-light hidden @[36rem]:inline">{calculator?.secondaryTitle}</span>
      </div>
      {children}
    </div>
  );
}

type AppHeaderRightProps = {
  children: ReactNode;
};

export function AppHeaderRight({ children }: AppHeaderRightProps) {
  return <div style={{ gridArea: "right" }}>{children}</div>;
}

type AppHeaderBottomProps = {
  children: ReactNode;
};

export function AppHeaderBottom({ children }: AppHeaderBottomProps) {
  return <div className="flex items-center sm:[display:contents]">{children}</div>;
}

type AppHeaderBottomLeftProps = {
  children: ReactNode;
  condensed?: boolean;
};

export function AppHeaderBottomLeft({ children, condensed }: AppHeaderBottomLeftProps) {
  const bottomLeftStyles = {
    gridArea: condensed ? "left" : "bottom-left",
    justifySelf: condensed ? "auto" : "end",
  };

  return <div style={bottomLeftStyles}>{children}</div>;
}

type AppHeaderBottomMainProps = {
  children: ReactNode;
  condensed?: boolean;
};

export function AppHeaderBottomMain({ children, condensed }: AppHeaderBottomMainProps) {
  const bottomMainStyles = {
    gridArea: "bottom-main",
  };

  return (
    <div className={`${condensed ? "block sm:hidden" : "block"}`} style={bottomMainStyles}>
      {children}
    </div>
  );
}
