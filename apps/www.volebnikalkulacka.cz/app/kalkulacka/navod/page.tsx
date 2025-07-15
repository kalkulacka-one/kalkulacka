import { Button } from "@repo/design-system/client";
import { BottomBar } from "./components/bottomBar";
import { Card } from "./components/card";
import { Content } from "./components/content";
import data from "./data.json";

export default function Page() {
  const stepCurrent = 1;

  const ReturnGuideContent = (number: number) => {
    switch (number) {
      case 1: {
        return data.intro;
      }
      case 2: {
        return data.guide[number - 1]?.content;
      }
      case 3: {
        return data.guide[number - 1]?.content;
      }
      case 4: {
        return data.guide[number - 1]?.content;
      }
    }
  };

  const guideContent = ReturnGuideContent(stepCurrent);

  return (
    <div>
      <Content>
        {stepCurrent === 1 && <Content.Title>{data.calculatorGroup.name}</Content.Title>}
        {stepCurrent > 1 && <Card>Infographic</Card>}
        <Content.Body>{guideContent}</Content.Body>
      </Content>
      <BottomBar stepCurrent={stepCurrent} stepTotal={data.guide.length}>
        {stepCurrent >= 4 ? (
          <Button variant="filled" color="primary">
            První otázka
          </Button>
        ) : (
          <Button variant="outline" color="neutral">
            Další krok
          </Button>
        )}

        {stepCurrent < 4 && (
          <Button variant="link" color="neutral">
            Přeskočit návod
          </Button>
        )}
      </BottomBar>
    </div>
  );
}
