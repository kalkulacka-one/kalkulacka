import { Card } from "@repo/design-system/server";

import type { Candidate } from "../../../../../../packages/schema/schemas/candidate.schema";

export type MatchCard = {
  candidate: Candidate;
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
        </div>
        <span>{match !== undefined ? `${match} %` : "—"}</span>
      </div>
    </Card>
  );
}
