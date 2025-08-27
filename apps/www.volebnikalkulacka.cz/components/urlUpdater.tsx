"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useElectionStore } from "../stores/electionStore";
export default function UrlUpdater() {
  const questionStep = useElectionStore((state) => state.questionStep);
  const guideStep = useElectionStore((state) => state.guideStep);
  const params = useParams();

  const path = usePathname();
  useEffect(() => {
    if (path.includes("otazka")) {
      const newUrl = `/${params.first}/${params.second}/otazka/${questionStep}`;
      window.history.replaceState(null, "", newUrl);
    } else if (path.includes("navod")) {
      const newUrl = `/${params.first}/${params.second}/navod/${guideStep}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [questionStep, path, params.first, params.second, guideStep]);
  return null;
}
