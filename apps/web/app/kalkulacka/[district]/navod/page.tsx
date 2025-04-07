"use client";
import { useElectionStore } from "../../../stores/electionStore";
import { useParams } from "next/navigation";
import GuideBottomBar from "./guideBottomBar";
import GuideWrapper from "./guideWrapper";
import guide from "./guide.json";
import GuideMobileArrowWrapper from "./guideMobileArrowWrapper";
import { getLabel } from "../../../utils/getLabel";

export default function Page() {
  const params = useParams();
  const district = params.district;
  const selectedDistrict = useElectionStore((state) => state.selectedDistrict);
  const setSelectedDistrict = useElectionStore(
    (state) => state.setSelectedDistrict,
  );
  const electionIntro = useElectionStore((state) => state.electionIntro);
  const guideStep = useElectionStore((state) => state.guideStep);
  const setPreviousGuideStep = useElectionStore(
    (state) => state.setPreviousGuideStep,
  );
  const setNextGuideStep = useElectionStore((state) => state.setNextGuideStep);

  return (
    <>
      <header
        className="sticky left-0 top-0 z-[100] max-w-[100vw]"
        style={{ gridArea: "sticky-header" }}
      >
        <GuideMobileArrowWrapper
          guideStep={guideStep}
          guide={guide}
          prevGuide={setPreviousGuideStep}
          nextGuide={setNextGuideStep}
        />
      </header>
      <main className="grid" style={{ gridArea: "main" }}>
        <div
          className="grid grid-rows-[1fr_auto]"
          style={{ gridTemplateAreas: `"main" "bottom-bar"` }}
        >
          <div className="place-content-center" style={{ gridArea: "main" }}>
            <GuideWrapper
              guide={guide}
              guideStep={guideStep}
              prevGuide={setPreviousGuideStep}
              nextGuide={setNextGuideStep}
              intro={electionIntro}
              // fix any
              electionRegion={selectedDistrict}
              // fix
              electionType="Krajské volby 2024"
            />
          </div>
          <div style={{ gridArea: "bottom-bar" }}>
            <GuideBottomBar
              guideNumber={guideStep}
              nextGuide={setNextGuideStep}
              steps={guide}
            />
          </div>
        </div>
      </main>
    </>
  );
}

// 2. Fix region type string conversion
// 3. Componentize header, check positioning on mobile
