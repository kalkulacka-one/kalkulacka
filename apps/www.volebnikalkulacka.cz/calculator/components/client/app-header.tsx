import { Logo } from "@repo/design-system/client";
import type { ReactNode } from "react";
import React from "react";

import { useEmbed } from "../../../components/client";

type AppHeaderChildProps = {
  condensed?: boolean;
};

type AppHeaderProps = {
  children: ReactNode;
  condensed?: boolean;
  logoTitle: string;
};

export function AppHeader({ children, condensed = false, logoTitle }: AppHeaderProps) {
  const { config } = useEmbed();
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
    <header className="sticky top-0 bg-white/60 backdrop-blur-md p-4 grid gap-4 items-center @container" style={headerStyles}>
      <div style={logoStyles}>
        <Logo title={logoTitle} size="medium" monochrome={config?.logo === "monochrome"} />
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
  secondaryTitle?: string;
  tertiaryTitle?: string;
};

export function AppHeaderMain({ children, title, secondaryTitle, tertiaryTitle }: AppHeaderMainProps) {
  return (
    <div style={{ gridArea: "main" }} className="grid text-sm leading-none">
      <h1 className="font-light">{title}</h1>
      <div>
        <h2 className="font-semibold inline">{secondaryTitle}</h2>
        {secondaryTitle && tertiaryTitle && <span className="font-light hidden @[36rem]:inline"> • </span>}
        <span className="font-light hidden @[36rem]:inline">{tertiaryTitle}</span>
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
  return <div style={{ display: "contents" }}>{children}</div>;
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
    display: condensed ? "none" : "block",
  };

  return <div style={bottomMainStyles}>{children}</div>;
}
