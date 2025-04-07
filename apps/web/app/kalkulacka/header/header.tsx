"use client";
import { useElectionStore } from "../../stores/electionStore";
import LogoWrapper from "./logoWrapper";
import ReturnHomeButton from "./returnHomeButton";

export default function Header() {
  const selectedDistrict = useElectionStore((state) => state.selectedDistrict);
  return (
    <header
      className="sticky left-0 max-w-[100vw]"
      style={{ gridArea: "header" }}
    >
      <div
        className="grid w-full grid-cols-[auto_auto_1fr] !items-center gap-2 p-2 xs:gap-4 xs:p-4 sm:gap-8 sm:p-8"
        style={{ gridTemplateAreas: `"logo title right"` }}
      >
        <div style={{ gridArea: "logo" }}>
          <LogoWrapper />
        </div>

        {selectedDistrict && (
          <div style={{ gridArea: "title" }}>
            <p
              className="font-primary 
           text-sm text-neutral max-[575px]:text-xs"
            >
              Krajské volby 2024{` — ${selectedDistrict}`}
            </p>
          </div>
        )}

        <div
          className="justify-self-end bg-red-500"
          style={{ gridArea: "right" }}
        >
          <ReturnHomeButton />
        </div>
      </div>
    </header>
  );
}

// 1. Fix return button position!
// 2. Fix dynamic districts with a better approach! (probably on Zustand side)
