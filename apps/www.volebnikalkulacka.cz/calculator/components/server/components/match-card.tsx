import { Card, ProgressBar } from "@repo/design-system/server";

import type { CandidateViewModel } from "../../../view-models";

export type MatchCard = {
  candidate: CandidateViewModel;
  order?: number;
  match?: number;
};

export function MatchCard({ candidate, order, match }: MatchCard) {
  return (
    <Card corner="topLeft" shadow="hard">
      <div className="grid overflow-hidden rounded-3xl rounded-tl-none">
        {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: order === 1 ? "var(--ko-color-primary)" : "var(--ko-color-neutral)" }}>
            <span className="text-2xl font-bold">{order !== undefined ? order : "—"}</span>
          </div>
          <div className="grid gap-1">
            <h3 className="text-xl font-bold leading-tight">{candidate.displayName}</h3>
            {candidate.organization && <p className="text-sm">{candidate.organization}</p>}
          </div>
          <div>
            <span className="text-3xl font-bold">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
