import { Button } from "@repo/design-system/client";
import { Card } from "../components/card";
import { BottomBar } from "./components/bottomBar";
import { Content } from "./components/content";
import data from "./data.json";

export default function Page() {
  const stepCurrent = 2;

  return (
    <div>
      <Content>
        <Card>
          {/* question info */}
          <div className="flex gap-2">
            <span>
              {stepCurrent}/{data.length}
            </span>
            <span>{data[stepCurrent - 1]?.title}</span>
            <span>{data[stepCurrent - 1]?.tags}</span>
          </div>
          {/* question title */}
          <div>
            <h2 className="text-2xl font-bold">{data[stepCurrent - 1]?.statement}</h2>
          </div>
          {/* question text */}
          <div>{data[stepCurrent - 1]?.detail}</div>
        </Card>
      </Content>
      <BottomBar stepCurrent={stepCurrent} stepTotal={data.length} questions={data}>
        <div className="flex gap-2 justify-center">
          <Button variant={data[stepCurrent - 1]?.isImportant ? "filled" : "outline"} color="neutral">
            Pro mě důležité
          </Button>
          <Button variant={data[stepCurrent - 1]?.answer === 1 ? "filled" : "outline"} color="primary">
            Ano
          </Button>
          <Button variant={data[stepCurrent - 1]?.answer === 2 ? "filled" : "outline"} color="secondary">
            Ne
          </Button>
        </div>
      </BottomBar>
    </div>
  );
}
