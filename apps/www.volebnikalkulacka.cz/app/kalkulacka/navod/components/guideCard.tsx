import { Icon } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

export type GuideCard = {
  children?: React.ReactNode;
  stepCurrent: number;
};

const ReturnCardContent = (number: number) => {
  switch (number) {
    case 1: {
      return null;
    }
    case 2: {
      return (
        <>
          <div className="flex gap-4">
            <div>✅</div>
            <div>= Souhlasím</div>
          </div>
          <div className="flex gap-4">
            <div>❌</div>
            <div>= Nesouhlasím</div>
          </div>
        </>
      );
    }
    case 3: {
      return (
        <div className="flex gap-4">
          <div>⭐</div>
          <div>➡️</div>
          <div>= pro mě důležité</div>
        </div>
      );
    }
    case 4: {
      return (
        <div className="flex gap-4">
          <div>➡️</div>
          <div>= přeskočit</div>
        </div>
      );
    }
  }
};

export function GuideCard({ children, stepCurrent }: GuideCard) {
  const cardContent = ReturnCardContent(stepCurrent);
  return (
    <Card>
      <div className="p-4">
        <div className="flex flex-col gap-4">{cardContent}</div>
      </div>
    </Card>
  );
}
