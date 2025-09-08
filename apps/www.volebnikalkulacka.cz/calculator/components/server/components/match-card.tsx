import { Card } from "@repo/design-system/server";

import type { CandidateViewModel } from "../../../view-models";

export type MatchCard = {
  candidate: CandidateViewModel;
  order?: number;
  match?: number;
};

export function MatchCard({ candidate, order, match }: MatchCard) {
  return (
    <Card corner="topLeft">
      <div>
        <div>
          <div>{order !== undefined ? `${order}.` : "—"}</div>
        </div>
        <div>
          <div>{candidate.displayName}</div>
          {candidate.organization && (
            <div>{candidate.organization}</div>
          )}
        </div>
        <span>{match !== undefined ? `${match} %` : "—"}</span>
      </div>
    </Card>
  );
}
