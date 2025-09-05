import { Card } from "@repo/design-system/server";

import type { Candidate } from "../../../../../../packages/schema/schemas/candidate.schema";

export type ResultCard = {
  candidate: Candidate;
  order: number;
  matchPercentage: number;
};

export function ResultCard({ candidate, order, matchPercentage }: ResultCard) {
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
