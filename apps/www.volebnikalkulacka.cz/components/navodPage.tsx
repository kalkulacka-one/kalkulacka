"use client";
import { Button } from "@repo/design-system/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useElectionStore } from "../stores/electionStore";
import UrlUpdater from "./urlUpdater";

export default function NavodPage({ guideStep }: { guideStep: number }) {
  const calculator = useElectionStore((state) => state.calculator);
  const election = useElectionStore((state) => state.election);
  const params = useParams();
  const storeGuideStep = useElectionStore((state) => state.guideStep);
  const setStoreGuideStep = useElectionStore((state) => state.setGuideStep);

  useEffect(() => {
    setStoreGuideStep(guideStep);
  }, [guideStep, setStoreGuideStep]);

  if (!calculator && !election) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Návod, guideStep: {storeGuideStep}
      <h2>{election.title}</h2>
      <p>{calculator.calculator.intro}</p>
      {storeGuideStep === 4 ? (
        <Link href={`/${params.first}/${params.first}/otazka/1`}>
          <Button variant="filled" color="primary">
            Spustit kalkulačku
          </Button>
        </Link>
      ) : (
        <Link href={`/${params.first}/${params.second}/otazka/1`}>
          <Button variant="link" color="neutral">
            Přeskočit
          </Button>
        </Link>
      )}
    </div>
  );
}
