import { AppMenu, type calculateMatches } from "@kalkulacka-one/app";

import { isSingleModeTheme } from "@/config/themes";
import { useCalculatorActions } from "@/hooks/calculator-actions";
import type { RouteSegments } from "@/lib/routing";

import { useEmbed } from "./embed-context-provider";

export type CalculatorMenu = {
  segments: RouteSegments;
  /** The ranking, on the screens that have one — saved along with the answers on the way out. */
  matches?: ReturnType<typeof calculateMatches>;
};

/**
 * The shell menu, wired to this app: it goes into every calculator screen's
 * `headerActions` slot, where the close button used to be.
 *
 * What the menu offers is decided here rather than in the screens, because it
 * is this app that knows two things the menu does not: whether it is inside
 * a partner iframe (no "Opustit kalkulačku" there — navigating the iframe to
 * our homepage is not leaving, it is getting lost), and whether that
 * partner's theme is single-mode (no light/dark toggle then; it would
 * visibly do nothing).
 */
export function CalculatorMenu({ segments, matches }: CalculatorMenu) {
  const embed = useEmbed();
  const { leave, restart } = useCalculatorActions({ segments, matches });

  const singleModeTheme = embed.isEmbed && embed.config?.theme !== undefined && isSingleModeTheme(embed.config.theme);

  return <AppMenu embed={embed.isEmbed} colorModeToggle={!singleModeTheme} onRestart={restart} onLeave={leave} />;
}
