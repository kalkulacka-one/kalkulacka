"use client";
import { useEffect } from "react";
// import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";
import GuideSteps from "./guideSteps";
import { useParams } from "next/navigation";
export default function Page() {
  const params = useParams();
  const { district } = params;
  const selectedDistrict = useElectionStore((state) => state.selectedDistrict);
  const setSelectedDistrict = useElectionStore(
    (state) => state.setSelectedDistrict,
  );
  const fetchCalculator = useElectionStore((state) => state.fetchCalculator);
  const electionIntro = useElectionStore((state) => state.electionIntro);
  const setElectionIntro = useElectionStore((state) => state.setElectionIntro);

  useEffect(() => {
    async function dataFetcher() {
      const calculator = await fetchCalculator(district);
      const data = calculator;
      // fix this!
      setElectionIntro(data.intro);
    }
    dataFetcher();
  });

  // district setter
  useEffect(() => {
    setSelectedDistrict(district);
  }, [district]);

  return (
    <div className="flex flex-col">
      <h1>Návod</h1>
      <span>Params:{district}</span>
      <span>Zustand: {selectedDistrict}</span>
      <GuideSteps intro={electionIntro} currentStep={1} />
    </div>
  );
}
