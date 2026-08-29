export const themeNames = ["default", "diky-ze-muzem", "alarm", "prima"] as const;

export type ThemeName = (typeof themeNames)[number];
