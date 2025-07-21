import { twMerge } from "@repo/design-system/utils";

export type Header = {
  children: React.ReactNode;
};

export function Header({ children }: Header) {
  return (
    <header className={twMerge("ko:w-full ko:py-4 ko:px-44")}>
      <div className={twMerge("ko:flex ko:justify-between ko:py-4")}>{children}</div>
    </header>
  );
}

export type HeaderLeft = {
  children: React.ReactNode;
};

export function HeaderLeft({ children }: HeaderLeft) {
  return <div className={twMerge("ko:flex ko:gap-8 ko:grow-1")}>{children}</div>;
}

export type HeaderRight = {
  children: React.ReactNode;
};

export function HeaderRight({ children }: HeaderRight) {
  return <div className={twMerge("ko:flex ko:gap-6")}>{children}</div>;
}

Header.Left = HeaderLeft;
Header.Right = HeaderRight;
