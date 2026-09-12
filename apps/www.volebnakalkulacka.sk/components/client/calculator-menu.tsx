import { AppMenu, type calculateMatches } from "@kalkulacka-one/app";

import { isSingleModeTheme } from "@/config/themes";
import { useCalculatorActions } from "@/hooks/calculator-actions";
import type { RouteSegments } from "@/lib/routing";

import { useEmbed } from "./embed-context-provider";

export type CalculatorMenu = {
  segments: RouteSegments;
  /** The ranking, on the screens that have one — saved along with the answers on the way out. */
  matches?: ReturnType<typeof calculateMatches>;
  /**
   * A screen that only *shows* a calculator rather than being inside one —
   * the public shared result. The menu keeps help and the mode switch and
   * drops "Začít znovu" and "Opustit kalkulačku", which act on the viewer's
   * own answers and progress; that page is somebody else's result.
   */
  readOnly?: boolean;
};

/*
 * What the two actions become on a read-only screen. The menu offers neither
 * item there, so neither could be reached anyway — but the hook behind them
 * reads whichever answers store is nearest, which on the public result holds
 * the *shared* answers, and a leave that saved those over the viewer's own
 * session is not a path worth leaving open by accident. Cut off here rather
 * than trusted to stay unreachable.
 */
const noop = () => {};

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
export function CalculatorMenu({ segments, matches, readOnly = false }: CalculatorMenu) {
  const embed = useEmbed();
  const { leave, restart } = useCalculatorActions({ segments, matches });

  const singleModeTheme = embed.isEmbed && embed.config?.theme !== undefined && isSingleModeTheme(embed.config.theme);

  return <AppMenu readOnly={readOnly} embed={embed.isEmbed} colorModeToggle={!singleModeTheme} onRestart={readOnly ? noop : restart} onLeave={readOnly ? noop : leave} />;
}
