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
      <div className="relative">
        <div className="absolute left-0 right-0 top-0">
          {match !== undefined && <ProgressBar value={match} color="primary" />}
        </div>
        <div className="flex items-center gap-4 px-5 pb-5 pt-8">
          <div 
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: order === 1 ? 'var(--ko-color-primary)' : 'var(--ko-color-neutral)' }}
          >
            <span className="text-2xl font-bold text-white">{order !== undefined ? order : "—"}</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{candidate.displayName}</h3>
            {candidate.organization && (
              <p className="mt-1 text-sm text-gray-600">{candidate.organization}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="text-3xl font-bold text-gray-900">{match !== undefined ? `${Math.round(match)}%` : "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
