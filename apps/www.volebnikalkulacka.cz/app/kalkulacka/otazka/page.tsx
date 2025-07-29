import { Button } from "@repo/design-system/client";
import { QuestionCard } from "../otazka/components/questionCard";
import { BottomBar } from "./components/bottomBar";
import { Content } from "./components/content";
import data from "./data.json";

export default function Page() {
  const stepCurrent = 2;

  return (
    <div>
      <Content>
        <QuestionCard question={data} questionCurrent={stepCurrent} questionTotal={data.length} />
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
