import { Button } from "@repo/design-system/client";
import Link from "next/link";
import { BottomBar } from "./components/bottomBar";
import { Card } from "./components/card";
import { Content } from "./components/content";
import data from "./data.json";

export default function Page() {
  const stepCurrent = 1;

  const ReturnCardContent = (number: number) => {
    switch (number) {
      case 1: {
        return null;
      }
      case 2: {
        return "✅ = Souhlasím ❌ = Nesouhlasím";
      }
      case 3: {
        return "⭐ = Pro mě důležité";
      }
      case 4: {
        return "➡️ = Přeskočit";
      }
    }
  };

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

  const cardContent = ReturnCardContent(stepCurrent);

  return (
    <div>
      <Content>
        {stepCurrent === 1 && <Content.Title>{data.calculatorGroup.name}</Content.Title>}
        {stepCurrent > 1 && <Card>{cardContent}</Card>}
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
          <Link href="/kalkulacka/otazka">
            <Button variant="link" color="neutral">
              Přeskočit návod
            </Button>
          </Link>
        )}
      </BottomBar>
    </div>
  );
}
