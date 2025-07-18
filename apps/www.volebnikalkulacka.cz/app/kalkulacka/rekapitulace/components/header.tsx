export type Header = {
  children: React.ReactNode;
};

export function Header({ children }: Header) {
  return <div className="border border-black bg-gray-50 p-4 flex sticky justify-between items-center top-0">{children}</div>;
}

export type HeaderTitle = {
  children: React.ReactNode;
};

export function HeaderTitle({ children }: Header) {
  return <h2 className="font-bold text-2xl flex-grow-1">{children}</h2>;
}

export type HeaderRight = {
  children: React.ReactNode;
};

export function HeaderRight({ children }: Header) {
  return <div>{children}</div>;
}

Header.Title = HeaderTitle;
Header.Right = HeaderRight;
