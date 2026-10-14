import { Badge } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";

import type { RoundState } from "@/view-models";

export type RoundBadge = {
  round?: RoundState;
};

/** The current round of an election with more than one; nothing otherwise. */
export function RoundBadge({ round }: RoundBadge) {
  const t = useTranslations("koa.components.roundBadge");
  if (round === undefined || round.total <= 1) return null;
  return <Badge color="primary">{t("round", { round: round.current })}</Badge>;
}
