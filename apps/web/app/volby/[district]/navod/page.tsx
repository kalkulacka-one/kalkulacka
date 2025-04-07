"use client";
import { useEffect } from "react";
// import { useParams } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";
import GuideSteps from "./guideSteps";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function Page() {
  const params = useParams();
  const { district } = params;
  const selectedDistrict = useElectionStore((state) => state.selectedDistrict);
  const setSelectedDistrict = useElectionStore(
    (state) => state.setSelectedDistrict,
  );
  const fetchCalculator = useElectionStore((state) => state.fetchCalculator);
  const fetchQuestions = useElectionStore((state) => state.fetchQuestions);
  const electionIntro = useElectionStore((state) => state.electionIntro);
  const guideStep = useElectionStore((state) => state.guideStep);
  const setNextGuideStep = useElectionStore((state) => state.setNextGuideStep);
  const setPreviousGuideStep = useElectionStore(
    (state) => state.setPreviousGuideStep,
  );
  // district setter
  useEffect(() => {
    setSelectedDistrict(district);
  }, [district]);

  // data fetcher
  useEffect(() => {
    fetchCalculator(district);
    fetchQuestions(district);
  }, []);

  return (
    <div className="flex flex-col">
      <h1>Návod</h1>
      <span>Params:{district}</span>
      <span>Zustand: {selectedDistrict}</span>
      <GuideSteps intro={electionIntro} currentStep={guideStep} />
      <div className="flex gap-2">
        <button onClick={setPreviousGuideStep} className="bg-blue-300 p-4">
          Previous
        </button>
        <button onClick={setNextGuideStep} className="bg-blue-300 p-4">
          Next
        </button>
      </div>
      <Link href={`/volby/${district}/otazka`}>Otázky</Link>
    </div>
  );
}
