import { Button } from "@repo/design-system/client";
import Link from "next/link";
import { Card } from "../components/card";
import { Content } from "./components/content";
import { Header } from "./components/header";
import data from "./data.json";

export default function Page() {
  return (
    <div>
      <Header>
        <Link href="/kalkulacka/otazka">
          <Button variant="link" color="neutral">
            ←
          </Button>
        </Link>

        <Header.Title>Rekapitulace</Header.Title>
        <Header.Right>
          <Button>Zobrazit výsledky</Button>
        </Header.Right>
      </Header>
      <Content>
        <div className=" flex flex-col gap-4">
          {data.map((card, index) => (
            <Card key={card.id}>
              <div className="flex gap-2">
                <span>
                  {index + 1}/{data.length}
                </span>
                <span>{data[index]?.title}</span>
                <span>{data[index]?.tags}</span>
              </div>
              {/* question title */}
              <div>
                <h2 className="text-2xl font-bold">{data[index]?.statement}</h2>
              </div>
              {/* question text */}
              <div>{data[index]?.detail}</div>
              <div>
                <Button variant={data[index]?.isImportant ? "filled" : "outline"} color="neutral">
                  Pro mě důležité
                </Button>
                <Button variant={data[index]?.answer === 1 ? "filled" : "outline"} color="primary">
                  Ano
                </Button>
                <Button variant={data[index]?.answer === 2 ? "filled" : "outline"} color="secondary">
                  Ne
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Content>
    </div>
  );
}
