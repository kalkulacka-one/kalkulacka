import { Card } from "@repo/design-system/ui";
import {
  ArrowIconRight,
  BlueCheckIcon,
  RedCrossIcon,
  StarIcon,
  StarIconFilled,
} from "@repo/design-system/icons";

export function CardTwo() {
  return (
    <Card
      border="default"
      corner="bottomRight"
      shadow="none"
      className="w-fit self-center p-4"
    >
      <div className="flex w-fit flex-col gap-4">
        <div className="flex gap-4">
          <BlueCheckIcon className="size-6" />
          <p>= souhlasím</p>
        </div>
        <div className="flex gap-4">
          <RedCrossIcon className="size-6" />
          <p>= nesouhlasím</p>
        </div>
      </div>
    </Card>
  );
}

export function CardThree() {
  return (
    <Card
      border="default"
      corner="bottomRight"
      shadow="none"
      className="w-fit self-center p-4"
    >
      <div className="flex items-center gap-4">
        <StarIcon className="size-6" />
        <ArrowIconRight className="size-4" />
        <StarIconFilled className="size-6" />
        <p>= pro mě důležité</p>
      </div>
    </Card>
  );
}

export function CardFour() {
  return (
    <Card
      border="default"
      corner="bottomRight"
      shadow="none"
      className="w-fit self-center p-4"
    >
      <div className="flex items-center gap-4">
        <ArrowIconRight className="size-6" />
        <p>= přeskočit</p>
      </div>
    </Card>
  );
}
