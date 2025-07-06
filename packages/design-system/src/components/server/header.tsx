import { twMerge } from "@repo/design-system/utils";

export type Header = {
  children: React.ReactNode;
};

export function Header({ children }: Header) {
  return (
    <header className={twMerge("ko:max-w-[100vw] ko:left-0 ko:sticky ko:[grid-area:header]")}>
      <div className="ko:grid ko:grid-cols-[auto_auto_1fr] ko:gap-2 ko:xs:gap-4 ko:sm:gap-8 ko:w-full ko:items-center ko:p-2 ko:xs:p-4 ko:sm:p-8 ko:bg-transparent ko:[grid-template-areas:'logo_title_right']">
        {children}
      </div>
    </header>
  );
}

export type HeaderLogo = {
  children: React.ReactNode;
};

export function HeaderLogo({ children }: HeaderLogo) {
  return <div className={twMerge("ko:flex ko:items-center ko:[grid-area:logo]")}>{children}</div>;
}

export type HeaderTitle = {
  children: React.ReactNode;
};

export function HeaderTitle({ children }: HeaderTitle) {
  return <div className="ko:[grid-area:title]">{children}</div>;
}

export type HeaderRight = {
  children: React.ReactNode;
};

export function HeaderRight({ children }: HeaderRight) {
  return <div className={twMerge("ko:flex ko:items-start ko:justify-end ko:[grid-area:right]")}>{children}</div>;
}

Header.Logo = HeaderLogo;
Header.Title = HeaderTitle;
Header.Right = HeaderRight;
