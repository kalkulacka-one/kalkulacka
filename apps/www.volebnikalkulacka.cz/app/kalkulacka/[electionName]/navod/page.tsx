"use client";

import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";

export default function Page() {
  const params = useParams();
  const calculator = useElectionStore((state) => state.calculator);
  const handleGuideStep = useElectionStore((state) => state.handleGuideStep);
  const guideStep = useElectionStore((state) => state.guideStep);

  if (!calculator) {
    return null;
  }

  console.log(calculator[0].electionName);
  return (
    <div>
      <h1 className="text-5xl font-bold">{calculator[0].electionName}</h1>
      <Card color="white">
        <div className="flex flex-col gap-4">
          <div className="flex">
            {guideStep}/{calculator[0].info.length}
          </div>
          <div>{calculator[0].info[guideStep - 1]}</div>
        </div>
      </Card>
      <Button variant="link" color="neutral" onClick={() => handleGuideStep("previous")}>
        Předchozí
      </Button>
      <Button variant="link" color="neutral" onClick={() => handleGuideStep("next")}>
        Další
      </Button>
      {guideStep === 4 ? (
        <Link href={`/kalkulacka/${params.electionName}/otazka`}>
          <Button variant="filled" color="primary">
            Spustit kalkulačku
          </Button>
        </Link>
      ) : (
        <Link href={`/kalkulacka/${params.electionName}/otazka`}>
          <Button variant="link" color="neutral">
            Přeskočit
          </Button>
        </Link>
      )}
    </div>
  );
}
