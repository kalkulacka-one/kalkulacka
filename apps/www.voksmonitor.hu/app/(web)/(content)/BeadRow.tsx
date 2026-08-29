"use client";

import { useEffect, useRef, useState } from "react";

import { BeadCheckBlue, BeadCrossRed, BeadTickSlate } from "./icons";

export function BeadRow({ anchorId = "other-calcs-heading" }: { anchorId?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const gridRoot = document.getElementById("bg-grid-root");
    const anchor = document.getElementById(anchorId);
    if (!gridRoot || !anchor) return;
    const update = () => {
      const gridRect = gridRoot.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      // Position beads roughly on the text midline
      const t = anchorRect.top - gridRect.top + anchorRect.height * 0.55;
      setTop(t);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [anchorId]);

  if (top == null) return null;

  return (
    <div ref={rootRef} className="absolute left-0 right-0" style={{ top }}>
      <div className="grid grid-cols-6 gap-x-6">
        <div className="relative col-start-4">
          <BeadCheckBlue className="absolute left-0 -translate-x-1/2 h-8 w-8 ko:text-primary" />
        </div>
        <div className="relative col-start-5">
          <BeadCrossRed className="absolute left-0 -translate-x-1/2 h-8 w-8 ko:text-secondary" />
        </div>
        <div className="relative col-start-6">
          <BeadTickSlate className="absolute left-0 -translate-x-1/2 h-8 w-8 text-slate-700" />
        </div>
      </div>
    </div>
  );
}
