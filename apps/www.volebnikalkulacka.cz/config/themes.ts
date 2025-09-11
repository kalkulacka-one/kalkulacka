export const themeNames = ["default", "diky-ze-muzem", "alarm"] as const;

export type ThemeName = (typeof themeNames)[number];
