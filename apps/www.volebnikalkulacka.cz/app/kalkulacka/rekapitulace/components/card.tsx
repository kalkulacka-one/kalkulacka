export type Card = {
  children: React.ReactNode;
};

export function Card({ children }: Card) {
  return <div className="bg-gray-100 border border-black p-4 flex flex-col">{children}</div>;
}
