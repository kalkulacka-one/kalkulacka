export const themeNames = ["default", "alarm", "prima"] as const;

export type ThemeName = (typeof themeNames)[number];
