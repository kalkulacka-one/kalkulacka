import { Card } from "@repo/design-system/server";

import type { Candidate } from "../../../../../../packages/schema/schemas/candidate.schema";

export type MatchCard = {
  candidate: Candidate;
  order: number;
  matchPercentage: number;
};

export function MatchCard({ candidate, order, matchPercentage }: MatchCard) {
  return (
    <Card corner="topLeft">
      <div>
        <div>
          <div>{order}.</div>
        </div>
        <div>
          <div>{candidate.displayName}</div>
        </div>
        <span>{matchPercentage} %</span>
      </div>
    </Card>
  );
}
