export const themeNames = ["default", "diky-ze-muzem", "alarm", "prima"] as const;

export type ThemeName = (typeof themeNames)[number];

/**
 * Whether a theme ships one palette only. The partner themes do — their
 * stylesheets in the design system pin `color-scheme: light` — which makes
 * the app's light/dark toggle a control that would do nothing under them, so
 * the shell menu withholds it there. The default theme is the only one
 * authored for both modes.
 */
export function isSingleModeTheme(name: ThemeName): boolean {
  return name !== "default";
}
