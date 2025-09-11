import { Card, ProgressBar } from "@repo/design-system/server";

import type { CandidateViewModel } from "../../../view-models";

export type MatchCard = {
  candidate: CandidateViewModel;
  order?: number;
  match?: number;
  respondent?: string;
};

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  return (
    <Card corner="topLeft" shadow="hard">
      <div className="grid overflow-hidden rounded-3xl rounded-tl-none">
        {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-8">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${order === 1 ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "bg-[var(--ko-color-neutral)] text-[var(--ko-color-on-bg-neutral)]"}`}
          >
            <span className="text-2xl font-bold">{order !== undefined ? order : "—"}</span>
          </div>
          <div className="grid gap-1">
            <h3 className="text-xl font-bold leading-tight">{candidate.displayName}</h3>
            {candidate.organization && <p className="text-sm">{candidate.organization}</p>}
            {respondent === "expert" && <p className="text-xs text-gray-500">Postoje podle veřejných zdrojů,<br/> strana neodpověděla na zaslané otázky.</p>}
          </div>
          <div>
            <span className="text-3xl font-bold">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
