export const themeNames = ["default"] as const;

export type ThemeName = (typeof themeNames)[number];

/**
 * Whether a theme ships one palette only. This site has no partner theme —
 * the default is the only one, and it is authored for both modes — so the
 * shell menu's light/dark toggle is never withheld here. Kept as the same
 * question the Czech app's menu asks, so a partner theme that pins
 * `color-scheme: light` in its stylesheet can be added by listing it.
 */
export function isSingleModeTheme(name: ThemeName): boolean {
  return name !== "default";
}
