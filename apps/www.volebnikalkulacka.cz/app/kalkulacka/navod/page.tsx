import { Button } from "@repo/design-system/client";
import Link from "next/link";
import { GuideCard } from "../navod/components/guideCard";
import { BottomBar } from "./components/bottomBar";
import { Content } from "./components/content";
import data from "./data.json";

export default function Page() {
  const stepCurrent = 3;

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
    <div className="flex justify-center">
      <Content>
        {stepCurrent === 1 && <Content.Title>{data.calculatorGroup.name}</Content.Title>}
        <div>{guideContent?.split("//")[0]}</div>
        {stepCurrent > 1 && (
          <div className="w-fit self-center">
            <GuideCard stepCurrent={stepCurrent} />
          </div>
        )}
        <Content.Body>{guideContent?.split("//")[1]}</Content.Body>
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
