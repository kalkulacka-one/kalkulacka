import { twMerge } from "@repo/design-system/utils";

export type Header = {
  children?: React.ReactNode;
  expanded?: boolean;
  className?: string;
};

export function Header({ children, expanded = false, className }: Header) {
  const gridClasses = "ko:grid ko:grid-cols-[auto_1fr_auto] ko:items-center";
  const expandedRowsClasses = "ko:grid-rows-[3rem_auto]";
  const collapsedRowsClasses = "ko:grid-rows-[3rem]";
  const gridSpacingClasses = "ko:gap-x-2 sm:ko:gap-x-3 ko:gap-y-1";

  const headerGridClasses = twMerge(gridClasses, expanded ? expandedRowsClasses : collapsedRowsClasses, gridSpacingClasses, className);

  return (
    <header className="ko:@container ko:sticky ko:top-0 ko:p-2 sm:ko:p-3 ko:bg-white/60 ko:backdrop-blur-md">
      <div className={headerGridClasses}>{children}</div>
    </header>
  );
}

export type HeaderMain = {
  children?: React.ReactNode;
  expanded?: boolean;
  hasBottomLeftContent?: boolean;
  condensed?: boolean;
  className?: string;
};

export function HeaderMain({ children, expanded = false, hasBottomLeftContent = false, condensed = false, className }: HeaderMain) {
  const mainGrid = "ko:grid ko:grid-flow-col ko:grid-cols-[auto_1fr] ko:gap-2";
  const mainExpandedOrNoLeftContent = expanded || !hasBottomLeftContent ? "ko:col-span-2" : "";
  const mainCondensedWithLeftContent = condensed && hasBottomLeftContent ? "ko:col-start-2" : "";

  const mainClasses = twMerge(mainGrid, mainExpandedOrNoLeftContent, mainCondensedWithLeftContent, className);

  return <div className={mainClasses}>{children}</div>;
}

export type HeaderRight = {
  children?: React.ReactNode;
  className?: string;
};

export function HeaderRight({ children, className }: HeaderRight) {
  return <div className={twMerge("", className)}>{children}</div>;
}

export type HeaderBottom = {
  children?: React.ReactNode;
  expanded?: boolean;
  condensed?: boolean;
  hasBottomLeftContent?: boolean;
  className?: string;
};

export function HeaderBottom({ children, expanded = false, condensed = false, hasBottomLeftContent = false, className }: HeaderBottom) {
  if (!expanded && !(condensed && hasBottomLeftContent)) {
    return null;
  }

  const bottomExpanded = "ko:col-span-3 ko:flex ko:items-center ko:h-full";
  const bottomCondensed = "ko:row-start-1";
  const bottomClasses = twMerge(expanded ? bottomExpanded : bottomCondensed, className);

  return <div className={bottomClasses}>{children}</div>;
}

export type HeaderBottomLeft = {
  children?: React.ReactNode;
  condensed?: boolean;
  className?: string;
};

export function HeaderBottomLeft({ children, condensed = false, className }: HeaderBottomLeft) {
  if (condensed) {
    return <div className={twMerge("ko:row-start-1 ko:col-start-1 ko:grid ko:grid-flow-col ko:items-center ko:gap-1", className)}>{children}</div>;
  }
  return <div className={className}>{children}</div>;
}

export type HeaderBottomMain = {
  children?: React.ReactNode;
  condensed?: boolean;
  className?: string;
};

export function HeaderBottomMain({ children, condensed = false, className }: HeaderBottomMain) {
  if (condensed) {
    return null;
  }
  return <div className={className}>{children}</div>;
}

Header.Main = HeaderMain;
Header.Right = HeaderRight;
Header.Bottom = HeaderBottom;
Header.BottomLeft = HeaderBottomLeft;
Header.BottomMain = HeaderBottomMain;
