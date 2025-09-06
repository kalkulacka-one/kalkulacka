export const themeNames = ["default", "diky-ze-muzem"] as const;

export type ThemeName = (typeof themeNames)[number];
