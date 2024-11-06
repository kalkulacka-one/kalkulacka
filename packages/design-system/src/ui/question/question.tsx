import { Card } from "@repo/design-system/ui";
import { Badge } from "@repo/design-system/badge";

const Question = () => {
  return (
    <Card
      corner="topLeft"
      className="k1-flex k1-flex-col k1-w-auto k1-p-customMobile md:k1-p-customDesktop k1-gap-4"
    >
      <div className="k1-flex k1-gap-4 k1-flex-wrap k1-items-center">
        <span className="k1-text-sm k1-font-normal">2/25</span>
        <span className="k1-text-sm k1-font-normal">
          Hromadná doprava vs. automobilová
        </span>
        <Badge>Veřejná doprava</Badge>
      </div>
      <div>
        {/* TODO: line height fix value */}
        <span className="k1-font-bold k1-text-2xl md:k1-text-4xl k1-leading-6 k1-tracking-tighter">
          Investice do hromadné dopravy by měly mít přednost před rozvojem
          infrastruktury pro osobní automobilovou dopravu.
        </span>
      </div>
      <div>
        <p className="k1-font-normal k1-text-base k1-text-neutral">
          Investice do veřejné dopravy jsou klíčové pro všechny kraje, zejména
          pro venkovské a méně rozvinuté oblasti.
        </p>
      </div>
    </Card>
  );
};

export { Question };
