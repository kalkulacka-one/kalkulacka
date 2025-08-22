import fs from "node:fs";
import path from "node:path";

const THEMES: Record<string, string> = {
  default: "www.volebnikalkulacka.cz/default.css",
  idnes: "www.volebnikalkulacka.cz/idnes.css",
};

const DEFAULT_THEME_KEY = "default";

export const getTheme = (themeName?: string): string => {
  const themeKey = themeName && THEMES[themeName] ? themeName : DEFAULT_THEME_KEY;
  const themeFile = THEMES[themeKey];

  if (!themeFile) {
    console.error(`❌ [ThemeSwitcher]: Could not find a theme file for key: ${themeKey}`);
    return "";
  }

  try {
    const filePath = path.join(process.cwd(), "../..", "packages", "design-system", "src", "themes", themeFile);
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`❌ [ThemeSwitcher]: Failed to read theme file: ${themeFile}`, error);
    return "";
  }
};
