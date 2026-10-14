import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { MatchCard } from "@/client";
import type { ResultViewModel } from "@/view-models";

export type EliminatedMatches = {
  result: ResultViewModel;
};

/** The candidates out of the current round, behind a toggle; nothing when there are none. */
export function EliminatedMatches({ result }: EliminatedMatches) {
  const t = useTranslations("koa.components.eliminatedMatches");
  const [shown, setShown] = useState(false);
  const eliminated = result.eliminated ?? [];
  if (eliminated.length === 0) return null;

  return (
    <>
      <div className="koa:mt-4 koa:flex koa:justify-center">
        <Button variant="link" color="neutral" size="small" onClick={() => setShown(!shown)} aria-expanded={shown}>
          {shown ? t("hide") : t("show", { count: eliminated.length })}
        </Button>
      </div>
      {shown && (
        <div className="koa:mt-4 koa:grid koa:gap-4">
          {eliminated.map((match) => (
            <MatchCard key={match.candidate.id} {...match} />
          ))}
        </div>
      )}
    </>
  );
}
