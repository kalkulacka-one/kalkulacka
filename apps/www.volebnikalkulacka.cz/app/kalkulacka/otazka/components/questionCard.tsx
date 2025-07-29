import { Card } from "@repo/design-system/server";

export type QuestionCard = {
  children: React.ReactNode;
};

export function QuestionCard({ children }: Card) {
  return <Card>{children}</Card>;
}
