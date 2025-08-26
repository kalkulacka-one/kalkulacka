export const themeNames = ["default", "generace-f"] as const;

export type ThemeName = (typeof themeNames)[number];
