export const themeNames = ["default"] as const;

export type ThemeName = (typeof themeNames)[number];
