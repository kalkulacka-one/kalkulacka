import { mdiArrowRight, mdiCheckBold, mdiCloseThick, mdiStar, mdiStarOutline } from "@mdi/js";
import { Icon } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

export type Guide = {
  stepCurrent: number;
};

function Content(stepCurrent: number) {
  switch (stepCurrent) {
    case 2:
      return (
        <>
          <div className="ko:flex ko:gap-4">
            <Icon decorative={true} icon={mdiCheckBold} className="ko:text-primary" />
            <p>= souhlasím</p>
          </div>
          <div className="ko:flex ko:gap-4">
            <Icon decorative={true} icon={mdiCloseThick} className="ko:text-secondary" />
            <p>= nesouhlasím</p>
          </div>
        </>
      );
    case 3:
      return (
        <div className="ko:flex ko:gap-4 ko:items-center">
          <Icon decorative={true} icon={mdiStarOutline} />
          <Icon size="small" decorative={true} icon={mdiArrowRight} />
          <Icon decorative={true} icon={mdiStar} className="ko:text-yellow" />
          <p>= pro mě důležité</p>
        </div>
      );

    case 4:
      return (
        <div className="ko:flex ko:gap-4">
          <Icon decorative={true} icon={mdiArrowRight} />
          <p>= přeskočit</p>
        </div>
      );
  }
}

export function Guide({ stepCurrent }: Guide) {
  const content = Content(stepCurrent);
  return (
    <Card corner="bottomRight">
      <div className="ko:flex ko:flex-col ko:gap-4">{content}</div>
    </Card>
  );
}
