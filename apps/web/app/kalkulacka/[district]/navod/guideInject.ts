"use client";

import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";

type GuideInjectProps = {
  intro: Promise<void>;
};
export default function GuideInject({ intro }: GuideInjectProps) {
  const setElectionIntro = useElectionStore((state) => state.setElectionIntro);
  const setUserLocation = useElectionStore((state) => state.setUserLocation);
  useEffect(() => {
    setElectionIntro(intro);
    setUserLocation("navod");
    console.log("Guide intro injected");
  }, []);
  return null;
}
