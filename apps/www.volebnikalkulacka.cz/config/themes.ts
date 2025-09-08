export const themeNames = ["default", "alarm"] as const;

export type ThemeName = (typeof themeNames)[number];
