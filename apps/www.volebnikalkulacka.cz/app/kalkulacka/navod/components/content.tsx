export type Content = {
  children: React.ReactNode;
};

export function Content({ children }: Content) {
  return <div className="flex flex-col">{children}</div>;
}

export type ContentTitle = {
  children: React.ReactNode;
};

export function ContentTitle({ children }: ContentTitle) {
  return <span className="text-2xl font-bold">{children}</span>;
}

export type ContentBody = {
  children: React.ReactNode;
};

export function ContentBody({ children }: ContentBody) {
  return <div>{children}</div>;
}

Content.Title = ContentTitle;
Content.Body = ContentBody;
