"use client";

import RecapHeader from "./recapHeader";
import RecapBottomBar from "./recapBottomBar";
import { useElectionStore } from "../../../stores/electionStore";
import RecapWrapper from "./recapWrapper";
import { useParams } from "next/navigation";
export default function Page() {
  const params = useParams();
  const district = params.district;
  const questions = useElectionStore((state) => state.questions);
  return (
    <>
      <RecapHeader district={district} />
      <main className="grid" style={{ gridArea: "main" }}>
        <div
          className="grid grid-rows-[1fr_auto]"
          style={{ gridTemplateAreas: `"main" "bottom-bar"` }}
        >
          <div className="place-content-center" style={{ gridArea: "main" }}>
            <RecapWrapper questions={questions} />
          </div>
          <div style={{ gridArea: "bottom-bar" }}>
            <RecapBottomBar />
          </div>
        </div>
      </main>
    </>
  );
}
