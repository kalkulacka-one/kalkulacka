import { Card } from "@repo/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
};

export function NavigationCard({ children }: NavigationCard) {
  return <Card>{children}</Card>;
}
