import { Card } from "@repo/design-system/server";

export type RecapCard = {
  children: React.ReactNode;
};

export function RecapCard({ children }: Card) {
  return <Card>{children}</Card>;
}
