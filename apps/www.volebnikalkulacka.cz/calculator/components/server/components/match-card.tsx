import { Card, ProgressBar } from "@repo/design-system/server";

import type { CandidateMatchViewModel } from "../../../view-models";

export type MatchCard = CandidateMatchViewModel;

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  return (
    <Card corner="topLeft" shadow="hard" className="overflow-hidden border border-slate-300">
      {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
      <div className="grid gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${order === 1 ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "bg-slate-700 text-slate-50"}`}>
            <span className="text-2xl font-bold">{order !== undefined ? order : "—"}</span>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold leading-tight text-slate-700">{candidate.displayName}</h3>
            {candidate.organization && <p className="text-sm text-slate-500">{candidate.organization}</p>}
            {respondent === "expert" && (
              <p className="text-xs text-gray-500">
                Postoje podle veřejných zdrojů,
                <br /> strana neodpověděla na zaslané otázky.
              </p>
            )}
          </div>
          <div>
            <span className="text-3xl font-bold tracking-tight text-slate-800">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
